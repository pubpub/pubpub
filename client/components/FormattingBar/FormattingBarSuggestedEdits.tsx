import React from 'react';
import { Button } from 'reakit';

import { Icon, Avatar } from 'components';

import { EditorChangeObject } from 'components/Editor';
import { useRefMap } from 'client/utils/useRefMap';
import { FormattingBarButtonData } from './types';
import { suggestedEditsToggle, suggestedEditsReject, suggestedEditsAccept } from './buttons';
import { useCommandStates } from './hooks/useCommandStates';

type Props = {
	editorChangeObject: EditorChangeObject;
	buttons: FormattingBarButtonData[][];
};

const FormattingBarSuggestedEdits = (props: Props) => {
	const { editorChangeObject, buttons } = props;
	const buttonElementRefs = useRefMap();
	const { view } = editorChangeObject;

	const commandStates = useCommandStates({
		view: editorChangeObject.view,
		state: editorChangeObject.view?.state,
		commands: buttons,
	});

	const handleToggle = () => {
		const commandState = commandStates[suggestedEditsToggle.key];
		commandState?.run();
		view.focus();
	};

	const handleReject = () => {
		const commandState = commandStates[suggestedEditsReject.key];
		commandState?.run();
		view.focus();
	};

	const handleAccept = () => {
		const commandState = commandStates[suggestedEditsAccept.key];
		commandState?.run();
		view.focus();
	};

	return (
		<div>
			<Button
				ref={buttonElementRefs.getRef(suggestedEditsToggle.key)}
				role="button"
				focusable
				title={suggestedEditsToggle.title}
				aria-label={suggestedEditsToggle.title}
				onClick={handleToggle}
			>
				<Icon icon={suggestedEditsToggle.icon} iconSize={16} />
			</Button>
			<Button
				ref={buttonElementRefs.getRef(suggestedEditsReject.key)}
				role="button"
				focusable
				title={suggestedEditsReject.title}
				aria-label={suggestedEditsReject.title}
				onClick={handleReject}
			>
				<Icon icon={suggestedEditsReject.icon} iconSize={16} />
			</Button>
			<Avatar width={16} initials="Who Is this" />
			<Button
				ref={buttonElementRefs.getRef(suggestedEditsAccept.key)}
				role="button"
				focusable
				title={suggestedEditsAccept.title}
				aria-label={suggestedEditsAccept.title}
				onClick={handleAccept}
			>
				<Icon icon={suggestedEditsAccept.icon} iconSize={16} />
			</Button>
		</div>
	);
};

export default FormattingBarSuggestedEdits;
