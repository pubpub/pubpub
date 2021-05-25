import React from 'react';

import { ActivityItemsContext, ActivityItem } from 'types';

import { itemTitlers, Titled } from './titles';

type Renderer<Item, Titles> = (
	item: Item,
	titles: Titles,
	context: ActivityItemsContext,
) => React.ReactNode;

type MessageRenderers = {
	[K in ActivityItem['kind']]: Renderer<
		ActivityItem & { kind: K },
		ReturnType<typeof itemTitlers[K]>
	>;
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

const messageRenderers: MessageRenderers = {
	'community-created': (item, { community }) => message`created the community ${community}`,
};
