import { runBulkImportFromDirectory } from '../workers/tasks/import/bulk/bulk';

const {
	argv: { directory },
} = require('yargs');

const main = async () => {
	runBulkImportFromDirectory(directory);
};

main();
