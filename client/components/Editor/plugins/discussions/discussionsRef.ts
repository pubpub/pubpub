import { DataSnapshot, Reference } from '@firebase/database-types';
import { uncompressSelectionJSON, compressSelectionJSON } from 'prosemirror-compress-pubpub';

import { DiscussionInfo, CompressedDiscussionInfo, DiscussionsHandler } from './types';

const uncompressDiscussionInfo = (compressed: CompressedDiscussionInfo): DiscussionInfo => {
	const { selection: compressedSelection } = compressed;
	const selection = compressedSelection && uncompressSelectionJSON(compressedSelection);
	return { ...compressed, selection: selection };
};

const compressDiscussionInfo = (uncompressed: DiscussionInfo): CompressedDiscussionInfo => {
	const { selection: uncompressedSelection } = uncompressed;
	const selection = uncompressedSelection && compressSelectionJSON(uncompressedSelection);
	return { ...uncompressed, selection: selection };
};

export const connectDiscussionsRef = (draftRef: Reference) => {
	const discussionsRef = draftRef.child('discussions');
	let onDiscussions: null | DiscussionsHandler = null;

	const childChangedHandler = (snapshot: DataSnapshot) => {
		const discussion = snapshot.val();
		if (discussion) {
			onDiscussions?.({ [snapshot.key!]: uncompressDiscussionInfo(discussion) });
		}
	};

	const childRemovedHandler = (snapshot: DataSnapshot) => {
		onDiscussions?.({ [snapshot.key!]: null });
	};

	const sendDiscussions = (discussions: Record<string, DiscussionInfo>) => {
		Object.entries(discussions).forEach(([id, discussion]) => {
			discussionsRef.child(id).transaction((existingDiscussion: CompressedDiscussionInfo) => {
				if (discussion.currentKey >= existingDiscussion.currentKey) {
					return compressDiscussionInfo(discussion);
				}
				return undefined;
			});
		});
	};

	const connectHandler = (handler: DiscussionsHandler) => {
		onDiscussions = handler;
	};

	discussionsRef.once('child_added', childChangedHandler);
	discussionsRef.once('child_changed', childChangedHandler);
	discussionsRef.once('child_removed', childRemovedHandler);

	discussionsRef.once('value').then((snapshot) => {
		const discussionsById = snapshot.val();
		if (discussionsById) {
			const uncompressedDiscussionsById: Record<string, DiscussionInfo> = {};
			Object.entries(discussionsById).forEach(([id, discussion]) => {
				uncompressedDiscussionsById[id] = uncompressDiscussionInfo(discussion as any);
			});
			onDiscussions?.(uncompressedDiscussionsById);
		}
	});

	return { sendDiscussions: sendDiscussions, receiveDiscussions: connectHandler };
};
