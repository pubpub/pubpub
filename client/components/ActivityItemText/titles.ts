import {
	ActivityItemsContext,
	ActivityAssociations,
	WithId,
	ActivityAssociationModels,
	CommunityActivityItem,
	CollectionActivityItem,
	PubReleasedActivityItem,
	PubActivityItem,
	CollectionPubCreatedActivityItem,
	CollectionPubRemovedActivityItem,
	MemberActivityItem,
	PubEdgeCreatedActivityItem,
	PubEdgeRemovedActivityItem,
	PubDiscussionCommentAddedActivityItem,
	PubReviewCommentAddedActivityItem,
	PubReviewUpdatedActivityItem,
} from 'types';
import { communityUrl, pubShortUrl, pubUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';

export type Titled = {
	title: string;
	href?: null | string;
};

type AssociationTitleRenderer<T extends WithId> = (
	item: T,
	context: ActivityItemsContext,
) => Titled;
type AssociationTitleRenderers = {
	[K in keyof ActivityAssociations]: AssociationTitleRenderer<ActivityAssociations[K][string]>;
};

const getPubFromContext = (pubId: string, context: ActivityItemsContext) => {
	const {
		associations: {
			pub: { [pubId]: pub },
		},
	} = context;
	return pub;
};

const titleNotImplemented = () => {
	return { title: 'NOT_IMPLEMENTED' };
};

const titleRenderers: AssociationTitleRenderers = {
	collectionPub: titleNotImplemented,
	pubEdge: titleNotImplemented,
	threadComment: titleNotImplemented,
	thread: titleNotImplemented,
	collection: (collection) => {
		return {
			title: collection.title,
			href: getDashUrl({ collectionSlug: collection.slug }),
		};
	},
	community: (community) => {
		return {
			title: community.title,
			href: communityUrl(community),
		};
	},
	discussion: (discussion, context) => {
		const { pubId, id } = discussion;
		const pub = getPubFromContext(pubId, context);
		return {
			title: 'a discussion',
			href: pub ? pubUrl(null, pub, { hash: `discussion-${id}` }) : null,
		};
	},
	externalPublication: (externalPublication) => {
		return {
			title: externalPublication.title,
			url: externalPublication.url,
		};
	},
	pub: (pub) => {
		return {
			title: pub.title,
			href: getDashUrl({ pubSlug: pub.slug }),
		};
	},
	release: (release, context) => {
		const { pubId, id } = release;
		const pub = getPubFromContext(pubId, context);
		const title = 'a release';
		return {
			title,
			href: pub ? pubUrl(null, pub, { releaseId: id }) : null,
		};
	},
	review: (review) => {
		return {
			title: 'a review',
			href: getDashUrl({ mode: 'reviews', subMode: String(review.number) }),
		};
	},
	user: (user) => {
		return {
			title: user.fullName,
			href: `/user/${user.slug}`,
		};
	},
};

const renderItemTitle = <Kind extends keyof ActivityAssociationModels>(
	associationKind: Kind,
	context: ActivityItemsContext,
	itemId: string,
	payloadFallback: Titled,
): Titled => {
	const renderer = titleRenderers[associationKind] as AssociationTitleRenderer<
		ActivityAssociationModels[Kind]
	>;
	const index = context.associations[associationKind];
	const item = index[itemId] as ActivityAssociationModels[Kind];
	if (item) {
		return renderer(item, context);
	}
	return payloadFallback;
};

const communityTitler = (item: CommunityActivityItem, context: ActivityItemsContext) => {
	return {
		community: renderItemTitle('community', context, item.communityId, item.payload.community),
	};
};

const collectionTitler = (item: CollectionActivityItem, context: ActivityItemsContext) => {
	return {
		collection: renderItemTitle(
			'collection',
			context,
			item.collectionId,
			item.payload.collection,
		),
	};
};

const pubTitler = (item: PubActivityItem, context: ActivityItemsContext) => {
	return {
		pub: renderItemTitle('pub', context, item.pubId, item.payload.pub),
	};
};

const collectionPubTitler = (
	item: CollectionPubCreatedActivityItem | CollectionPubRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	return {
		pub: renderItemTitle('pub', context, item.pubId, item.payload.pub),
		collection: renderItemTitle(
			'collection',
			context,
			item.collectionId,
			item.payload.collection,
		),
	};
};

const pubAndReleaseTitler = (item: PubReleasedActivityItem, context: ActivityItemsContext) => {
	return {
		...pubTitler(item, context),
		release: renderItemTitle('release', context, item.payload.releaseId, {
			title: 'a release',
		}),
	};
};

const pubAndPubEdgeTitler = (
	item: PubEdgeCreatedActivityItem | PubEdgeRemovedActivityItem,
	context: ActivityItemsContext,
) => {
	const { target } = item.payload;
	const targetTitle: Titled =
		'externalPublication' in target
			? { title: target.externalPublication.title, href: target.externalPublication.url }
			: { title: target.pub.title, href: pubShortUrl(target.pub) };
	return {
		...pubTitler(item, context),
		target: targetTitle,
	};
};

const pubAndDiscussionTitler = (
	item: PubDiscussionCommentAddedActivityItem,
	context: ActivityItemsContext,
) => {
	return {
		...pubTitler(item, context),
		discussion: renderItemTitle('discussion', context, item.payload.discussionId, {
			title: 'a discussion',
		}),
	};
};

const pubAndReviewTitler = (
	item:
		| PubReviewCommentAddedActivityItem
		| PubReviewCommentAddedActivityItem
		| PubReviewUpdatedActivityItem,
	context: ActivityItemsContext,
) => {
	return {
		...pubTitler(item, context),
		review: renderItemTitle('review', context, item.payload.reviewId, { title: 'a review' }),
	};
};

const memberTitler = (item: MemberActivityItem, context: ActivityItemsContext) => {
	return {
		user: renderItemTitle('user', context, item.payload.userId, { title: 'deleted user' }),
	};
};

export const itemTitlers = {
	'community-created': communityTitler,
	'community-updated': communityTitler,
	'collection-created': collectionTitler,
	'collection-updated': collectionTitler,
	'collection-removed': collectionTitler,
	'collection-pub-created': collectionPubTitler,
	'collection-pub-removed': collectionPubTitler,
	'pub-created': pubTitler,
	'pub-updated': pubTitler,
	'pub-removed': pubTitler,
	'pub-edge-created': pubAndPubEdgeTitler,
	'pub-edge-removed': pubAndPubEdgeTitler,
	'pub-discussion-comment-added': pubAndDiscussionTitler,
	'pub-released': pubAndReleaseTitler,
	'pub-review-created': pubAndReviewTitler,
	'pub-review-comment-added': pubAndReviewTitler,
	'pub-review-updated': pubAndReviewTitler,
	'member-created': memberTitler,
	'member-updated': memberTitler,
	'member-removed': memberTitler,
};
