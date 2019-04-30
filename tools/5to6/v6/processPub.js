/* eslint-disable no-console */
import { Branch, BranchPermission } from './models';

const uuid = require('uuid');

const { matchTransformHash, updateTransformHash } = require('./transformHash');

const generateHash = (length) => {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index += 1) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
};

const makeBranchIdGenerator = (transformed) => {
	const { draftBranch, namedBranches } = transformed;
	const draftBranchId = uuid.v4();
	const branchToIdMap = new Map();
	Object.values(namedBranches).forEach((branch) => {
		branchToIdMap.set(branch, uuid.v4());
	});
	return (branch) => {
		if (branch === draftBranch) {
			return draftBranchId;
		}
		return branchToIdMap.get(branch);
	};
};

const getBranchIdForVersionId = (versionPermission, transformed, branchIdGenerator) => {
	const { draftBranch, namedBranches, versionToBranch } = transformed;
	const { versionId } = versionPermission;
	if (versionId) {
		const proposedBranchName = versionToBranch[versionId];
		if (proposedBranchName) {
			return branchIdGenerator(namedBranches[proposedBranchName]);
		}
		throw new Error(`No version -> branch mapping exists for version id ${versionId}`);
	} else {
		return branchIdGenerator(draftBranch);
	}
};

const updateBranches = async (model, transformed, branchIdGenerator) => {
	const { id: pubId } = model;
	const { draftBranch, namedBranches } = transformed;
	await BranchPermission.destroy({ where: { pubId: pubId } });
	await Branch.destroy({ where: { pubId: pubId } });
	await Branch.bulkCreate(
		[['draft', draftBranch]]
			.concat(Object.entries(namedBranches))
			.map(([title, branch], index, { length }) => {
				const branchId = branchIdGenerator(branch);
				return {
					id: branchId,
					shortId: index + 1,
					title: title,
					order: title === 'public' ? 1 : index / length,
					viewHash: generateHash(8),
					editHash: generateHash(8),
					pubId: pubId,
				};
			}),
	);
	await BranchPermission.bulkCreate(
		model.versionPermissions.map((versionPermission) => {
			const { createdAt, permissions, updatedAt, userId } = versionPermission;
			const branchId = getBranchIdForVersionId(
				versionPermission,
				transformed,
				branchIdGenerator,
			);
			return {
				createdAt: createdAt,
				updatedAt: updatedAt,
				userId: userId,
				pubId: pubId,
				branchId: branchId,
				permissions: permissions,
			};
		}),
	);
};

const createFirebaseJson = (transformed, branchIdGenerator) => {
	const branches = {};
	const { draftBranch, namedBranches } = transformed;
	branches[`branch-${branchIdGenerator(draftBranch)}`] = draftBranch;
	Object.values(namedBranches).forEach((branch) => {
		branches[`branch-${branchIdGenerator(branch)}`] = branch;
	});
	return branches;
};

const processPub = async (storage, pubId, writeToFirebase, { current, total }) => {
	console.log(`~~~~~~~~ Processing pub ${pubId} (${current}/${total}) ~~~~~~~~`);
	const pubDir = storage.within(`pubs/${pubId}`);
	const model = JSON.parse(pubDir.read('model.json'));
	const { transformed } = JSON.parse(pubDir.read('transformed.json'));
	const branchIdGenerator = makeBranchIdGenerator(transformed);
	const firebaseJson = createFirebaseJson(transformed, branchIdGenerator);
	const hasTransformBeenUploaded = matchTransformHash(pubDir);
	if (hasTransformBeenUploaded) {
		console.log('OK: already wrote this pub');
	} else {
		try {
			await updateBranches(model, transformed, branchIdGenerator);
			await writeToFirebase(pubId, firebaseJson);
			updateTransformHash(pubDir);
			console.log('OK: wrote this pub successfully!');
		} catch (error) {
			console.log('FAILURE:', error.toString());
		}
	}
};

module.exports = processPub;
