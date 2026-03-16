/*
scanSpamUsers -- two-phase bulk spam detection tool

usage:
  npm run tools scanSpamUsers --analyze --output results.json [--min-score N] [--input skip.json] [--since 2024-01-01] [--concurrency 10]
  npm run tools scanSpamUsers --execute --input results.json [--min-score N] [--signals sig1,sig2] [--range 0-100] [--concurrency 10]

analyze phase:
  scans all users without an existing spam tag, computes spam scores, and
  writes a json file with detailed evidence for each flagged user. the file
  contains an array of entries sorted by score descending.

  --output <path>        required. where to write the results json.
  --min-score <n>        minimum score to include in output. default 5.
  --input <path>         optional. path to an existing results json whose
                         user ids will be skipped (so you can re-run
                         incrementally).
  --since <date|duration> only scan users created after this date (ISO string)
                         or relative duration like "24h", "7d". useful for
                         incremental cron runs.
  --concurrency <n>      how many users to process in parallel. default 10.
  --include-clean        also write a separate .clean.json file with users
                         that scored > 0 but below --min-score. useful for
                         reviewing false negatives.

execute phase:
  reads a results json produced by --analyze and applies spam tags to the
  users in it, subject to filters.

  --input <path>         required. the results json from analyze.
  --min-score <n>        only tag users whose score >= n.
  --signals <s1,s2,...>  only tag users who have ALL of these signals.
  --range <start>-<end>  only process entries whose index is in [start, end)
                         (0-based, as shown in the output file).
  --concurrency <n>      how many users to tag in parallel. default 5.

output file format (json array):
  each entry has:
    index          sequential 0-based index
    userId         user uuid
    email          user email
    slug           user slug (username)
    fullName       user display name
    createdAt      account creation timestamp
    score          computed spam score
    signals        array of signal names
    commentCount   total number of comments by this user
    commentsWithLinks  how many of those contain links
    recentComments     up to 5 most recent comments that contain links,
                       each with { text, links }
    profile        { website, bio, bioUrls } -- present when profile
                   signals fired
*/
/** biome-ignore-all lint/performance/noAwaitInLoops: batch pagination loop is inherently sequential */

import type { DocJson } from 'types';

import * as fs from 'fs';
import { Op } from 'sequelize';

import { ThreadComment, User } from 'server/models';
import { extractLinksFromContent, extractUrlsFromString } from 'server/spamTag/commentSpam';
import { containsLink } from 'server/spamTag/contentAnalysis';
import { upsertSpamTag } from 'server/spamTag/userQueries';
import { type SignalHit, computeUserSpamReport } from 'server/spamTag/userScore';
import { asyncMap } from 'utils/async';
import { JsonArrayWriter } from 'utils/jsonArrayWriter';

const BATCH_SIZE = 50;
const DEFAULT_MIN_SCORE = 5;
const DEFAULT_ANALYZE_CONCURRENCY = 10;
const DEFAULT_EXECUTE_CONCURRENCY = 5;

type CommentEvidence = {
	text: string;
	links: string[];
};

type AnalyzeEntry = {
	index: number;
	userId: string;
	email: string;
	slug: string;
	fullName: string;
	createdAt: string;
	score: number;
	signals: string[];
	signalHits: SignalHit[];
	commentCount: number;
	commentsWithLinks: number;
	recentComments: CommentEvidence[];
	profile: {
		website: string | null;
		bio: string | null;
		bioUrls: string[];
	} | null;
};

const parseArg = (name: string): string | null => {
	const prefix = `--${name}=`;
	const combined = process.argv.find((a) => a.startsWith(prefix));
	if (combined) return combined.slice(prefix.length);

	const idx = process.argv.indexOf(`--${name}`);
	if (idx === -1 || idx + 1 >= process.argv.length) return null;

	const next = process.argv[idx + 1];
	if (next.startsWith('--')) return null;

	return next;
};

const hasFlag = (name: string): boolean => process.argv.includes(`--${name}`);

