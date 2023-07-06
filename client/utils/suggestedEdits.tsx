import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { EditorState, Transaction } from 'prosemirror-state';

import { getSuggestionAttrsForNode } from 'client/components/Editor/plugins/suggestedEdits/operations';
import { EditorChangeObject } from 'client/components/Editor';
import {
	acceptSuggestions,
	rejectSuggestions,
} from 'components/Editor/plugins/suggestedEdits/resolve';

type SuggestedEditsButtonProps = {
	buttonText: string;
	intent: Intent;
	actionCallback: any;
};

type SuggestedEditsActionProps = {
	editorChangeObject: EditorChangeObject | null;
	action: (state: EditorState, from: number, to: number) => Transaction;
};

export const hasSuggestions = (editorChangeObject: null | EditorChangeObject): boolean => {
	if (!editorChangeObject || !editorChangeObject.view) return false;
	const doc = editorChangeObject.view.state.doc;
	let hasSuggestion = false;
	doc.nodesBetween(0, doc.nodeSize - 2, (node) => {
		if (hasSuggestion) return;
		const present = getSuggestionAttrsForNode(node);
		if (present) hasSuggestion = true;
	});
	return hasSuggestion;
};

const suggestedEditsActionButton = (props: SuggestedEditsButtonProps) => {
	const { buttonText, intent, actionCallback } = props;
	return <Button text={buttonText} intent={intent} onClick={actionCallback} />;
};

const suggestedEditsAction = (props: SuggestedEditsActionProps) => {
	const { editorChangeObject, action } = props;
	if (!hasSuggestions(editorChangeObject)) return;
	if (!editorChangeObject) return;
	const editorState = editorChangeObject.view.state;
	const size = editorChangeObject.view.state.doc.nodeSize;
	const tr = action(editorState, 0, size - 2);
	editorChangeObject.view.dispatch(tr);
};

export const RejectSuggestions = (editorChangeObject: EditorChangeObject | null) =>
	suggestedEditsActionButton({
		buttonText: 'Reject All',
		intent: 'danger',
		actionCallback: suggestedEditsAction({ editorChangeObject, action: rejectSuggestions }),
	});

export const AcceptSuggestions = (editorChangeObject: EditorChangeObject | null) =>
	suggestedEditsActionButton({
		buttonText: 'Accept All',
		intent: 'success',
		actionCallback: suggestedEditsAction({ editorChangeObject, action: acceptSuggestions }),
	});
