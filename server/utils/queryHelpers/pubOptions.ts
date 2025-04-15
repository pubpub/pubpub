import {
	Collection,
	CollectionAttribution,
	CollectionPub,
	Commenter,
	Community,
	CrossrefDepositRecord,
	Export,
	Page,
	PubAttribution,
	PubEdge,
	Release,
	Discussion,
	DiscussionAnchor,
	ReviewNew,
	Reviewer,
	Member,
	includeUserModel,
	Draft,
	ScopeSummary,
	Submission,
	SubmissionWorkflow,
	Doc,
} from 'server/models';
import { PubGetOptions } from 'types';

import type { IncludeOptions } from 'sequelize';
import { getPubEdgeIncludes } from './pubEdgeOptions';
import { baseAuthor, baseThread, baseVisibility } from './util';

export default ({
	isAuth,
	isPreview,
	getCollections,
	getMembers,
	getCommunity,
	getEdges = 'approved-only',
	getEdgesOptions,
	getExports,
	getDraft,
	getDiscussions,
	getSubmissions,
	getFullReleases,
}: PubGetOptions) => {
	const allowUnapprovedEdges = getEdges === 'all';
	/* Initialize values assuming all inputs are false. */
	/* Then, iterate over each input and adjust */
	/* variables as needed */
	let pubAttributes;
	let pubAttributions = [
		{
			model: PubAttribution,
			as: 'attributions',
			separate: true,
			include: [includeUserModel({ as: 'user' })],
		},
	];
	let pubMembers: any = [];
	let pubEdges: any = [];
	let pubReleases = [
		{
			model: Release,
			as: 'releases',
			separate: true,
			order: [['createdAt', 'ASC']],
		},
	] as IncludeOptions[];
	let collectionPubs: any = [];
	let community: any = [];
	let anchors = [{ model: DiscussionAnchor, as: 'anchors' }];
	let author = baseAuthor;
	let thread = baseThread;
	if (isPreview) {
		pubAttributes = [
			'id',
			'slug',
			'title',
			'htmlTitle',
			'description',
			'htmlDescription',
			'labels',
			'avatar',
			'doi',
			'communityId',
			'customPublishedAt',
			'createdAt',
			'updatedAt',
		];
		author = [];
		thread = [];
		anchors = [];
	}
	if (isAuth) {
		pubAttributes = ['id'];
		pubReleases = [];
		pubAttributions = [];
		author = [];
		thread = [];
		anchors = [];
	}
	if (getMembers) {
		pubMembers = [{ model: Member, as: 'members' }];
	}
	if (getEdges) {
		pubEdges = [
			{
				model: PubEdge,
				as: 'outboundEdges',
				separate: true,
				include: getPubEdgeIncludes({
					...getEdgesOptions,
					includeTargetPub: true,
				}),
				order: [['rank', 'ASC']],
			},
			{
				model: PubEdge,
				as: 'inboundEdges',
				separate: true,
				include: getPubEdgeIncludes({ ...getEdgesOptions, includePub: true }),
				where: !allowUnapprovedEdges && { approvedByTarget: true },
				order: [['rank', 'ASC']],
			},
		];
	}

	if (getFullReleases) {
		pubReleases = [
			{
				model: Release,
				as: 'releases',
				separate: true,
				include: [
					{
						model: Doc,
						as: 'doc',
					},
				],
			},
		];
	}

	if (getCollections) {
		const shouldFetchCollection = getCollections === true || getCollections.collection;
		const isNested = typeof getCollections === 'object';

		const { page, members, attributions } = shouldFetchCollection
			? isNested
				? typeof getCollections.collection === 'object'
					? getCollections.collection
					: {
							page: false,
							members: false,
							attributions: false,
					  }
				: {
						page: true,
						members: true,
						attributions: true,
				  }
			: {
					page: false,
					members: false,
					attributions: false,
			  };

		collectionPubs = [
			{
				model: CollectionPub,
				as: 'collectionPubs',
				separate: true,
				order: [['pubRank', 'ASC']],
				...(shouldFetchCollection && {
					include: [
						{
							model: Collection,
							as: 'collection',
							include: [
								page && {
									model: Page,
									as: 'page',
									attributes: ['id', 'title', 'slug'],
								},
								members && {
									model: Member,
									as: 'members',
								},
								attributions && {
									model: CollectionAttribution,
									as: 'attributions',
									include: [includeUserModel({ as: 'user' })],
								},
							].filter(Boolean),
						},
					],
				}),
			},
		];
	}
	if (getCommunity) {
		community = [
			{
				model: Community,
				as: 'community',
				attributes: [
					'id',
					'subdomain',
					'domain',
					'title',
					'accentColorLight',
					'accentColorDark',
					'headerLogo',
					'headerColorType',
					'publishAs',
				],
			},
		];
	}
	const visibility = baseVisibility;
	return {
		attributes: pubAttributes,
		include: [
			...pubAttributions,
			...pubReleases,
			...pubMembers,
			...pubEdges,
			getExports && {
				model: Export,
				as: 'exports',
				separate: true,
			},
			getDraft && {
				model: Draft,
				as: 'draft',
			},
			getSubmissions && {
				model: Submission,
				as: 'submission',
				include: [{ model: SubmissionWorkflow, as: 'submissionWorkflow' }],
			},
			getDiscussions && {
				separate: true,
				model: Discussion,
				as: 'discussions',
				include: [
					...author,
					...anchors,
					...visibility,
					...thread,
					{ model: Commenter, as: 'commenter' },
				],
			},
			{
				separate: true,
				model: ReviewNew,
				as: 'reviews',
				include: [
					...author,
					...visibility,
					...thread,
					{ model: Reviewer, as: 'reviewers' },
				],
			},
			{
				model: CrossrefDepositRecord,
				as: 'crossrefDepositRecord',
			},
			{
				model: ScopeSummary,
				as: 'scopeSummary',
			},
			...collectionPubs,
			...community,
		].filter((x) => x),
	};
};