const parseSinceArg = (value: string | null): Date | null => {
	if (!value) return null;

	const durationMatch = value.match(/^(\d+)([hd])$/);
	if (durationMatch) {
		const amount = parseInt(durationMatch[1], 10);
		const unit = durationMatch[2];
		const ms = unit === 'h' ? amount * 3600_000 : amount * 86_400_000;
		return new Date(Date.now() - ms);
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		console.error(
			`invalid --since value: ${value} (use ISO date or duration like "24h", "7d")`,
		);
		process.exit(1);
	}

	return date;
};

const getRecentCommentsWithLinks = async (
	userId: string,
	limit: number,
): Promise<{ total: number; withLinks: number; evidence: CommentEvidence[] }> => {
	const comments = await ThreadComment.findAll({
		where: { userId },
		attributes: ['content', 'text', 'createdAt'],
		order: [['createdAt', 'DESC']],
		limit: 200,
	});

	const evidence: CommentEvidence[] = [];
	let withLinks = 0;

	for (const comment of comments) {
		const doc = comment.content as DocJson | null;
		const text = comment.text ?? '';

		if (!containsLink(doc, text)) continue;

		withLinks++;

		if (evidence.length < limit) {
			const links = [
				...(extractLinksFromContent(doc) ?? []),
				...(extractUrlsFromString(text) ?? []),
			];
			evidence.push({ text: text.slice(0, 500), links: [...new Set(links)] });
		}
	}

	return { total: comments.length, withLinks, evidence };
};

const buildEntry = async (
	user: User,
	report: { score: number; signals: string[]; signalHits: SignalHit[] },
): Promise<AnalyzeEntry> => {
	const commentInfo = await getRecentCommentsWithLinks(user.id, 5);
	const hasProfileSignal = report.signals.some((s) => s.includes('website') || s.includes('bio'));

	const profile = hasProfileSignal
		? {
				website: user.website ?? null,
				bio: user.bio ?? null,
				bioUrls: extractUrlsFromString(user.bio) ?? [],
			}
		: null;

	return {
		index: 0,
		userId: user.id,
		email: user.email ?? '',
		slug: user.slug,
		fullName: user.fullName,
		createdAt: String(user.createdAt),
		score: report.score,
		signals: report.signals,
		signalHits: report.signalHits,
		commentCount: commentInfo.total,
		commentsWithLinks: commentInfo.withLinks,
		recentComments: commentInfo.evidence,
		profile,
	};
};

