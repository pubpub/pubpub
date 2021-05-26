import React from 'react';

import { ActivityItemsContext, ActivityItem, ActivityItemKind } from 'types';

import { itemTitlers, Titled } from './titles';

type Renderer<Item, Titles, Returned> = (
	item: Item,
	titles: Titles,
	context: ActivityItemsContext,
) => Returned;

type ActivityItemRenderer<K extends ActivityItemKind, Returned> = Renderer<
	ActivityItem & { kind: K },
	ReturnType<typeof itemTitlers[K]> & { actor: Titled },
	Returned
>;

type ActivityItemRenderers = {
	[K in ActivityItemKind]: ActivityItemRenderer<K, React.ReactNode>;
};

const renderTitled = (titled: Titled) => {
	const { title, href } = titled;
	const inner = href ? (
		<a href={href} target="_blank" rel="noreferrer">
			{title}
		</a>
	) : (
		title
	);
	return <b>{inner}</b>;
};

const message = (strings: TemplateStringsArray, ...titles: Titled[]): React.ReactNode => {
	const elements: React.ReactNode[] = [];
	for (let i = 0; i < Math.max(strings.length, titles.length); i++) {
		const string = strings[i];
		const title = titles[i];
		if (string) {
			elements.push(string);
		}
		if (title) {
			elements.push(renderTitled(title));
		}
	}
	return elements;
};

const messageRenderers: ActivityItemRenderers = {
	'community-created': (item, { actor, community }) => {
		return message`${actor} created ${community}`,
	},
	'member-created': (item, { actor, user }) =>
		`${actor} added ${user} as a member with ${item.payload.permissions}`,
};
