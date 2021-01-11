import { Schema, Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { Mapping, Step } from 'prosemirror-transform';

import { collabDocPluginKey } from '../collaborative';

import { connectDiscussionsRef } from './discussionsRef';
import { getFastForwardedDiscussions } from './fastForward';
import { mapDiscussionThroughSteps, removeDiscussionsById } from './util';
import { Discussions, DiscussionInfo, NullableDiscussions, DiscussionsUpdateResult } from './types';

type Options = {
	draftRef: firebase.database.Reference;
	initialHistoryKey: number;
	initialDoc: Node;
	onUpdateDiscussions: (result: DiscussionsUpdateResult) => unknown;
};

const getUpdatedDiscussionsFromTransaction = (
	discussions: Discussions,
	steps: Step[],
	previousDoc: Node,
	nextDoc: Node,
	previousHistoryKey: number,
	nextHistoryKey: number,
): Discussions => {
	if (previousHistoryKey === nextHistoryKey && steps.length === 0) {
		return {};
	}
	const resultingDiscussions: Discussions = {};
	Object.keys(discussions).forEach((id) => {
		const discussion = discussions[id];
		if (discussion.currentKey === previousHistoryKey) {
			const mappedDiscussion = mapDiscussionThroughSteps(
				discussion,
				previousDoc,
				nextDoc,
				steps,
			);
			resultingDiscussions[id] = {
				...mappedDiscussion,
				currentKey: nextHistoryKey,
			};
		}
	});
	return resultingDiscussions;
};

const filterDiscussionsUpdate = (discussions: Discussions, update: NullableDiscussions) => {
	const sendableDiscussions: Discussions = {};
	const updatableDiscussions: Discussions = {};
	const removedDiscussionIds: Set<string> = new Set();
	const addedDiscussionIds: Set<string> = new Set();
	Object.entries(update).forEach(([id, next]) => {
		if (next) {
			const previous = discussions[id];
			const hasKeyAdvanced = !previous || previous.currentKey < next.currentKey;
			const isKeyMonotonic = !previous || previous.currentKey <= next.currentKey;
			if (hasKeyAdvanced) {
				sendableDiscussions[id] = next;
			}
			if (isKeyMonotonic) {
				updatableDiscussions[id] = next;
			}
			if (!previous) {
				addedDiscussionIds.add(id);
			}
		} else {
			removedDiscussionIds.add(id);
		}
	});
	return {
		addedDiscussionIds: addedDiscussionIds,
		removedDiscussionIds: removedDiscussionIds,
		sendableDiscussions: sendableDiscussions,
		updatableDiscussions: updatableDiscussions,
	};
};

export const syncDraftDiscussions = (options: Options) => {
	const { draftRef, initialHistoryKey, initialDoc, onUpdateDiscussions } = options;
	const schema: Schema = initialDoc.type.schema;
	const { sendDiscussions, receiveDiscussions } = connectDiscussionsRef(draftRef);

	let discussions: Discussions = {};
	let currentHistoryKey = initialHistoryKey;
	let currentDoc = initialDoc;

	const updateDiscussions = (update: NullableDiscussions) => {
		const {
			sendableDiscussions,
			updatableDiscussions,
			removedDiscussionIds,
			addedDiscussionIds,
		} = filterDiscussionsUpdate(discussions, update);

		sendDiscussions(sendableDiscussions);
		discussions = removeDiscussionsById(
			{ ...discussions, ...updatableDiscussions },
			removedDiscussionIds,
		);

		return {
			discussions: discussions,
			addedDiscussionIds: addedDiscussionIds,
			removedDiscussionIds: removedDiscussionIds,
		};
	};

	const asynchronouslyUpdateDiscussions = (update: NullableDiscussions) => {
		const { addedDiscussionIds, removedDiscussionIds } = updateDiscussions(update);
		onUpdateDiscussions({
			discussions: discussions,
			addedDiscussionIds: addedDiscussionIds,
			removedDiscussionIds: removedDiscussionIds,
			mapping: new Mapping(),
		});
	};

	const handleTransaction = (
		tr: Transaction,
		nextState: EditorState,
	): null | DiscussionsUpdateResult => {
		const { mostRecentRemoteKey } = collabDocPluginKey.getState(nextState);
		const historyKeyHasAdvanced = mostRecentRemoteKey > currentHistoryKey;

		const nextDiscussions = getUpdatedDiscussionsFromTransaction(
			discussions,
			tr.steps,
			currentDoc,
			tr.doc,
			currentHistoryKey,
			mostRecentRemoteKey,
		);

		currentDoc = tr.doc;
		currentHistoryKey = mostRecentRemoteKey;

		if (tr.docChanged || historyKeyHasAdvanced) {
			return {
				...updateDiscussions(nextDiscussions),
				mapping: tr.mapping,
			};
		}

		return null;
	};

	const addDiscussion = (discussionId: string, selection: DiscussionInfo['selection']) => {
		updateDiscussions({
			[discussionId]: {
				initKey: currentHistoryKey,
				currentKey: currentHistoryKey,
				selection: selection,
				initHead: selection?.head!,
				initAnchor: selection?.anchor!,
			},
		});
	};

	receiveDiscussions((remoteDiscussions: NullableDiscussions) => {
		asynchronouslyUpdateDiscussions(remoteDiscussions);
		getFastForwardedDiscussions(
			remoteDiscussions,
			draftRef,
			schema,
			currentDoc,
			currentHistoryKey,
		).then(asynchronouslyUpdateDiscussions);
	});

	return {
		addDiscussion: addDiscussion,
		handleTransaction: handleTransaction,
	};
};
