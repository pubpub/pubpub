/* eslint-disable no-console, no-restricted-syntax */
const { docToString, jsonToDoc } = require('../util/docUtils');
const { error, warn } = require('../problems');

const { Change } = require('./changes');
const addDiscussions = require('./addDiscussions');
const Branch = require('./branch');
const PubWithBranches = require('./pubWithBranches');
const { IntermediateDocState, reconstructDocument } = require('./reconstructDocument');

function BranchPointer(branch, v5ChangeIndex, v6MergeIndex) {
	this.branch = branch;
	this.v5ChangeIndex = v5ChangeIndex;
	this.v6MergeIndex = v6MergeIndex;
}

const latestIntermediateStateBeforeVersion = (intermediateDocStates, version) => {
	const versionCreatedAtTime = new Date(version.createdAt).getTime();
	// Find the last IDS before the version was created
	const statesByDelta = intermediateDocStates
		.map((ids) => ({ ids: ids, delta: versionCreatedAtTime - ids.change.timestamp }))
		.filter(({ delta }) => delta >= 0)
		.sort((a, b) => a.delta - b.delta);
	if (statesByDelta.length) {
		return statesByDelta[0].ids;
	}
	return null;
};

const splitIntermediateDocStates = (states, targetState, targetDoc) => {
	const nextStates = [];
	const passedTargetState = false;
	const resultingState = null;
	for (const state of states) {
		const { change } = state;
		if (state === targetState && change.steps) {
			const stepSplit = change.steps.reduce(
				(reduceState, nextStep) => {
					const { firstSteps, secondSteps, seenTarget } = reduceState;
					if (seenTarget) {
						return { ...reduceState, secondSteps: [...secondSteps, nextStep] };
					}
					const isTargetStep = state.docsWithinChange.get(nextStep) === targetDoc;
					return {
						...reduceState,
						firstSteps: [...firstSteps, nextStep],
						seenTarget: isTargetStep,
					};
				},
				{ firstSteps: [], secondSteps: [], seenTarget: false },
			);
			const { firstSteps, secondSteps } = stepSplit;
			if (states.docsWithinChange.get(firstSteps[firstSteps.length - 1]) !== targetDoc) {
				throw error(
					"Assertion failed while splitting IDS: final step doesn't match target doc",
				);
			}
			const changes = [
				new Change(firstSteps, change.clientId, change.timestamp),
				new Change(secondSteps, change.clientId, change.timestamp),
			];
			const resultingStates = reconstructDocument(changes, nextStates[nextStates.length - 1]);
			if (resultingStates.length !== 2) {
				throw error(
					'Assertion failed while splitting IDS: wrong number of resulting states',
				);
			}
			nextStates.push(...resultingStates);
		} else if (passedTargetState) {
			state.index += 1;
			nextStates.push(
				new IntermediateDocState(
					state.doc,
					state.change,
					state.index + 1,
					state.docsWithinChange,
				),
			);
		} else {
			nextStates.push(state);
		}
	}
	return { nextStates: nextStates, resultingState: resultingState };
};

const mapVersionsToChangeIndices = (versions, intermediateDocStates) => {
	const versionIndexMap = new Map();
	versions.forEach((version) => {
		const versionDoc = jsonToDoc(
			Array.isArray(version.content) ? version.content[0] : version.content,
		);
		const versionDocAsString = docToString(versionDoc);
		console.log('Checking version id', version.id);
		const likelyMatch = latestIntermediateStateBeforeVersion(intermediateDocStates, version);
		const match = [likelyMatch]
			.filter((x) => x)
			.concat(intermediateDocStates)
			.find((s) => docToString(s.doc) === versionDocAsString);
		if (match) {
			versionIndexMap.set(version, match.index);
		} else {
			const matchWithinChange = intermediateDocStates
				.map((state) => {
					const docsWithinChange = [...state.docsWithinChange.values()];
					const matchingDocWithinChange = docsWithinChange.find(
						(docWithinChange) => docToString(docWithinChange) === versionDocAsString,
					);
					if (matchingDocWithinChange) {
						return { doc: matchingDocWithinChange, state: state };
					}
					return null;
				})
				.filter((x) => x)[0];
			if (matchWithinChange) {
				const splitResult = splitIntermediateDocStates(
					intermediateDocStates,
					matchWithinChange.state,
					matchWithinChange.doc,
				);
				// eslint-disable-next-line no-param-reassign
				intermediateDocStates = splitResult.nextStates;
				versionIndexMap.set(version, splitResult.resultingState.index);
				warn(`Split state at {splitResult.nextState.index} into two new states`);
			} else {
				error(`Version ${version.id} has no corresponding intermediate doc state.`, {
					isDiff: true,
					closest: likelyMatch ? likelyMatch.doc.toJSON() : '',
					actual: versionDoc.toJSON(),
				});
			}
		}
	});
	return { versionIndexMap: versionIndexMap, intermediateDocStates: intermediateDocStates };
};

