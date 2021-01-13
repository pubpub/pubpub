import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { Mapping, Step } from 'prosemirror-transform';

import { collabDocPluginKey } from '../collaborative';

import { connectToFirebaseDiscussions } from './firebase';
import { getFastForwardedDiscussions } from './fastForward';
import { createHistoryState } from './historyState';
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

const getHighestCurrentKeyFromDiscussions = (discussions: NullableDiscussions) => {
	return Object.values(discussions).reduce((max, discussion) => {
		if (discussion) {
			return Math.max(max, discussion.currentKey);
		}
		return max;
	}, -1);
};

export const connectToDraftDiscussions = (options: Options) => {
	const { draftRef, initialHistoryKey, initialDoc, onUpdateDiscussions } = options;
	const firebase = connectToFirebaseDiscussions(draftRef);
	const history = createHistoryState(initialDoc, initialHistoryKey);
	let discussions: Discussions = {};

	const updateDiscussions = (update: NullableDiscussions) => {
		const {
			sendableDiscussions,
			updatableDiscussions,
			removedDiscussionIds,
			addedDiscussionIds,
		} = filterDiscussionsUpdate(discussions, update);

		firebase.sendDiscussions(sendableDiscussions);
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

	const handleTransaction = (
		tr: Transaction,
		nextState: EditorState,
	): null | DiscussionsUpdateResult => {
		const { mostRecentRemoteKey } = collabDocPluginKey.getState(nextState);
		const {
			hasHistoryKeyAdvanced,
			currentDoc,
			currentHistoryKey,
			previousDoc,
			previousHistoryKey,
		} = history.updateState(tr.doc, mostRecentRemoteKey);

		const nextDiscussions = getUpdatedDiscussionsFromTransaction(
			discussions,
			tr.steps,
			previousDoc,
			currentDoc,
			previousHistoryKey,
			currentHistoryKey,
		);

		if (tr.steps.length || hasHistoryKeyAdvanced) {
			return {
				...updateDiscussions(nextDiscussions),
				mapping: tr.mapping,
				doc: currentDoc,
			};
		}

		return null;
	};

	const addDiscussion = (discussionId: string, selection: DiscussionInfo['selection']) => {
		const { currentHistoryKey } = history.getState();
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

	const asynchronouslyUpdateDiscussions = (update: NullableDiscussions) => {
		if (Object.keys(update).length === 0) {
			return;
		}
		const { addedDiscussionIds, removedDiscussionIds } = updateDiscussions(update);
		const { currentDoc } = history.getState();
		onUpdateDiscussions({
			discussions: discussions,
			addedDiscussionIds: addedDiscussionIds,
			removedDiscussionIds: removedDiscussionIds,
			mapping: new Mapping(),
			doc: currentDoc,
		});
	};

	firebase.receiveDiscussions((remoteDiscussions: NullableDiscussions) => {
		const remoteKey = getHighestCurrentKeyFromDiscussions(remoteDiscussions);
		history.onReachesKey(remoteKey, () => {
			const { currentDoc, currentHistoryKey } = history.getState();
			asynchronouslyUpdateDiscussions(remoteDiscussions);
			getFastForwardedDiscussions(
				remoteDiscussions,
				draftRef,
				currentDoc,
				currentHistoryKey,
			).then(asynchronouslyUpdateDiscussions);
		});
	});

	return {
		addDiscussion: addDiscussion,
		handleTransaction: handleTransaction,
		disconnect: firebase.disconnect,
	};
};
