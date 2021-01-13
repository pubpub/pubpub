import { Node } from 'prosemirror-model';
import { Mapping } from 'prosemirror-transform';

export type DiscussionInfo = {
	currentKey: number;
	initKey: number;
	initHead: number;
	initAnchor: number;
	selection: null | { type: 'text'; anchor: number; head: number };
};

export type CompressedDiscussionInfo = {
	currentKey: number;
	initKey: number;
	initHead: number;
	initAnchor: number;
	selection: null | { t: 'text'; a: number; h: number };
};

export type Discussions = Record<string, DiscussionInfo>;
export type NullableDiscussions = Record<string, null | DiscussionInfo>;

export type DiscussionsHandler = (discussionsById: NullableDiscussions) => unknown;

export type DiscussionsUpdateResult = {
	addedDiscussionIds: Set<string>;
	removedDiscussionIds: Set<string>;
	discussions: Discussions;
	doc: Node;
	mapping: Mapping;
};
