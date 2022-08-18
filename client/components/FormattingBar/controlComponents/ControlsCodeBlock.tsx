/* eslint-disable react/no-danger */
import React from 'react';

// import { setLanguage } from 'components/Editor/views/CodeView
import { FormattingBar, FormattingBarButtonData } from 'components/FormattingBar';
import { mathToggleKind } from 'components/Editor/commands';
import { EditorChangeObjectWithNode } from '../types';

require('./controls.scss');

type Props = {
	editorChangeObject: EditorChangeObjectWithNode;
};

const ControlsCodeBlock = (props: Props) => {
	console.log('building');
	const { editorChangeObject } = props;
	const { selectedNode } = editorChangeObject;
	console.log({ editorChangeObject, selectedNode }); // find out where we get to pass/use nodeView instance setting variables

	const chooseLanguageButton: FormattingBarButtonData = {
		key: 'change-math-node-type',
		title: 'Change language highlighting',
		label: 'Choose language highlighting',
		icon: 'swap-horizontal',
		command: mathToggleKind,
	};

	const codeButtons: FormattingBarButtonData[][] = [[chooseLanguageButton]];

	return (
		<FormattingBar
			editorChangeObject={editorChangeObject}
			buttons={codeButtons}
			showBlockTypes={false}
		/>
	);
};

export default ControlsCodeBlock;
