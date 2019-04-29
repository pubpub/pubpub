/* eslint-disable no-console, no-restricted-syntax, no-continue */
const { error, warn } = require('../problems');

const makeDiscussionEntry = (key, from, to) => ({
	currentKey: key,
	initKey: key,
	initAnchor: from,
	initHead: to,
	selection: {
		type: 'text',
		a: from,
		h: to,
	},
});

const addDiscussionToBranch = (discussion, { branch, targetIndex }) => {
	const { highlights } = discussion;
	console.log('Processing discussion', discussion.id);
	if (highlights) {
		const [highlight] = highlights;
		let matchingEntry;
		for (const entry of branch.getIntermediateDocStates(null, true)) {
			const [indexInBranch, state] = entry;
			if (targetIndex !== undefined && indexInBranch !== targetIndex) {
				continue;
			}
			const { doc } = state;
			try {
				const highlightText = doc.textBetween(highlight.from, highlight.to);
				if (highlightText === highlight.exact) {
					matchingEntry = entry;
					break;
				}
			} catch (_) {
				continue;
			}
		}
		if (matchingEntry) {
			const [matchingIndex] = matchingEntry;
			branch.addDiscussion(
				discussion.id,
				makeDiscussionEntry(matchingIndex, highlight.from, highlight.to),
			);
		} else {
			warn('Unable to map discussion to intermediate document');
		}
	} else {
		branch.addDiscussion(discussion.id, makeDiscussionEntry(targetIndex || 1, null, null));
	}
};

const getCandidateBranchesForDiscussion = (pub, pubWithBranches, discussion) => {
	const versionId =
		discussion.content &&
		discussion.content.content &&
		discussion.content.content.reduce((foundVersionId, contentItem) => {
			if (foundVersionId) {
				return foundVersionId;
			}
			if (contentItem.attrs && contentItem.attrs.version) {
				return contentItem.attrs.version;
			}
			return null;
		}, null);
	const version = pub.versions.find((v) => v.id === versionId);
	if (version) {
		const branchPointer = pubWithBranches.versionToBranchPointerMap.get(version);
		return [
			{
				branch: branchPointer.branch,
				targetIndex: branchPointer.v6MergeIndex,
			},
		];
	}
	return Array.from(pubWithBranches.branchByNameMap.entries())
		.map(([key, branch]) => key.startsWith('public') && branch)
		.filter((x) => x)
		.sort((a, b) => b.getHighestIndex() - a.getHighestIndex())
		.concat([pubWithBranches.draftBranch])
		.map((branch) => ({ branch: branch }));
};

const logAttachAttempt = (discussion, { branch, targetIndex }, success) => {
	const result = success ? 'Attached' : 'Failed to attach';
	console.log(
		`${result} discussion ${discussion.id} to branch ${branch}${
			success
				? ''
				: ` at ${targetIndex !== undefined ? `target index ${targetIndex}` : 'any index'}`
		}`,
	);
};

module.exports = (pub, pubWithBranches, logAttempts = false) => {
	pub.discussions.forEach((discussion) => {
		const candidates = getCandidateBranchesForDiscussion(pub, pubWithBranches, discussion);
		if (candidates.length) {
			const succeeded = candidates.reduce((success, candidate) => {
				if (success) return success;
				let successHere;
				try {
					addDiscussionToBranch(discussion, candidate);
					successHere = true;
				} catch (_) {
					successHere = false;
				}
				if (logAttempts) {
					logAttachAttempt(discussion, candidate, successHere);
				}
				return successHere;
			}, false);
			if (!succeeded) {
				throw error(`Failed to attach discussion ${discussion.id} to any branch`);
			}
		} else {
			throw error('No candidate branches for pub');
		}
	});
};
