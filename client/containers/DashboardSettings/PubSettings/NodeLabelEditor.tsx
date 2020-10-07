import { Checkbox } from '@blueprintjs/core';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useDebounce } from 'use-debounce';
import classNames from 'classnames';

import { InputField } from 'client/components';
import { getDefaultNodeLabels } from 'client/components/Editor/utils/references';
import { NodeLabelMap, referenceableNodeTypes } from 'client/components/Editor/types';

require('./nodeLabelEditor.scss');

export type NodeLabelEditorRowProps = {
	type: string;
	enabled: boolean;
	text: string;
	onTextChange: (label: string) => unknown;
	onToggle: (enabled: boolean) => unknown;
};

const NodeLabelEditorRow = (props: NodeLabelEditorRowProps) => {
	const { enabled, type, text, onTextChange, onToggle } = props;

	return (
		<tr className={classNames(!enabled && 'disabled')}>
			<td>{type}</td>
			<td>
				<Checkbox
					checked={enabled}
					onChange={(e) => onToggle((e.target as HTMLInputElement).checked)}
				/>
			</td>
			<td>
				<InputField
					type="text"
					onChange={(e) => onTextChange(e.target.value)}
					value={text}
					isDisabled={!enabled}
				/>
			</td>
		</tr>
	);
};

export type NodeLabelEditorProps = {
	pubData: any;
	updatePubData: (values: any) => void;
};

enum NodeLabelEditorActionType {
	Toggle = 'toggle',
	UpdateLabel = 'update_label',
}

type NodeLabelEditorAction =
	| {
			type: NodeLabelEditorActionType.Toggle;
			payload: { nodeType: string; enabled: boolean };
	  }
	| { type: NodeLabelEditorActionType.UpdateLabel; payload: { nodeType: string; text: string } };

const nodeLabelEditorReducer = (state: NodeLabelMap, action: NodeLabelEditorAction) => {
	switch (action.type) {
		case NodeLabelEditorActionType.Toggle: {
			const { nodeType, enabled } = action.payload;
			return {
				...state,
				[nodeType]: { ...state[nodeType], enabled: enabled },
			};
		}
		case NodeLabelEditorActionType.UpdateLabel: {
			const { nodeType, text } = action.payload;
			return {
				...state,
				[nodeType]: { ...state[nodeType], text: text },
			};
		}
	}
};

const useNodeLabelEditorState = (pub: any) => {
	const initialState = useMemo(() => getDefaultNodeLabels(pub), []);
	const [state, dispatch] = useReducer(nodeLabelEditorReducer, initialState);
	const toggleNode = useCallback(
		(nodeType: string, enabled: boolean) =>
			dispatch({ type: NodeLabelEditorActionType.Toggle, payload: { nodeType, enabled } }),
		[],
	);
	const updateLabel = useCallback(
		(nodeType: string, text: string) =>
			dispatch({ type: NodeLabelEditorActionType.UpdateLabel, payload: { nodeType, text } }),
		[],
	);

	return { state, toggleNode, updateLabel };
};

const NodeLabelEditor = (props: NodeLabelEditorProps) => {
	const { pubData, updatePubData } = props;
	const { state, toggleNode, updateLabel } = useNodeLabelEditorState(pubData);
	const [stateToPersist] = useDebounce(state, 500);
	const initialState = useMemo(() => state, []);

	useEffect(() => {
		if (stateToPersist !== initialState) {
			updatePubData({
				nodeLabels: stateToPersist,
			});
		}
	}, [stateToPersist]);

	return (
		<div className="node-label-editor-component">
			<table className="bp3-html-table bp3-small">
				<thead>
					<tr>
						<th>Type</th>
						<th>Enabled</th>
						<th>Label</th>
					</tr>
				</thead>
				<tbody>
					{referenceableNodeTypes.map((nodeType) => {
						const { enabled, text } = state[nodeType];
						return (
							<NodeLabelEditorRow
								key={nodeType}
								type={nodeType}
								enabled={enabled}
								text={text}
								onTextChange={(text) => updateLabel(nodeType, text)}
								onToggle={(enabled) => toggleNode(nodeType, enabled)}
							/>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default NodeLabelEditor;
