import type {
	CommunityModerationReportCreatedActivityItem,
	MemberCreatedActivityItem,
	MemberRemovedActivityItem,
	MemberUpdatedActivityItem,
} from 'types';

import React from 'react';

import { communityTitle, memberTitle, scopeTitle } from 'utils/activity/titles';

import { itemRenderer } from './itemRenderer';

type Titles = 'member' | 'scope';

export const renderMemberCreated = itemRenderer<MemberCreatedActivityItem, Titles>({
	icon: 'people',
	titleRenderers: {
		member: memberTitle,
		scope: scopeTitle,
	},
	message: ({ item, titles }) => {
		const { actor, member, scope } = titles;
		const { permissions } = item.payload;
		return (
			<>
				{actor} added {member} as a member of {scope} with <i>{permissions}</i> permissions
			</>
		);
	},
});

export const renderMemberUpdated = itemRenderer<MemberUpdatedActivityItem, Titles>({
	icon: 'people',
	titleRenderers: {
		member: memberTitle,
		scope: scopeTitle,
	},
	message: ({ item, titles }) => {
		const { actor, member, scope } = titles;
		const { permissions } = item.payload;
		if (permissions) {
			return (
				<>
					{actor} changed the membership permissions of {member} in {scope} from{' '}
					<i>{permissions.from}</i> to <i>{permissions.to}</i>
				</>
			);
		}
		return (
			<>
				{actor} changed the membership permissions of {member} in {scope}
			</>
		);
	},
});

export const renderMemberRemoved = itemRenderer<MemberRemovedActivityItem, Titles>({
	icon: 'people',
	titleRenderers: {
		member: memberTitle,
		scope: scopeTitle,
	},
	message: ({ titles }) => {
		const { actor, member, scope } = titles;
		return (
			<>
				{actor} removed {member} as a member from {scope}
			</>
		);
	},
});

const reportedUserTitle = (
	item: CommunityModerationReportCreatedActivityItem,
	context: Parameters<typeof memberTitle>[1],
) => {
	const userId = item.payload.userId;
	if (userId) {
		const user = context.associations.user[userId];
		if (user) {
			return { title: user.fullName, href: `/user/${user.slug}` };
		}
	}
	return { title: 'unknown user' };
};

export const renderCommunityModerationReportCreated = itemRenderer<
	CommunityModerationReportCreatedActivityItem,
	'reportedUser' | 'community'
>({
	icon: 'flag',
	titleRenderers: {
		reportedUser: reportedUserTitle,
		community: communityTitle,
	},
	message: ({ titles }) => {
		const { actor, reportedUser, community } = titles;
		return (
			<>
				{actor} flagged {reportedUser} in {community}
			</>
		);
	},
});
