/*
scanSpamUsers -- two-phase bulk spam detection tool

usage:
  npm run tools scanSpamUsers --analyze --output results.json [--min-score N] [--input skip.json]
  npm run tools scanSpamUsers --execute --input results.json [--min-score N] [--signals sig1,sig2] [--range 0-100]

analyze phase:
  scans all users without an existing spam tag, computes spam scores, and
  writes a json file with detailed evidence for each flagged user. the file
  contains an array of entries sorted by score descending.

  --output <path>        required. where to write the results json.
  --min-score <n>        minimum score to include in output. default 4.
  --input <path>         optional. path to an existing results json whose
                         user ids will be skipped (so you can re-run
                         incrementally).

execute phase:
  reads a results json produced by --analyze and applies spam tags to the
  users in it, subject to filters.

  --input <path>         required. the results json from analyze.
  --min-score <n>        only tag users whose score >= n.
  --signals <s1,s2,...>  only tag users who have ALL of these signals.
  --range <start>-<end>  only process entries whose index is in [start, end)
                         (0-based, as shown in the output file).

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
/** biome-ignore-all lint/performance/noAwaitInLoops: sequential batch processing */

import type { DocJson } from 'types';

import * as fs from 'fs';
import { Op } from 'sequelize';

import { ThreadComment, User } from 'server/models';
import {
	containsLink,
	extractLinksFromDocJson,
	extractLinksFromText,
} from 'server/spamTag/contentAnalysis';
import { upsertSpamTag } from 'server/spamTag/userQueries';
import { computeUserSpamReport } from 'server/spamTag/userScore';
import { JsonArrayWriter } from 'utils/jsonArrayWriter';

const BATCH_SIZE = 100;
const DEFAULT_MIN_SCORE = 4;

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
			const links = [...extractLinksFromDocJson(doc), ...extractLinksFromText(text)];
			evidence.push({ text: text.slice(0, 500), links: [...new Set(links)] });
		}
	}
	return { total: comments.length, withLinks, evidence };
};

async function analyze() {
	const outputPath = parseArg('output');
	if (!outputPath) {
		console.error('--output is required for --analyze');
		process.exit(1);
	}
	const minScore = parseInt(parseArg('min-score') ?? String(DEFAULT_MIN_SCORE), 10);
	const skipIds = new Set<string>();
	const inputPath = parseArg('input');
	if (inputPath) {
		const existing: AnalyzeEntry[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
		for (const e of existing) skipIds.add(e.userId);
		console.log(`loaded ${skipIds.size} user ids to skip from ${inputPath}`);
	}

	console.log(`analyzing users (min-score=${minScore}, output=${outputPath})`);

	const writer = new JsonArrayWriter<AnalyzeEntry>(outputPath);
	let offset = 0;
	let scanned = 0;

	while (true) {
		const users = await User.findAll({
			where: { spamTagId: { [Op.is]: null as any } },
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

		for (const user of users) {
			scanned++;
			if (skipIds.has(user.id)) continue;
			try {
				const report = await computeUserSpamReport(user);
				if (report.score < minScore) continue;

				const commentInfo = await getRecentCommentsWithLinks(user.id, 5);
				const hasProfileSignal = report.signals.some(
					(s) => s.includes('website') || s.includes('bio'),
				);
				const profile = hasProfileSignal
					? {
							website: user.website ?? null,
							bio: user.bio ?? null,
							bioUrls: extractLinksFromText(user.bio),
						}
					: null;

				writer.push({
					index: writer.length,
					userId: user.id,
					email: user.email ?? '',
					slug: user.slug,
					fullName: user.fullName,
					createdAt: String(user.createdAt),
					score: report.score,
					signals: report.signals,
					commentCount: commentInfo.total,
					commentsWithLinks: commentInfo.withLinks,
					recentComments: commentInfo.evidence,
					profile,
				});
			} catch (err) {
				console.error(`error analyzing user ${user.id}:`, err);
			}
		}
		console.log(`scanned=${scanned} flagged=${writer.length}`);
		offset += BATCH_SIZE;
	}

	writer.close();
	console.log(`done. scanned=${scanned}, wrote ${writer.length} entries to ${outputPath}`);
}

async function execute() {
	const inputPath = parseArg('input');
	if (!inputPath) {
		console.error('--input is required for --execute');
		process.exit(1);
	}
	const entries: AnalyzeEntry[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
	const minScore = parseInt(parseArg('min-score') ?? '0', 10);
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

	console.log(
		`executing on ${inputPath}: ${entries.length} entries, ` +
			`min-score=${minScore}, signals=${requiredSignals.join(',') || 'any'}, ` +
			`range=[${rangeStart}, ${rangeEnd})`,
	);

	let tagged = 0;
	let skipped = 0;
	let errors = 0;

	for (const entry of entries) {
		if (entry.index < rangeStart || entry.index >= rangeEnd) {
			skipped++;
			continue;
		}
		if (entry.score < minScore) {
			skipped++;
			continue;
		}
		if (requiredSignals.length > 0) {
			const hasAll = requiredSignals.every((s) => entry.signals.includes(s));
			if (!hasAll) {
				skipped++;
				continue;
			}
		}
		try {
			// biome-ignore lint/performance/noAwaitInLoops: shh
			await upsertSpamTag({
				userId: entry.userId,
				fields: {
					suspiciousComments: entry.recentComments.flatMap((c) => c.links).slice(0, 10),
					automatedScan: [
						{
							score: entry.score,
							signals: entry.signals,
							scannedAt: new Date().toISOString(),
						},
					],
				},
			});
			tagged++;
			if (tagged % 50 === 0) {
				console.log(`progress: tagged=${tagged} skipped=${skipped} errors=${errors}`);
			}
		} catch (err) {
			errors++;
			console.error(`error tagging user ${entry.userId} (${entry.slug}):`, err);
		}
	}

	console.log(`done. tagged=${tagged} skipped=${skipped} errors=${errors}`);
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
