/* eslint-disable react/no-danger */
import React from 'react';

import { FormattingBar, FormattingBarButtonData } from 'components/FormattingBar';
import { mathToggleKind } from 'components/Editor/commands';
import { EditorChangeObjectWithNode } from '../types';

require('./controls.scss');

type Props = {
	editorChangeObject: EditorChangeObjectWithNode;
};

const ControlsMath = (props: Props) => {
	const { editorChangeObject } = props;
	const { selectedNode } = editorChangeObject;

	const swapMathTypeButton: FormattingBarButtonData = {
		key: 'change-math-node-type',
		title: 'Change display position',
		icon: 'publish-function',
		command: mathToggleKind,
	};

	const toggleMathLabelButton: FormattingBarButtonData = {
		key: 'toggle-math-display-label',
		title: 'Change display position',
		icon: 'function',
		command: mathToggleKind,
	};

	const mathButtons: FormattingBarButtonData[] = [swapMathTypeButton];
	if (selectedNode && selectedNode.type.name === 'math_display')
		mathButtons.push(toggleMathLabelButton);

	return (
		<FormattingBar
			editorChangeObject={editorChangeObject}
			buttons={[mathButtons]}
			showBlockTypes={false}
			isSmall
		/>
	);
};

export default ControlsMath;
