import { Node } from 'prosemirror-model';
import { usePrevious } from 'react-use';

import { EditorChangeObject } from 'client/components/Editor';
import { useEffect } from 'react';
import { useRefMap } from 'client/utils/useRefMap';

type SelectedNodeState = {
	type: string;
	attrs: Node['attrs'];
	hasPendingChanges: boolean;
	updateAttrs: (partial: Node['attrs']) => unknown;
	commitChanges: () => unknown;
};

export const useSelectedNode = (
	editorChangeObject: EditorChangeObject,
): null | SelectedNodeState => {
	const { selectedNode } = editorChangeObject;
	const selectedNodeId: null | string = selectedNode?.attrs.id || null;
	const previousSelectedNodeId = usePrevious(selectedNodeId);
	const pendingAttrsByNodeId = useRefMap();

	useEffect(() => {
		if (previousSelectedNodeId) {
		}
	}, [previousSelectedNodeId]);
};
