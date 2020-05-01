import ensureUserForAttribution from 'shared/utils/ensureUserForAttribution';
import sanitizeDiscussions from './discussionsSanitize';
import sanitizeForks from './forksSanitize';
import sanitizeReviews from './reviewsSanitize';
import getScope from './scopeGet';

const sanitizeHashes = (pubData, activePermissions) => {
	const { editHash, viewHash } = pubData;
	const { canView, canViewDraft, canEdit, canEditDraft } = activePermissions;
	return {
		viewHash: canView || canViewDraft ? viewHash : null,
		editHash: canEdit || canEditDraft ? editHash : null,
	};
};

export default async (pubData, initialData, releaseNumber) => {
	const { loginData, scopeData } = initialData;
	const { activePermissions } = scopeData;
	const { canView, canViewDraft, canEdit, canEditDraft, canAdminCommunity } = activePermissions;

	/* If there are no releases and the user does not have view access, they don't have scope-level */
	/* We then must check if they have pub-level access, otherwise we return null. */
	/* Returning null will cause a 404 error to be returned. */
	if (!pubData.releases.length && !canView && !canViewDraft) {
		const pubScopeData = await getScope({
			communityId: initialData.communityData.id,
			pubId: pubData.id,
			loginId: initialData.loginData.id,
		});
		const {
			canView: canViewPubScope,
			canViewDraft: canViewDraftPubScope,
		} = pubScopeData.activePermissions;
		if (!canViewPubScope && !canViewDraftPubScope) {
			return null;
		}
	}

	const isRelease = !!(releaseNumber || releaseNumber === 0);

	// TODO(ian): completely unsure why we can't just the `order` parameter within the `include`
	// object for the query made above, but it doesn't seem to work.
	const sortedReleases = pubData.releases
		.concat()
		.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1));

	const discussions = sanitizeDiscussions(pubData.discussions, activePermissions, loginData.id);
	const forks = sanitizeForks(pubData.forks, activePermissions, loginData.id);
	const reviews = sanitizeReviews(pubData.reviews, activePermissions, loginData.id);

	const filteredCollectionPubs = pubData.collectionPubs
		? pubData.collectionPubs.filter((item) => {
				return item.collection.isPublic || canAdminCommunity;
		  })
		: [];

	return {
		...pubData,
		...sanitizeHashes(pubData, activePermissions),
		attributions: pubData.attributions.map(ensureUserForAttribution),
		discussions: discussions,
		forks: forks,
		reviews: reviews,
		collectionPubs: filteredCollectionPubs,
		isReadOnly: isRelease || !(canEdit || canEditDraft),
		isRelease: isRelease,
		releases: sortedReleases,
		releaseNumber: releaseNumber,
	};
};
