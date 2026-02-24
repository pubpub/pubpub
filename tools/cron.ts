import { execSync } from 'child_process';
import cron from 'node-cron';

const log = (msg: string) => console.log(`[cron] ${new Date().toISOString()} ${msg}`);

function run(name: string, script: string) {
	log(`Starting: ${name}`);
	try {
		execSync(`pnpm run ${script}`, { stdio: 'inherit' });
		log(`Completed: ${name}`);
	} catch (err) {
		log(`Failed: ${name} — ${(err as Error).message}`);
	}
}

if (process.env.PUBPUB_PRODUCTION === 'true') {
	cron.schedule('0 */6 * * *', () => run('backup-db', 'tools-prod backupDb')); // Every 6 hours
	cron.schedule('0 5 * * *', () => run('email-activity-digest', 'tools-prod emailActivityDigest'));
} else {
	log('PUBPUB_PRODUCTION is not set — no jobs registered. Run tasks manually with: pnpm run tools-prod <task>');
}

log('Scheduler started');
