/* global describe, it, expect, beforeAll, afterAll */
import { makeUser, makeCommunity, setup, teardown, stub } from '../../../stubstub';
import { createBranch } from '../../branch/queries';
import { createCollection } from '../../collection/queries';
import { createCollectionPub } from '../../collectionPub/queries';
import { createDiscussion } from '../../discussion/queries';
import { createPub } from '../../pub/queries';
import { createReview } from '../../review/queries';
import * as firebaseAdmin from '../firebaseAdmin';

import { formatAndAuthenticatePub } from '../formatPub';
import { findPubQuery } from '../pubQueries';
import { Branch } from '../../models';

let firebaseStub;
let testCommunity;
let user;
let haplessUser;
let pub;
let pubManager;
let visibleBranchA;
let visibleBranchB;
let invisibleBranch;
let publicBranch;
let draftBranch;
let visibleDiscussionA;
let visibleDiscussionB;
let invisibleDiscussion;
let visibleReview;
let invisibleReview;
let visibleCollection;
let invisibleCollection;
let visibleCollectionPub;
let invisibleCollectionPub;

const makeDiscussion = ({
	discussionId,
	branchId,
	threadNumber,
	title = 'Uhh yeah a title',
	text = 'Hello, a discussion!',
	content = 'Some test content',
	initAnchorText = 'Some anchor text',
	...whateverElse
}) => ({
	discussionId: discussionId,
	title: title,
	content: content,
	text: text,
	initAnchorText: initAnchorText,
	pubId: pub.id,
	communityId: testCommunity.community.id,
	branchId: branchId,
	threadNumber: threadNumber,
	...whateverElse,
});

setup(beforeAll, async () => {
	firebaseStub = stub(firebaseAdmin, ['createFirebaseBranch', 'updateFirebaseDiscussion']);
	testCommunity = await makeCommunity();
	haplessUser = await makeUser();
	user = await makeUser();
	pubManager = await makeUser();
	pub = await createPub({ communityId: testCommunity.community.id }, pubManager);
	publicBranch = await Branch.findOne({ where: { pubId: pub.id, title: 'public' } });
	draftBranch = await Branch.findOne({ where: { pubId: pub.id, title: 'draft' } });
	// Set up some branches
	visibleBranchA = await createBranch(
		{
			pubId: pub.id,
			title: 'a-visible-branch',
			userPermissions: [{ user: { id: user.id }, permissions: 'manage' }],
		},
		pubManager.id,
	);
	visibleBranchB = await createBranch(
		{
			pubId: pub.id,
			title: 'another-visible-branch',
			userPermissions: [{ user: { id: user.id }, permissions: 'view' }],
		},
		pubManager.id,
	);
	// This pub would not be visible to `user` with {permissions: 'view'} unless there was
	// some content in it.
	await visibleBranchB.update({ firstKeyAt: new Date() });
	invisibleBranch = await createBranch(
		{
			pubId: pub.id,
			title: 'private',
			userPermissions: [],
		},
		pubManager.id,
	);
	// Set up some discussions
	visibleDiscussionA = await createDiscussion(
		makeDiscussion({
			branchId: visibleBranchA.id,
			text: 'Hey look at me!',
		}),
		pubManager,
	);
	visibleDiscussionB = await createDiscussion(
		makeDiscussion({
			branchId: visibleBranchB.id,
			text: 'Hey look at me!',
		}),
		pubManager,
	);
	invisibleDiscussion = await createDiscussion(
		makeDiscussion({
			branchId: invisibleBranch.id,
			text: "Don't look at me. You can't",
		}),
		pubManager,
	);
	// Set up some reviews
	visibleReview = await createReview(
		{
			pubId: pub.id,
			sourceBranchId: visibleBranchA.id,
			destinationBranchId: visibleBranchB.id,
		},
		pubManager,
	);
	invisibleReview = await createReview(
		{
			pubId: pub.id,
			sourceBranchId: publicBranch.id,
			destinationBranchId: invisibleBranch.id,
		},
		pubManager,
	);
	// Set up some collections
	invisibleCollection = await createCollection({
		communityId: testCommunity.community.id,
		kind: 'book',
		title: 'The Book of Tests',
	});
	await invisibleCollection.update({ isPublic: false });
	invisibleCollectionPub = await createCollectionPub({
		pubId: pub.id,
		collectionId: invisibleCollection.id,
	});
	visibleCollection = await createCollection({
		communityId: testCommunity.community.id,
		kind: 'book',
		title: 'The Other Book of Tests',
	});
	visibleCollectionPub = await createCollectionPub({
		pubId: pub.id,
		collectionId: visibleCollection.id,
	});
	// Finally, query the whole thing again
	pub = (await findPubQuery(pub.slug, testCommunity.community.id)).toJSON();
});