async function analyze() {
	const outputPath = parseArg('output');
	if (!outputPath) {
		console.error('--output is required for --analyze');
		process.exit(1);
	}

	const minScore = parseInt(parseArg('min-score') ?? String(DEFAULT_MIN_SCORE), 10);
	const concurrency = parseInt(
		parseArg('concurrency') ?? String(DEFAULT_ANALYZE_CONCURRENCY),
		10,
	);
	const sinceDate = parseSinceArg(parseArg('since'));
	const includeClean = hasFlag('include-clean');
	const cleanPath = includeClean ? outputPath.replace(/\.json$/, '.clean.json') : null;

	const skipIds = new Set<string>();
	const inputPath = parseArg('input');
	if (inputPath) {
		const existing: AnalyzeEntry[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
		for (const e of existing) skipIds.add(e.userId);
		console.log(`loaded ${skipIds.size} user ids to skip from ${inputPath}`);
	}

	const sinceLabel = sinceDate ? ` since=${sinceDate.toISOString()}` : '';
	const cleanLabel = cleanPath ? ` clean=${cleanPath}` : '';
	console.log(
		`analyzing users (min-score=${minScore}, concurrency=${concurrency}${sinceLabel}${cleanLabel}, output=${outputPath})`,
	);

	const writer = new JsonArrayWriter<AnalyzeEntry>(outputPath);
	const cleanWriter = cleanPath ? new JsonArrayWriter<AnalyzeEntry>(cleanPath) : null;

	let offset = 0;
	let scanned = 0;
	let errors = 0;

	const whereClause: Record<string, unknown> = {
		spamTagId: { [Op.is]: null as any },
	};

	if (sinceDate) {
		whereClause.createdAt = { [Op.gte]: sinceDate };
	}

	while (true) {
		const users = await User.findAll({
			where: whereClause,
			attributes: [
				'id',
				'fullName',
				'email',
				'slug',
				'title',
				'bio',
				'website',
				'createdAt',
				'updatedAt',
			],
			limit: BATCH_SIZE,
			offset,
			order: [['createdAt', 'DESC']],
		});

		if (users.length === 0) break;

		const toProcess = users.filter((u) => !skipIds.has(u.id));
		scanned += users.length;

		const results = await asyncMap(
			toProcess,
			async (user) => {
				try {
					const report = await computeUserSpamReport(user);
					return { user, report };
				} catch (err) {
					errors++;
					console.error(`error analyzing user ${user.id}:`, err);
					return null;
				}
			},
			{ concurrency },
		);

		for (const result of results) {
			if (!result) continue;

			const { user, report } = result;

			if (report.score >= minScore) {
				const entry = await buildEntry(user, report);
				entry.index = writer.length;
				writer.push(entry);
			} else if (cleanWriter && report.score > 0) {
				const entry = await buildEntry(user, report);
				entry.index = cleanWriter.length;
				cleanWriter.push(entry);
			}
		}

		console.log(
			`[${new Date().toISOString()}] scanned=${scanned} flagged=${writer.length}` +
				`${cleanWriter ? ` clean=${cleanWriter.length}` : ''} errors=${errors}`,
		);
		offset += BATCH_SIZE;
	}

	writer.close();
	cleanWriter?.close();

	console.log(`done. scanned=${scanned}, wrote ${writer.length} entries to ${outputPath}`);

	if (cleanWriter) {
		console.log(`wrote ${cleanWriter.length} clean (below-threshold) entries to ${cleanPath}`);
	}
}

async function execute() {
	const inputPath = parseArg('input');
	if (!inputPath) {
		console.error('--input is required for --execute');
		process.exit(1);
	}

	const entries: AnalyzeEntry[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
	const minScore = parseInt(parseArg('min-score') ?? '0', 10);
	const concurrency = parseInt(
		parseArg('concurrency') ?? String(DEFAULT_EXECUTE_CONCURRENCY),
		10,
	);
	const signalsArg = parseArg('signals');
	const requiredSignals = signalsArg ? signalsArg.split(',') : [];

	const rangeArg = parseArg('range');
	let rangeStart = 0;
	let rangeEnd = entries.length;
	if (rangeArg) {
		const [s, e] = rangeArg.split('-').map(Number);
		rangeStart = s;
		rangeEnd = e;
	}

	const filtered = entries.filter((entry) => {
		if (entry.index < rangeStart || entry.index >= rangeEnd) return false;
		if (entry.score < minScore) return false;

		if (requiredSignals.length > 0) {
			const hasAll = requiredSignals.every((s) => entry.signals.includes(s));
			if (!hasAll) return false;
		}

		return true;
	});

	console.log(
		`executing on ${inputPath}: ${entries.length} total, ${filtered.length} after filters, ` +
			`min-score=${minScore}, signals=${requiredSignals.join(',') || 'any'}, ` +
			`range=[${rangeStart}, ${rangeEnd}), concurrency=${concurrency}`,
	);

	let tagged = 0;
	let errors = 0;

	await asyncMap(
		filtered,
		async (entry) => {
			try {
				await upsertSpamTag({
					userId: entry.userId,
					fields: {
						suspiciousComments: entry.recentComments
							.flatMap((c) => c.links)
							.slice(0, 10),
						automatedScan: [
							{
								score: entry.score,
								signals: entry.signals,
								signalHits: entry.signalHits,
								scannedAt: new Date().toISOString(),
							},
						],
					},
				});

				tagged++;
				if (tagged % 50 === 0) {
					console.log(`progress: tagged=${tagged} errors=${errors}`);
				}
			} catch (err) {
				errors++;
				console.error(`error tagging user ${entry.userId} (${entry.slug}):`, err);
			}
		},
		{ concurrency },
	);

	console.log(
		`done. tagged=${tagged} skipped=${entries.length - filtered.length} errors=${errors}`,
	);
}

async function main() {
	if (hasFlag('analyze')) return analyze();
	if (hasFlag('execute')) return execute();
	console.error('specify --analyze or --execute');
	process.exit(1);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('fatal error:', err);
		process.exit(1);
	});
