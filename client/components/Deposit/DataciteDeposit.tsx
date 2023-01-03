import { Button, Icon, ITreeNode, Tree, TreeNode, Spinner, IconName } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { MouseEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Collection, InitialCommunityData, Pub } from 'types';

import { apiFetch } from 'client/utils/apiFetch';

import './dataciteDeposit.scss';

type Props = {
	communityData: InitialCommunityData;
} & ({ pubData: Pub } | { collectionData: Collection });

type Node =
	| {
			type: 'element';
			name: string;
			attributes: { [key: string]: unknown };
			children: Node[];
	  }
	| {
			type: 'text';
			value: string;
	  };

type NodePath = number[];

type TreeAction =
	| { type: 'RESET'; payload: ITreeNode[] }
	| { type: 'SET_IS_EXPANDED'; payload: { path: NodePath; isExpanded: boolean } }
	| { type: 'DESELECT_ALL' }
	| { type: 'SET_IS_SELECTED'; payload: { path: NodePath; isSelected: boolean } };

function forEachNode(nodes: ITreeNode[] | undefined, callback: (node: ITreeNode) => void) {
	if (nodes === undefined) {
		return;
	}
	for (const node of nodes) {
		callback(node);
		forEachNode(node.childNodes, callback);
	}
}

function forNodeAtPath(nodes: ITreeNode[], path: NodePath, callback: (node: ITreeNode) => void) {
	callback(Tree.nodeFromPath(path, nodes));
}

function treeExampleReducer(state: ITreeNode[], action: TreeAction) {
	switch (action.type) {
		case 'RESET':
			return action.payload;
		case 'DESELECT_ALL': {
			const next = structuredClone(state);
			forEachNode(next, (node) => (node.isSelected = false));
			return next;
		}
		case 'SET_IS_EXPANDED': {
			const next = structuredClone(state);
			forNodeAtPath(
				next,
				action.payload.path,
				(node) => (node.isExpanded = action.payload.isExpanded),
			);
			return next;
		}
		case 'SET_IS_SELECTED': {
			const next = structuredClone(state);
			forNodeAtPath(
				next,
				action.payload.path,
				(node) => (node.isSelected = action.payload.isSelected),
			);
			return next;
		}
		default:
			return state;
	}
}

const nodeNameToIcon: Record<string, IconName> = {
	publisher: 'home',
	publicationYear: 'calendar',
	identifier: 'id-number',
	titles: 'font',
	version: 'numerical',
	alternateIdentifiers: 'id-number',
	contributors: 'person',
	creators: 'person',
	dates: 'calendar',
	subjects: 'search',
	descriptions: 'manually-entered-data',
	formats: 'layers',
	language: 'translate',
};

function nodeToBlueprintTreeNode(node: Node): ITreeNode | undefined {
	if (node.type === 'text') {
		return { id: node.value, label: node.value };
	}
	const icon = nodeNameToIcon[node.name];
	if (node.children.length === 0) {
		return undefined;
	}
	if (node.children.length === 1) {
		if (node.children[0].type === 'text') {
			const firstChild = node.children[0];
			return {
				id: node.name,
				label: node.name,
				secondaryLabel: firstChild.value,
				icon,
			};
		}
		return {
			id: node.name,
			icon,
			label: node.name,
			childNodes: node.children
				.map(nodeToBlueprintTreeNode)
				.filter((x): x is ITreeNode => Boolean(x)),
			isExpanded: true,
		};
	}
	return {
		id: node.name,
		icon,
		label: node.name,
		childNodes: node.children
			.map(nodeToBlueprintTreeNode)
			.filter((x): x is ITreeNode => Boolean(x)),
	};
}

export default function DataciteDeposit(props: Props) {
	const { communityData } = props;
	const [nodes, dispatch] = useReducer(treeExampleReducer, []);
	const handleNodeClick = useCallback(
		(node: ITreeNode, path: NodePath, event: MouseEvent<HTMLElement>) => {
			const selected = node.isSelected;
			if (!event.shiftKey) {
				dispatch({ type: 'DESELECT_ALL' });
			}
			const payload = { path, isSelected: selected == null ? true : !selected };
			dispatch({ type: 'SET_IS_SELECTED', payload });
		},
		[],
	);
	const handleNodeCollapse = useCallback((_node: ITreeNode, path: NodePath) => {
		dispatch({
			payload: { path, isExpanded: false },
			type: 'SET_IS_EXPANDED',
		});
	}, []);
	const handleNodeExpand = useCallback((_node: ITreeNode, path: NodePath) => {
		dispatch({
			payload: { path, isExpanded: true },
			type: 'SET_IS_EXPANDED',
		});
	}, []);
	const url = `/api/deposit?communityId=${communityData.id}&${
		'pubData' in props
			? `pubId=${props.pubData.id}&target=pub`
			: `collectionId=${props.collectionData.id}&target=collection`
	}`;
	useEffect(() => {
		apiFetch(url).then((json) => {
			dispatch({
				type: 'RESET',
				payload: [nodeToBlueprintTreeNode(json)].filter((x): x is ITreeNode => Boolean(x)),
			});
		});
	}, []);

	return (
		<div className="datacite-deposit">
			<Tree
				contents={nodes}
				onNodeClick={handleNodeClick}
				onNodeCollapse={handleNodeCollapse}
				onNodeExpand={handleNodeExpand}
			/>
			<Button>Deposit</Button>
		</div>
	);
}
