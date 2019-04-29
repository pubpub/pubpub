import { Branch, BranchPermission } from './models';

const uuid = require('uuid');

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

const updateBranches = async (model, transformed, branchIdGenerator) => {
	const { id: pubId } = model;
	const { draftBranch, namedBranches } = transformed;
	await Branch.destroy({ where: { pubId: pubId } });
	await Promise.all(
		[['draft', draftBranch]]
			.concat(Object.entries(namedBranches))
			.map(([title, branch], index, { length }) => {
				const branchId = branchIdGenerator(branch);
				return Branch.create({
					id: branchId,
					shortId: 1,
					title: title,
					order: title === 'public' ? 1 : index / length,
					viewHash: generateHash(8),
					editHash: generateHash(8),
					pubId: pubId,
				});
			}),
	);
};

const createFirebaseJson = (transformed, branchIdGenerator) => {
	const branches = {};
	const { draftBranch, namedBranches } = transformed;
	branches[branchIdGenerator(draftBranch)] = draftBranch;
	Object.values(namedBranches).forEach((branch) => {
		branches[branchIdGenerator(branch)] = branch;
	});
	return { branches: branches };
};

const processPub = async (storage, firebaseRef, pubId) => {
	const pubDir = storage.within(`pubs/${pubId}`);
	const model = JSON.parse(pubDir.read('model.json'));
	const { transformed } = JSON.parse(pubDir.read('transformed.json'));
	const branchIdGenerator = makeBranchIdGenerator(transformed);
    const firebaseJson = createFirebaseJson(transformed, branchIdGenerator);
	await updateBranches(model, transformed, branchIdGenerator);
	await firebaseRef.child(`pub-${pubId}`).set(firebaseJson);
};

module.exports = processPub;
