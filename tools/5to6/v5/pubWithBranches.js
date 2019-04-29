/* eslint-disable no-console, no-restricted-syntax */
class PubWithBranches {
	constructor(pub, draftBranch, branchByNameMap, versionToBranchPointerMap) {
		this.pub = pub;
		this.draftBranch = draftBranch;
		this.branchByNameMap = branchByNameMap;
		this.versionToBranchPointerMap = versionToBranchPointerMap;
	}

	serialize() {
		const draftBranch = this.draftBranch.serialize();
		const namedBranches = {};
		const versionToBranch = {};
		for (const [key, value] of this.branchByNameMap) {
			namedBranches[key] = value.serialize();
		}
		for (const [version, branchPointer] of this.versionToBranchPointerMap) {
			versionToBranch[version.id] = branchPointer.branch.name;
		}
		return {
			draftBranch: draftBranch,
			namedBranches: namedBranches,
			versionToBranch: versionToBranch,
		};
	}
}

module.exports = PubWithBranches;
