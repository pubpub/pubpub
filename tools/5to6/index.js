/* eslint-disable no-restricted-syntax */
require('ignore-styles');

const { storage, pubIds } = require('./setup');
const { queryPubUpdatedTimes } = require('./v5/queryPub');
const processPub = require('./v5/processPub');

const blacklist = [
	'0f21f44a-dc5e-4e8d-83b8-d1194e38d755', // Frankenbook
	'8f7503e4-6e51-4e13-8204-708ad04067ec', // Resisting Reduction
];

const getPubIds = () =>
	new Promise((resolve) => {
		const ids = [];
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', (data) => {
			ids.push(...data.trim().split('\n'));
		});
		process.stdin.on('end', () => resolve(ids));
	});

const main = async () => {
	const pipedPubIds = await getPubIds();
	const pubUpdatedAtTimes = await queryPubUpdatedTimes();
	(pipedPubIds.length ? pipedPubIds : pubIds)
		.filter((pubId) => !blacklist.includes(pubId))
		.reduce(
			(promise, pubId, index, arr) =>
				promise.then(() =>
					processPub(storage, pubId, pubUpdatedAtTimes, {
						current: index + 1,
						total: arr.length,
					}),
				),
			Promise.resolve(),
		);
};

main();