describe('formatAndAuthenticatePub', () => {
	// It returns null for users without any access
	it('returns null for users without any access', () => {
		const res = formatAndAuthenticatePub({ pub: pub, loginData: haplessUser });
		expect(res).toEqual(null);
	});

	it('shows users the branches that they have access to', async () => {
		// As a user with explicit permissions
		expect(
			formatAndAuthenticatePub({ pub: pub, loginData: user }).branches.map((br) => br.title),
		).toEqual(['a-visible-branch', 'another-visible-branch']);
		// As a pub manager
		expect(
			formatAndAuthenticatePub({ pub: pub, loginData: pubManager }).branches.map(
				(br) => br.title,
			),
		).toEqual(['draft', 'a-visible-branch', 'another-visible-branch', 'private']);
		// #public is not included here because it has no content
	});

	it('accounts for accessHash when computing branch access', () => {
		// We cannot edit the public branch, no matter what
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
				accessHash: publicBranch.editHash,
			}).branches.map((br) => br.title),
		).toEqual(['a-visible-branch', 'another-visible-branch']);
		// Passing the draft branch view hash does not let us access it, since it has no content
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
				accessHash: draftBranch.viewHash,
			}).branches.map((br) => br.title),
		).toEqual(['a-visible-branch', 'another-visible-branch']);
		// Passing the draft branch edit hash should allow us to access it
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
				accessHash: draftBranch.editHash,
			}).branches.map((br) => br.title),
		).toEqual(['draft', 'a-visible-branch', 'another-visible-branch']);
	});

	it('copypastas the permissions for the active branch to the pub object', () => {
		const {
			activeBranch: ab,
			canManageBranch,
			canEditBranch,
			canDiscussBranch,
			canViewBranch,
		} = formatAndAuthenticatePub({
			pub: pub,
			loginData: user,
			branchShortId: visibleBranchA.shortId,
		});
		expect(ab.canManage && ab.canManage === canManageBranch).toEqual(true);
		expect(ab.canEdit && ab.canEdit === canEditBranch).toEqual(true);
		expect(ab.canDiscuss && ab.canDiscuss === canDiscussBranch).toEqual(true);
		expect(ab.canView && ab.canView === canViewBranch).toEqual(true);
	});

	it('chooses the correct active branch from branchShortId', () => {
		const { activeBranch } = formatAndAuthenticatePub({
			pub: pub,
			loginData: user,
			branchShortId: visibleBranchA.shortId,
		});
		expect(activeBranch.title).toEqual('a-visible-branch');
	});

	it('does not let you select an otherwise inaccessible branch by passing branchShortId', () => {
		const res = formatAndAuthenticatePub({
			pub: pub,
			loginData: user,
			branchShortId: invisibleBranch.shortId,
		});
		expect(res).toEqual(null);
	});

	it('selects #public, if available, when no branchShortId is passed', () => {
		// Pretend we've pushed something to #public
		const pb = pub.branches.find((br) => br.title === 'public');
		pb.firstKeyAt = new Date();
		const { activeBranch } = formatAndAuthenticatePub({
			pub: pub,
			loginData: pubManager,
		});
		expect(activeBranch.title).toEqual('public');
		// Restore the state of #public
		pb.firstKeyAt = undefined;
	});

	it('selects as active the branch with lowest `order` when no branchShortId is passed', () => {
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
			}).activeBranch.title,
		).toEqual('a-visible-branch');
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: pubManager,
			}).activeBranch.title,
		).toEqual('draft');
	});

	it('marks the pub with isStaticDoc when a verisonNumber is passed', () => {
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
				versionNumber: '0',
			}).isStaticDoc,
		).toEqual(true);
	});

	it('returns all collections iff you are a community admin', () => {
		// As a regular user
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
			}).collectionPubs.map((cp) => cp.id),
		).toEqual([visibleCollectionPub.id]);
		// As a community admin
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: testCommunity.admin,
				communityAdminData: true,
			})
				.collectionPubs.map((cp) => cp.id)
				.sort(),
		).toEqual([invisibleCollectionPub.id, visibleCollectionPub.id].sort());
	});

	it('returns only the reviews you have access to', () => {
		// As a regular user
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
			}).reviews.map((rv) => rv.id),
		).toEqual([visibleReview.id]);
		// As a pub manager
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: pubManager,
			})
				.reviews.map((rv) => rv.id)
				.sort(),
		).toEqual([visibleReview.id, invisibleReview.id].sort());
	});

	it('returns only the discussions you have access to', () => {
		// As a regular user
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
			})
				.discussions.map((ds) => ds.id)
				.sort(),
		).toEqual([visibleDiscussionA.id, visibleDiscussionB.id].sort());
		// As a pub manager
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: pubManager,
			})
				.discussions.map((ds) => ds.id)
				.sort(),
		).toEqual([visibleDiscussionA.id, visibleDiscussionB.id, invisibleDiscussion.id].sort());
	});

	it('returns discussions you can access on other branches (for embeds)', () => {
		expect(
			formatAndAuthenticatePub({
				pub: pub,
				loginData: user,
				branchShortId: visibleBranchA.branchShortId,
			})
				.discussions.map((ds) => ds.id)
				.sort(),
		).toEqual([visibleDiscussionA.id, visibleDiscussionB.id].sort());
	});
});

teardown(afterAll, () => {
	firebaseStub.restore();
});
