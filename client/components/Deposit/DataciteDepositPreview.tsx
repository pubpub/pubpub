import React from 'react';
import { Callout, IconName, ITreeNode, Spinner, Tree } from '@blueprintjs/core';
import { apiFetch } from 'client/utils/apiFetch';
import { MouseEvent, useCallback, useEffect, useReducer, useState } from 'react';

// TODO: Export this from @pubpub/deposit-utils
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
	| { type: 'DESELECT_ALL' }
	| { type: 'SET_IS_EXPANDED'; payload: { path: NodePath; isExpanded: boolean } }
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

function depositTreeReducer(state: ITreeNode[], action: TreeAction) {
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

const supportedAttributes = new Set([
	'dateType',
	'identifierType',
	'alternateIdentifierType',
	'descriptionType',
	'relatedItemType',
	'relationType',
]);

function nodeToBlueprintTreeNode(node: Node): ITreeNode | undefined {
	if (node.type === 'text') {
		return { id: node.value, label: node.value };
	}
	const icon = nodeNameToIcon[node.name];
	if (node.children.length === 0) {
		return undefined;
	}
	const nodeAttrs =
		node.attributes &&
		Object.entries(node.attributes).filter(([key]) => supportedAttributes.has(key));
	const label =
		node.name +
		(nodeAttrs && nodeAttrs.length > 0
			? `(${nodeAttrs.map(([key, value]) => `${key}=${value}`).join(',')})`
			: '');
	const id = node.name + ',' + label;
	const sharedAttrs = { id, label, icon: icon as IconName };
	if (node.children.length === 1) {
		if (node.children[0].type === 'text') {
			const firstChild = node.children[0];
			return {
				...sharedAttrs,
				secondaryLabel: firstChild.value,
			};
		}
		return {
			...sharedAttrs,
			childNodes: node.children
				.map(nodeToBlueprintTreeNode)
				.filter((x): x is ITreeNode => Boolean(x)),
			isExpanded: true,
		};
	}
	return {
		...sharedAttrs,
		childNodes: node.children
			.map(nodeToBlueprintTreeNode)
			.filter((x): x is ITreeNode => Boolean(x)),
	};
}

function expand(path: NodePath) {
	return {
		type: 'SET_IS_EXPANDED' as const,
		payload: { path, isExpanded: true },
	};
}

function collapse(path: NodePath) {
	return {
		type: 'SET_IS_EXPANDED' as const,
		payload: { path, isExpanded: false },
	};
}

function select(path: NodePath, isSelected: boolean) {
	return {
		type: 'SET_IS_SELECTED' as const,
		payload: { path, isSelected },
	};
}

function deselectAll() {
	return { type: 'DESELECT_ALL' as const };
}

type Props = {
	previewUrl: string;
};

export function DataciteDepositPreview(props: Props) {
	const { previewUrl } = props;
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState(true);
	const [nodes, dispatch] = useReducer(depositTreeReducer, []);
	const handleNodeClick = useCallback(
		(node: ITreeNode, path: NodePath, event: MouseEvent<HTMLElement>) => {
			const selected = node.isSelected;
			if (!event.shiftKey) {
				dispatch(deselectAll());
			}
			dispatch(select(path, selected == null ? true : !selected));
		},
		[],
	);
	const handleNodeCollapse = useCallback((_node: ITreeNode, path: NodePath) => {
		dispatch(collapse(path));
	}, []);
	const handleNodeExpand = useCallback((_node: ITreeNode, path: NodePath) => {
		dispatch(expand(path));
	}, []);
	useEffect(() => {
		apiFetch(previewUrl, { method: 'POST' })
			.then((json) => {
				dispatch({
					type: 'RESET',
					payload: [nodeToBlueprintTreeNode(json)].filter((x): x is ITreeNode =>
						Boolean(x),
					),
				});
			})
			.catch((response) => {
				setError(response.error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [previewUrl]);
	return loading ? (
		<Spinner />
	) : error ? (
		<Callout intent="danger" title="Deposit Error">
			<p>{error}</p>
		</Callout>
	) : (
		<Tree
			contents={nodes}
			onNodeClick={handleNodeClick}
			onNodeCollapse={handleNodeCollapse}
			onNodeExpand={handleNodeExpand}
		/>
	);
}
