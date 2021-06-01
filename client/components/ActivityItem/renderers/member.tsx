import React from 'react';

import {
	MemberCreatedActivityItem,
	MemberUpdatedActivityItem,
	MemberRemovedActivityItem,
} from 'types';

import { renderItem } from '../renderItem';
import { titleMember, titleMembershipScope } from '../titles';

type Titles = 'member' | 'scope';

export const renderMemberCreated = renderItem<MemberCreatedActivityItem, Titles>({
	icon: 'people',
	titles: {
		member: titleMember,
		scope: titleMembershipScope,
	},
	message: ({ item, titles }) => {
		const { actor, member, scope } = titles;
		const { permissions } = item.payload;
		return (
			<>
				{actor} added {member} as a member to {scope} with <i>{permissions}</i> permissions
			</>
		);
	},
});

export const renderMemberUpdated = renderItem<MemberUpdatedActivityItem, Titles>({
	icon: 'people',
	titles: {
		member: titleMember,
		scope: titleMembershipScope,
	},
	message: ({ item, titles }) => {
		const { actor, member, scope } = titles;
		const { permissions } = item.payload;
		return (
			<>
				{actor} changed the membership permissions of {member} in {scope} from{' '}
				<i>{permissions.from}</i> to <i>{permissions.to}</i>
			</>
		);
	},
});

export const renderMemberRemoved = renderItem<MemberRemovedActivityItem, Titles>({
	icon: 'people',
	titles: {
		member: titleMember,
		scope: titleMembershipScope,
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
