import React from 'react';

import { InsertableActivityItem, ActivityItemsFetchResult, Scope } from 'types';

// Information we'll pass around about the current render
export type ActivityRenderContext = ActivityItemsFetchResult & {
	scope: Scope;
	userId: string;
};

// The title of an object to be included in a Message. For a given object, such as a Pub, this may
// change based on the current ActivityItemsRenderContext; for instance, it may be "this Pub" or
// the actual title of the Pub. Likewise the Title rendered for a User may be that user's name
// or simply "you".
export type Title = { title: string; href?: string | null };

// Renders a title of some object included in the ItemType. A specific instance of a TitleRenderer
// might be TitleRenderer<CommunityCreatedActivityItem> which would render a title for a Community.
// The identifier for the rendered title is bound by the caller. An ItemType (which is probably a
// union of specific activity types) needs to be provided when instantiating a TitleRenderer so we
// know what properties we can extract from the item, and which MessageRenderers may use it.
export type TitleRenderer<ItemType extends InsertableActivityItem> = (
	item: ItemType,
	context: ActivityRenderContext,
) => Title;

// A RenderedActivityItem is an almost fully-baked representation of how this item will be
// displayed to users.
export type RenderedActivityItem = {
	// The main thing we have to say about this item
	// For instance: "Travis Rich created the Pub 'New Pub on October 11'""
	message: React.ReactNode;
	// An excerpt from the item that may be helpful to see, for instance the beginning of a
	// comment in a Thread.
	excerpt: React.ReactNode;
	// The time associated with this item.
	timestamp: number;
	// The Scope associated with this item, which can be used for filtering
	scope: Scope;
};

// The lone argument to renderActivityItem(). We need to tell it what items it can expect to be
// able to render (this will typically be a specific type like CommunityCreatedActivityItem), and
// also what models (e.g. a Pub or a Collection) we'll be titling during this render.
export type ActivityItemRendererOptions<
	Item extends InsertableActivityItem,
	Titles extends string
> = {
	titles: Record<Titles, TitleRenderer<Item>>;
	message: (options: { item: Item; titles: Record<Titles, Title> }) => RenderedActivityItem;
};
