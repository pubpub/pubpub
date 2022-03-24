/* eslint-disable no-console */
import fs from 'fs';

import { Collection, CollectionPub } from 'server/models';
import { getBestDownloadUrl } from 'utils/pub/downloads';
import { getPubData } from 'server/rss/queries';
import fetch from 'node-fetch';
import { promptOkay } from './utils/prompt';
/** Usage: npm run tools exportCollection -- --collectionId collectionId */
const {
	argv: { collectionId },
} = require('yargs');

const getPubExports = async (pubId, dest) => {
	const [pubData] = await getPubData([pubId]);
	const finalDest = `${dest}/${pubData.slug}`;
	fs.mkdirSync(finalDest);
	// console.log(pubData);
	const pdfUrl = await getBestDownloadUrl(pubData, 'pdf');
	const jatsUrl = await getBestDownloadUrl(pubData, 'jats');
	if (jatsUrl) {
		fetch(jatsUrl).then((res) => {
			res.body.pipe(fs.createWriteStream(`${finalDest}/${pubData.slug}.xml`));
		});
	}
	if (pdfUrl) {
		fetch(pdfUrl).then((res) => {
			res.body.pipe(fs.createWriteStream(`${finalDest}/${pubData.slug}.pdf`));
		});
	}
};

const main = async () => {
	const query = {
		include: [
			{
				model: CollectionPub,
				as: 'collectionPubs',
				attributes: ['pubId'],
			},
		],
		where: { id: collectionId },
	};
	try {
		const collection = await Collection.findOne(query);
		await promptOkay(`Export ${collection.collectionPubs.length} pubs?`, {
			yesIsDefault: false,
			throwIfNo: true,
		});
		const dest = `/tmp/${collection.slug}`;
		fs.rmdirSync(dest, { recursive: true });
		fs.mkdirSync(dest);
		await Promise.all(
			collection.collectionPubs.map((collectionPub) =>
				getPubExports(collectionPub.pubId, dest),
			),
		);
	} catch (err) {
		console.warn(err);
	}
};

main().finally(() => process.exit(0));
