/* eslint-disable no-console */
import { Op } from 'sequelize';

import { sequelize, Branch, Release } from 'server/models';
import { getBranchDoc } from 'server/utils/firebaseAdmin';
import { forEach } from '../util';

const bucketByProperty = (array, property) => {
	const res = {};
	array.forEach((el) => {
		const propValue = el[property];
		if (!res[propValue]) {
			res[propValue] = [];
		}
		res[propValue].push(el);
	});
	return res;
};

const handleReleasesForPub = async (pubId, releases) => {
	const allReleasesForPub = await Release.findAll({
		where: { pubId: pubId },
		order: [['createdAt', 'ASC']],
	});
	const branches = await Branch.findAll({ where: { pubId: pubId } });
	const draftBranch = branches.find((br) => br.title === 'draft');
	const publicBranch = branches.find((br) => br.title === 'public');
	console.log(`=== ${pubId} ===`);
	await Promise.all(
		releases.map(async (release) => {
			const { sourceBranchKey, historyKey } = release;
			if (
				typeof sourceBranchKey === 'number' &&
				typeof historyKey === 'number' &&
				sourceBranchKey !== historyKey
			) {
				const relatedMergeIndex = allReleasesForPub.findIndex(
					(otherRelease) => otherRelease.id === release.id,
				);

				const [
					{ doc: releaseDoc },
					{ doc: sourceBranchKeyDoc },
					{ doc: historyKeyDoc },
				] = await Promise.all([
					getBranchDoc(pubId, publicBranch.id, relatedMergeIndex),
					getBranchDoc(pubId, draftBranch.id, sourceBranchKey),
					getBranchDoc(pubId, draftBranch.id, historyKey),
				]);

				const releaseDocString = JSON.stringify(releaseDoc);
				const sourceBranchKeyMatches =
					releaseDocString === JSON.stringify(sourceBranchKeyDoc);
				const historyKeyMatches = releaseDocString === JSON.stringify(historyKeyDoc);
				if (historyKeyMatches) {
					console.log('History key is already correct');
				} else if (sourceBranchKeyMatches) {
					console.log('Setting historyKey = sourceBranchKey');
					await Release.update(
						{ historyKey: sourceBranchKey },
						{ where: { id: release.id } },
					);
				} else {
					console.log(
						'Neither historyKey nor sourceBranchKey points to the correct document',
					);
				}
			}
		}),
	);
};

module.exports = async () => {
	const releasesWithMismatchedKeys = await Release.findAll({
		where: {
			sourceBranchKey: {
				[Op.ne]: null,
			},
			historyKey: {
				[Op.and]: [{ [Op.ne]: -1 }, { [Op.ne]: sequelize.col('sourceBranchKey') }],
			},
		},
	});
	const releasesByPubId = bucketByProperty(releasesWithMismatchedKeys, 'pubId');
	await forEach(Object.entries(releasesByPubId), ([pubId, releases]) =>
		handleReleasesForPub(pubId, releases),
	);
};
