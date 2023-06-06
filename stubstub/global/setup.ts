/* eslint-disable no-console, global-require */
// require('ts-node').register({
// 	transpileOnly: true,
// 	project: require('path').join(process.cwd(), 'tsconfig.server.json'),
// });

import { ChildProcessWithoutNullStreams } from 'child_process';
import { setupTestDatabase, startTestDatabaseServer, initTestDatabase } from '../testDatabase';
// import { sequelize } from '../../server/sequelize';

// HACK(ian): The PUBPUB_SYNCING_MODELS_FOR_TEST_DB flag tells the code that we're only going to use
// it to sync Sequelize to a test database, and that it's safe to skip certain operations.
// In practice, we do this for the stupidest possible reason: because I can't figure out how to
// get any modules required() from here to acknowledge absolute import paths like "server/utils"
// instead of "../../server/utils". Since we use this absolute style extensively, we have to
// carefully limit what we require from here. Luckily, all we need is server/models.ts, and
// the handful of utilities that it must import.
//
// This is absurd, but it works. If you know how to fix this, please do!

// const withSyncingDbFlagSet = async (fn) => {
// 	process.env.PUBPUB_SYNCING_MODELS_FOR_TEST_DB = 'true';
// 	await fn();
// 	delete process.env.PUBPUB_SYNCING_MODELS_FOR_TEST_DB;
// };

// So we can set `global.testDbServerProcess` below
declare namespace global {
	let testDbServerProcess: ChildProcessWithoutNullStreams | undefined;
}

export default async () => {
	process.env.TZ = 'UTC';
	if (process.env.NODE_ENV !== 'test') {
		throw new Error('Something has gone terribly wrong and I refuse to proceed.');
	}
	if (!process.env.DATABASE_URL) {
		console.log('\nSit tight while a local test database is created...');
		await initTestDatabase();
		global.testDbServerProcess = await startTestDatabaseServer();
		process.env.DATABASE_URL = await setupTestDatabase();
	}

	// await withSyncingDbFlagSet(async () => {

	//	process.env.PUBPUB_SYNCING_MODELS_FOR_TEST_DB = 'true';
	/**
	 * Two things of note
	 * 1. Dynamic import inline instead of top-level import in order to set
	 * process.env.DATABASE_URL as in above
	 * 2. Imported from '../../server/models' instead of '../../server/sequelize' to
	 * guarantee that all models are imported
	 *
	 * If 2 is not done, then the models will not be imported and the
	 * sequelize.sync() will not create the tables in the test db,
	 * leading to "relation does not exist" errors when running tests
	 */
	const { sequelize } = await import('../../server/models');
	await sequelize.sync();
	//	delete process.env.PUBPUB_SYNCING_MODELS_FOR_TEST_DB;
	// });
};
