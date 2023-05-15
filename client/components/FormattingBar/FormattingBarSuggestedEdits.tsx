import React from 'react';
import { EditorChangeObject } from 'components/Editor';
import { FormattingBarButtonData, ControlsConfiguration } from './types';

type Props = {
	editorChangeObject: EditorChangeObject;
	buttons: FormattingBarButtonData[][];
	controlsConfiguration?: Partial<ControlsConfiguration>;
};

const FormattingBarSuggestedEdits = (props: Props) => {
	const { editorChangeObject, buttons, controlsConfiguration } = props;

	return <div>Hello New World!</div>;
};

export default FormattingBarSuggestedEdits;
