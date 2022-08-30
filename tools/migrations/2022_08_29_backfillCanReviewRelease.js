import { asyncMap } from 'utils/async';

module.exports = async ({ models }) => {
	const { Pub } = models;
	await asyncMap(
		await Pub.findAll(),
		(pub) => {
			pub.canReviewRelease = false;
			return pub.save();
		},
		{ concurrency: 100 },
	);
};
