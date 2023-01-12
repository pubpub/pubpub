import { Fragment, Node, Slice } from 'prosemirror-model';
import { Change, ChangeSet } from 'prosemirror-changeset';

import { SuggestedEditsTransactionContext } from '../types';
import {
	addSuggestionToNode,
	addSuggestionToRange,
	nodeHasSuggestionKind,
	removeSuggestionFromRange,
} from '../operations';

const canNodeTypeHaveSimultaneousAdditionAndDeletion = (node: Node) => {
	// TODO: this might be true for table cells that are simultaneously in an added row and
	// a removed column. Might have to play around here.
	void node;
	return false;
};

const shouldNodeBeIncludedInRemovalFragment = (node: Node) => {
	if (canNodeTypeHaveSimultaneousAdditionAndDeletion(node)) {
		return true;
	}
	// Don't strikethrough nodes that were added by Suggested Edits. Just remove it.
	return !nodeHasSuggestionKind(node, 'addition');
};

const getNetRemovalFragment = (fragment: Fragment) => {
	const children: Node[] = [];
	for (let i = 0; i < fragment.childCount; i++) {
		const child = fragment.child(i);
		if (shouldNodeBeIncludedInRemovalFragment(child)) {
			const newChildFramgent = getNetRemovalFragment(child.content);
			const newChild = child.copy(newChildFramgent);
			children.push(newChild);
		}
	}
	return Fragment.from(children);
};

const getNetRemovalSlice = (slice: Slice) => {
	const { content, openStart, openEnd } = slice;
	const netContent = getNetRemovalFragment(content);
	return new Slice(netContent, openStart, openEnd);
};

export const indicateTextAndStructureChanges = (context: SuggestedEditsTransactionContext) => {
	const { existingTransactions, newTransaction } = context;
	// prosemirror-changeset will provide a list of Change objects which contain:
	// - a range (fromB, toB) which represents newly-changed content in the document
	// - a corresponding range (fromA, toA) in the old document.
	const changeset = existingTransactions.reduce(
		(set, txn) =>
			set.addSteps(
				txn.doc,
				txn.steps.map((step) => step.getMap()),
				null,
			),
		ChangeSet.create(existingTransactions[0].before),
	);
	// These are in reverse order -- we work from the back of the document so that adding our
	// removal slices doesn't invalidate positions later in the array.
	const orderedChanges = [...changeset.changes].sort((x, y) => y.fromB - x.fromB);
	orderedChanges.forEach((change: Change) => {
		const { fromA, toA, fromB, toB } = change;
		// First mark all inline content in the change range. This will affect things like text,
		// citations, and footnotes that live inside a single paragraph.
		addSuggestionToRange('addition', context, fromB, toB);
		// We also need to remove any removal marks from this range
		// (They might sneak in via copy-paste)
		removeSuggestionFromRange('removal', context, fromB, toB);
		// Now look at the _nodes_ that were created in that range...
		newTransaction.doc.nodesBetween(fromB, toB, (node: Node, pos: number) => {
			// If the node's position is in the range, it was just created.
			// If it's a block node, it won't have a mark applied to it.
			// So we add the suggestionKind attribute to it instead.
			if (pos >= fromB && pos <= toB && node.isBlock) {
				addSuggestionToNode('addition', context, pos, node);
			}
		});
		// This is the content that the change removed from the old doc. It may (trivially) be empty
		const removedSlice = changeset.startDoc.slice(fromA, toA);
		// Compute a "net removal slice" which we will restore to the document "in red" to suggest
		// that this content be deleted. This removes all the content "in green" in the slice, which
		// was created by Suggested Edits and is therefore safe to outright delete.
		const netRemovalSlice = getNetRemovalSlice(removedSlice);
		if (netRemovalSlice.size > 0) {
			const newToB = fromB + netRemovalSlice.size;
			// Add the net removal slice back in...
			newTransaction.replace(fromB, fromB, netRemovalSlice);
			// Now mark it as a suggested removal...
			addSuggestionToRange('removal', context, fromB, newToB);
			// And do the same things to its constituent nodes, as we did above for additions.
			newTransaction.doc.nodesBetween(fromB, newToB, (node: Node, pos: number) => {
				if (pos >= fromB && pos <= newToB && node.isBlock) {
					addSuggestionToNode('removal', context, pos, node);
				}
			});
		}
	});
};
