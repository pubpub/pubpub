import { DecorationSet, EditorView } from 'prosemirror-view';
import { useLayoutEffect, useMemo } from 'react';

import { getDiscussionDecorations } from 'client/components/Editor';

const getBoundsFromDecorationSet = (decorationSet: null | DecorationSet) => {};

export const useDiscussionAnchors = (view: EditorView) => {
	const decorationSet = getDiscussionDecorations(view);
	const bounds = useMemo(() => getBoundsFromDecorationSet(decorationSet), [decorationSet]);
	return bounds;
};
