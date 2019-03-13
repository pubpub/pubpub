/**
 * Given a contentTuple of {globals, community, collection, pub}, picks out a community-level
 * skeleton to apply to the collectionTuple, yielding some submittable JSON.
 */
import journal from './community/journal';

export default (contentTuple) => {
	// TODO(ian): support literally anything else here
	return journal;
};
