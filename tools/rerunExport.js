import { Export } from 'server/models';
import { createLatestPubExports } from 'server/export/queries';

import { lookupBranch, lookupPub } from './utils/lookup';
import { promptOkay } from './utils/prompt';

const {
	argv: { pubId, pubSlug, branch: branchTitle = 'draft' },
} = require('yargs');

const main = async () => {
	const pub = await lookupPub({ slug: pubSlug, id: pubId });
	const branch = await lookupBranch({ pubId: pub.id, branchTitle });
	await promptOkay(
		`Really delete and re-create the latest exports for ${pub.slug}.${branch.title}?`,
		{ throwIfNo: true },
	);
	await Export.destroy({ where: { branchId: branch.id } });
	await createLatestPubExports(pub.id, branch.id);
	// eslint-disable-next-line no-console
	console.log('Worker tasks created.');
};

main().then(() => process.exit(0));