const serializePubVersionPermissions = (pub, versionId) => {
	const { isPublic } = pub.versions.find((v) => v.id === versionId);
	const versionPermissions = pub.versionPermissions.filter((vp) => vp.versionId === versionId);
	const publicOrPrivateString = isPublic ? 'public' : 'private';
	const userPermissionsString = versionPermissions
		.sort((a, b) => a.userId - b.userId)
		.map((vp) => `${vp.userId}-${vp.permissions}`)
		.join('_');
	if (userPermissionsString.length > 0) {
		return `${publicOrPrivateString}__${userPermissionsString}`;
	}
	return publicOrPrivateString;
};

const buildPubWithBranches = (pub, changes, versionToChangeIndex) => {
	const branchByNameMap = new Map();
	const versionPermissionStringToBranchPointerMap = new Map();
	const versionToBranchPointerMap = new Map();
	// First, add a draft branch
	const draftBranch = new Branch('draft');
	changes.forEach((change) => draftBranch.addChange(change));
	// Now create a new branch for every combination of permissions we see
	Array.from(versionToChangeIndex.entries())
		.sort((a, b) => a[1] - b[1])
		.forEach(([version, changeIndex]) => {
			const vpString = serializePubVersionPermissions(pub, version.id);
			let branchPointer;
			if (versionPermissionStringToBranchPointerMap.has(vpString)) {
				// This means there's already a version with permissions identical to one that
				// we've seen before. So we can grab that branch.
				branchPointer = versionPermissionStringToBranchPointerMap.get(vpString);
			} else {
				// We need to start a new branch
				const nextBranch = new Branch(vpString);
				branchPointer = new BranchPointer(nextBranch, -1);
				branchByNameMap.set(vpString, nextBranch);
			}
			const { branch, v5ChangeIndex: previousEndIndex } = branchPointer;
			const merge = changes.slice(previousEndIndex + 1, changeIndex + 1);
			if (merge.length > 0) {
				branch.addMerge(merge, changeIndex);
			}
			const nextBranchPointer = new BranchPointer(
				branch,
				changeIndex,
				branch.getHighestMergeIndex(),
			);
			versionPermissionStringToBranchPointerMap.set(vpString, nextBranchPointer);
			versionToBranchPointerMap.set(version, nextBranchPointer);
		});
	return new PubWithBranches(pub, draftBranch, branchByNameMap, versionToBranchPointerMap);
};

const assertBranchPointersAreCorrect = (versionToBranchPointerMap, intermediateDocStates) => {
	versionToBranchPointerMap.forEach((branchPointer, version) => {
		const { branch, v6MergeIndex, v5ChangeIndex } = branchPointer;
		console.log('Checking branch for version id', version.id);
		const idsForBranch = branch.getDocState(v6MergeIndex);
		const idsForVersion = intermediateDocStates.find((ids) => ids.index === v5ChangeIndex);
		if (docToString(idsForBranch.doc) !== docToString(idsForVersion.doc)) {
			throw error('Branch does not contain correct subdocument');
		}
	});
};

const transformV5Pub = (pub, changes, checkBranchPointers = false) => {
	let intermediateDocStates = [...reconstructDocument(changes)];
	const mapResult = mapVersionsToChangeIndices(pub.versions, intermediateDocStates);
	const versionToChangeIndexMap = mapResult.versionIndexMap;
	intermediateDocStates = mapResult.intermediateDocStates;
	const pubWithBranches = buildPubWithBranches(pub, changes, versionToChangeIndexMap);
	addDiscussions(pub, pubWithBranches);
	if (checkBranchPointers) {
		assertBranchPointersAreCorrect(
			pubWithBranches.versionToBranchPointerMap,
			intermediateDocStates,
		);
	}
	return pubWithBranches;
};

module.exports = transformV5Pub;
