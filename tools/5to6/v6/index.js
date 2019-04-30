const { storage } = require('../setup');
const getPipedPubIds = require('../util/getPipedPubIds');

const processPub = require('./processPub');
const createFirebaseWriter = require('./createFirebaseWriter');

const main = async () => {
	const pipedPubIds = await getPipedPubIds();
	const writeToFirebase = await createFirebaseWriter();
	pipedPubIds.reduce(
		(promise, pubId, index, arr) =>
			promise.then(() =>
				processPub(storage, pubId, writeToFirebase, {
					current: index + 1,
					total: arr.length,
				}),
			),
		Promise.resolve(),
	);
};

main();
