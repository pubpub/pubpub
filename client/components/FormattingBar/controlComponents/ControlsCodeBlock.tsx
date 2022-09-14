import React, { useEffect } from 'react';
import { Toolbar, ToolbarItem, useToolbarState } from 'reakit';
import { Button } from '@blueprintjs/core';

import { codeSetLanguage } from 'components/Editor/commands';

import { EditorChangeObjectWithNode } from '../types';
import CommandMenu from '../CommandMenu';

require('./controls.scss');

type Props = {
	editorChangeObject: EditorChangeObjectWithNode;
	onClose: () => unknown;
};

const buttonCommands = [
	{
		key: 'set-javascript',
		title: 'javascript',
		icon: '',
		command: codeSetLanguage,
	},
];

const ControlsCodeBlock = (props: Props) => {
	const { editorChangeObject, onClose } = props;
	const { view } = editorChangeObject;
	const toolbar = useToolbarState({ loop: true });
	const renderDisclosure = (_, { ref, ...disclosureProps }) => {
		return (
			<Button
				rightIcon="caret-down"
				elementRef={ref}
				minimal
				icon="translate"
				text="Select Language"
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
		<Toolbar {...toolbar} aria-label="code option dropdown">
			<ToolbarItem
				aria-label="code options"
				as={CommandMenu as any}
				disclosure={renderDisclosure}
				commands={[buttonCommands]}
				editorChangeObject={editorChangeObject}
				markActiveItems={false}
				{...toolbar}
			/>
		</Toolbar>
	);
};

export default ControlsCodeBlock;
