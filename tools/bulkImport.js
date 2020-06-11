import { runBulkImportFromDirectory } from '../workers/tasks/import/bulk/bulk';

const {
	argv: { directory, ...args },
} = require('yargs');

const main = async () => {
	runBulkImportFromDirectory(directory, args);
};

main();
