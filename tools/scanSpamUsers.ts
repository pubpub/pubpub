import { Op } from 'sequelize';

import { User } from 'server/models';
import { addSpamTagToUser } from 'server/spamTag/userQueries';
import { computeUserSpamReport } from 'server/spamTag/userScore';

const BATCH_SIZE = 100;
const SPAM_THRESHOLD = 4;

// pass --dry-run to only report without tagging
const dryRun = process.argv.includes('--dry-run');
// pass --threshold=N to override the default
const thresholdArg = process.argv.find((a) => a.startsWith('--threshold='));
const threshold = thresholdArg ? parseInt(thresholdArg.split('=')[1], 10) : SPAM_THRESHOLD;

async function main() {
	console.log(`scanning users for spam (threshold=${threshold}, dryRun=${dryRun})`);

	let offset = 0;
	let totalScanned = 0;
	let totalTagged = 0;
	let totalErrors = 0;

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
			totalScanned++;
			try {
				const report = await computeUserSpamReport(user);
				if (report.score < threshold) continue;

				console.log(
					`[SPAM] ${user.slug} (${user.email}) score=${report.score} signals=${report.signals.join(',')}`,
				);

				if (!dryRun) {
					await addSpamTagToUser(
						user.id,
						{
							suspiciousComments: report.fields.suspiciousCommentLinks,
						},
						{ skipNotification: true },
					);
				}
				totalTagged++;
			} catch (err) {
				totalErrors++;
				console.error(`error scanning user ${user.id}:`, err);
			}
		}

		console.log(
			`progress: scanned=${totalScanned} tagged=${totalTagged} errors=${totalErrors}`,
		);
		offset += BATCH_SIZE;
	}

	console.log(`done. scanned=${totalScanned} tagged=${totalTagged} errors=${totalErrors}`);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('fatal error:', err);
		process.exit(1);
	});
