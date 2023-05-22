import React from 'react';
import { Button } from 'reakit';

import { Icon } from 'components';

import { EditorChangeObject } from 'components/Editor';
import { useRefMap } from 'client/utils/useRefMap';
import { FormattingBarButtonData } from './types';
import { suggestedEditsReject, suggestedEditsAccept } from './buttons';
import { useCommandStates } from './hooks/useCommandStates';

require('./formattingBarSuggestedEdits.scss');

type Props = {
	avatar: any;
	buttons: FormattingBarButtonData[][];
	editorChangeObject: EditorChangeObject;
};

const FormattingBarSuggestedEdits = (props: Props) => {
	const { avatar, buttons, editorChangeObject } = props;
	const buttonElementRefs = useRefMap();
	const { view } = editorChangeObject;

	const commandStates = useCommandStates({
		view: editorChangeObject.view,
		state: editorChangeObject.view?.state,
		commands: buttons,
	});

	const handleClick = (button: FormattingBarButtonData) => {
		const commandState = commandStates[button.key];
		commandState?.run();
		view.focus();
	};

	const idkHowTorenderChildCompoenntAgain = () => {
		return avatar;
	};
	return (
		<div className="formatting-bar-suggested-edits">
			<Button
				ref={buttonElementRefs.getRef(suggestedEditsReject.key)}
				role="button"
				focusable
				title={suggestedEditsReject.title}
				aria-label={suggestedEditsReject.title}
				onClick={() => handleClick(suggestedEditsReject)}
				className="reject-button"
			>
				<Icon icon={suggestedEditsReject.icon} iconSize={16} />
			</Button>
			{idkHowTorenderChildCompoenntAgain()}
			<Button
				ref={buttonElementRefs.getRef(suggestedEditsAccept.key)}
				role="button"
				focusable
				title={suggestedEditsAccept.title}
				aria-label={suggestedEditsAccept.title}
				onClick={() => handleClick(suggestedEditsAccept)}
				className="accept-button"
			>
				<Icon icon={suggestedEditsAccept.icon} iconSize={16} />
			</Button>
		</div>
	);
};

export default FormattingBarSuggestedEdits;
