/* eslint-disable react/no-danger */
// import React, { useRef, useEffect, useCallback, useState } from 'react';
// import React, { useCallback } from 'react';
import React, { useEffect } from 'react';
import { Toolbar, ToolbarItem, useToolbarState } from 'reakit';
import { Button } from '@blueprintjs/core';

// import { getCurrentNodeLabels, EditorChangeObject, ReferenceableNodeType } from 'components/Editor';
// import { EditorChangeObject } from 'components/Editor';

// import { NodeType } from 'prosemirror-model';
import CommandMenu from '../CommandMenu';
import { EditorChangeObjectWithNode } from '../types';

require('./controls.scss');

type Props = {
	onClose: (...args: any[]) => any;
	editorChangeObject: EditorChangeObjectWithNode;
};

/*
const getSchemaDefinitionForNodeType = (
	editorChangeObject: EditorChangeObject,
	nodeTypeName: string,
) => {
	return editorChangeObject.view.state.schema.nodes[nodeTypeName] as NodeType;
};
 */

/*
const docAcceptsDisplayMath = (editorChangeObject: EditorChangeObject) => {
	const docDefinition = getSchemaDefinitionForNodeType(editorChangeObject, 'doc');
	const displayMathDefinition = getSchemaDefinitionForNodeType(
		editorChangeObject,
		'math_display',
	);
	return docDefinition.contentMatch.matchType(displayMathDefinition);
};
 */

const ControlsMath = (props: Props) => {
	const toolbar = useToolbarState({ loop: true });
	const { editorChangeObject, onClose } = props;
	const { view } = editorChangeObject;
	// const { changeNode, updateNode, selectedNode } = editorChangeObject;
	/*
	 * const toggleLabel = useCallback(
		(e: React.MouseEvent) => updateNode({ hideLabel: (e.target as HTMLInputElement).checked }),
		[updateNode],
	);
	const isBlock = selectedNode.type.name === 'math_display';
	// const nodeLabels = getCurrentNodeLabels(editorChangeObject.view.state);
	// const canHideLabel = nodeLabels[selectedNode.type.name as ReferenceableNodeType]?.enabled;
	// const [canConvertToBlock] = useState(() => docAcceptsDisplayMath(editorChangeObject));

	/*
	const handleChangeNodeType = () => {
		const targetNodeType = isBlock ? 'math_inline' : 'math_display';
		const schemaDefinition = getSchemaDefinitionForNodeType(editorChangeObject, targetNodeType);
		changeNode(schemaDefinition, null, selectedNode.content);
	};
	 */

	const mathCommands = [
		{
			key: 'toggle-inline-display',
			title: 'Toggle inline/block',
			icon: 'add-row-top',
			command: () => console.log('Id like to change the node type, sir'), // handleChangeNodeType,
		},
		{
			key: 'toggle-figure-numbering',
			title: 'Show figure numbering',
			icon: 'add-row-bottom',
			command: () => console.log('please, sir, Id like to toggle numbering'), // handleChangeNodeType,
			// command: toggleLabel,
		},
	];

	const renderDisclosure = (_, { ref, ...disclosureProps }) => {
		return (
			<Button
				minimal
				rightIcon="caret-down"
				elementRef={ref}
				icon="th"
				{...disclosureProps}
			/>
		);
	};

	useEffect(() => {
		if (view) {
			view.dom.addEventListener('keydown', onClose);
			return () => view.dom.removeEventListener('keydown', onClose);
		}
		return () => {};
	}, [view, onClose]);

	return (
		<Toolbar {...toolbar} className="controls-table-component" aria-label="Table options">
			<ToolbarItem
				aria-label="Math options"
				as={CommandMenu as any}
				disclosure={renderDisclosure}
				commands={[mathCommands]}
				editorChangeObject={editorChangeObject}
				markActiveItems={true}
				{...toolbar}
			/>
		</Toolbar>
	);
};
/*
		<div className="controls-math-component">
			{html && (
				<div className="section">
					<div className="title">Preview</div>
					<div className="preview" dangerouslySetInnerHTML={{ __html: html }} />
					{isBlock && canHideLabel && (
						<Checkbox
							onClick={toggleLabel}
							label="Hide label"
							checked={selectedNode?.attrs?.hideLabel}
						>
							{!canHideLabel && (
								<>
									{' '}
									(
									<ControlsReferenceSettingsLink dark small />)
								</>
							)}
						</Checkbox>
					)}
					<ControlsButtonGroup>
						{canConvertToBlock && (
							<ControlsButton onClick={handleChangeNodeType}>
							</ControlsButton>
						)}
					</ControlsButtonGroup>
				</div>
			)}
		</div>
	);
};
	 */
export default ControlsMath;
