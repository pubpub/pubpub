import {
	ActivityItemKind,
	ActivityItemsContext,
	CollectionActivityItem,
	CollectionPubCreatedActivityItem,
	CollectionPubRemovedActivityItem,
	CommunityActivityItem,
	InsertableActivityItem,
	MemberActivityItem,
	PubActivityItem,
	PubDiscussionCommentAddedActivityItem,
	PubEdgeCreatedActivityItem,
	PubEdgeRemovedActivityItem,
	PubReleasedActivityItem,
	PubReviewCommentAddedActivityItem,
	PubReviewUpdatedActivityItem,
} from 'types';
import { communityUrl, pubShortUrl, pubUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';

export type Titled = {
	title: string;
	id?: null | string;
	href?: null | string;
};

type ItemTitler<K> = <
	AcceptedKinds extends ActivityItemKind,
	Item extends { kind: AcceptedKinds },
	ReturnType = K extends AcceptedKinds ? Record<string, Titled> : never
>(
	item: Item,
	context: ActivityItemsContext,
) => ReturnType;

type SomeItem =
	| PubActivityItem
	| CollectionPubCreatedActivityItem
	| CollectionPubRemovedActivityItem;

type X = SomeItem extends InsertableActivityItem ? true : false;


const titleCommunity = (item: CommunityActivityItem, context: ActivityItemsContext) => {
	const {
		associations: {
			community: { [item.communityId]: contextCommunity },
		},
	} = context;
	if (contextCommunity) {
		return {
			community: {
				title: contextCommunity.title,
				id: item.communityId,
				href: communityUrl(contextCommunity),
			},
		};
	}
	return {
		community: {
			id: item.communityId,
			title: item.payload.community.title,
		},
	};
};

const titleCollection = (
	item:
		| CollectionActivityItem
		| CollectionPubCreatedActivityItem
		| CollectionPubRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	const {
		associations: {
			collection: { [item.collectionId]: contextCollection },
		},
	} = context;
	if (contextCollection) {
		return {
			collection: {
				title: contextCollection.title,
				href: getDashUrl({ collectionSlug: contextCollection.slug }),
			},
		};
	}
	return {
		collection: {
			id: item.collectionId,
			title: item.payload.collection.title,
		},
	};
};

const titlePub = (
	item: PubActivityItem | CollectionPubCreatedActivityItem | CollectionPubRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	const {
		associations: {
			collection: { [item.pubId]: contextPub },
		},
	} = context;
	if (contextPub) {
		return {
			pub: {
				title: contextPub.title,
				href: getDashUrl({ pubSlug: contextPub.slug }),
			},
		};
	}
	return {
		pub: {
			title: item.payload.pub.title,
			id: item.pubId,
		},
	};
};

const titleCollectionPub = (
	item: CollectionPubCreatedActivityItem | CollectionPubRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	return {
		...titlePub(item, context),
		...titleCollection(item, context),
	};
};

const titlePubAndRelease = (item: PubReleasedActivityItem, context: ActivityItemsContext) => {
	const contextPub = getPubFromContext(item.pubId, context);
	const href = contextPub
		? pubUrl(null, contextPub, { releaseId: item.payload.releaseId })
		: null;

	return {
		...titlePub(item, context),
		release: {
			title: 'a Release',
			href,
		},
	};
};

const titlePubAndPubEdge = (
	item: PubEdgeCreatedActivityItem | PubEdgeRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	const { target } = item.payload;
	const targetTitle: Titled =
		'externalPublication' in target
			? { title: target.externalPublication.title, href: target.externalPublication.url }
			: { title: target.pub.title, href: pubShortUrl(target.pub) };
	return {
		...titlePub(item, context),
		target: targetTitle,
	};
};

const titlePubAndDiscussion = (
	item: PubDiscussionCommentAddedActivityItem,
	context: ActivityItemsContext,
) => {
	const contextPub = getPubFromContext(item.pubId, context);
	const href = contextPub
		? pubUrl(null, contextPub, { hash: `discussion-${item.payload.discussionId}` })
		: null;

	return {
		...titlePub(item, context),
		discussion: {
			title: 'a discussion',
			href,
		},
	};
};

const titlePubAndReview = (
	item:
		| PubReviewCommentAddedActivityItem
		| PubReviewCommentAddedActivityItem
		| PubReviewUpdatedActivityItem,
	context: ActivityItemsContext,
) => {
	const {
		associations: {
			review: { [item.payload.reviewId]: contextReview },
		},
	} = context;

	const href = contextReview
		? getDashUrl({ mode: 'reviews', subMode: String(contextReview.number) })
		: null;

	return {
		...titlePub(item, context),
		review: {
			title: 'a review',
			href,
		},
	};
};

const titleMember = (item: MemberActivityItem, context: ActivityItemsContext) => {
	const {
		associations: {
			user: { [item.payload.userId]: contextUser },
		},
	} = context;
	return {
		user: contextUser
			? { title: contextUser.fullName, href: `/user/${contextUser.slug}` }
			: { title: 'deleted user' },
	};
};

export const itemTitlers: { [K in ActivityItemKind]: ItemTitler<K> } = {
	'community-created': titleCommunity,
	'community-updated': titleCommunity,
	'collection-created': titleCollection,
	'collection-updated': titleCollection,
	'collection-removed': titleCollection,
	'collection-pub-created': titleCollectionPub,
	'collection-pub-removed': titleCollectionPub,
	'pub-created': titlePub,
	'pub-updated': titlePub,
	'pub-removed': titlePub,
	'pub-edge-created': titlePubAndPubEdge,
	'pub-edge-removed': titlePubAndPubEdge,
	'pub-discussion-comment-added': titlePubAndDiscussion,
	'pub-released': titlePubAndRelease,
	'pub-review-created': titlePubAndReview,
	'pub-review-comment-added': titlePubAndReview,
	'pub-review-updated': titlePubAndReview,
	'member-created': titleMember,
	'member-updated': titleMember,
	'member-removed': titleMember,
};
