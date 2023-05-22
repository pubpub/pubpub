import React, { useMemo } from 'react';

import { buttons, FormattingBarSuggestedEdits } from 'components/FormattingBar';
import { acceptSuggestedEdits } from 'client/components/Editor/plugins/suggestedEdits/resolve';

import { usePubContext } from '../pubHooks';

require('./pubInlineSuggestionMenu.scss');

const shouldOpenBelowSelection = () => {
	return ['Android', 'iPad', 'iPhone'].some((device) =>
		navigator.userAgent.toLowerCase().includes(device.toLowerCase()),
	);
};

const PubInlineSuggestedEdits = () => {
	const { collabData, pubBodyState } = usePubContext();
	const { editorChangeObject } = collabData;

	const selection = collabData.editorChangeObject!.selection;

	const shouldHide = useMemo(() => {
		if (!collabData.editorChangeObject || !collabData.editorChangeObject.view || !selection)
			return true;
		const state = collabData.editorChangeObject.view.state;
		const inRange = acceptSuggestedEdits(state);
		return !inRange || !selection;
	}, [collabData.editorChangeObject, selection]);

	// box around selection
	const selectionBoundingBox: Record<string, any> =
		collabData.editorChangeObject!.selectionBoundingBox || {};

	if (shouldHide) return null;

	const topPosition =
		window.scrollY +
		(shouldOpenBelowSelection()
			? selectionBoundingBox.bottom + 5
			: selectionBoundingBox.top - 30);

	const renderFormattingBar = () => {
		if (pubBodyState.isReadOnly) {
			return null;
		}
		return (
			<FormattingBarSuggestedEdits
				buttons={buttons.suggestedEditsButtonSet}
				editorChangeObject={editorChangeObject || ({} as any)}
			/>
		);
	};

	return (
		<div
			className="pub-inline-suggested-edit-menu-component"
			style={{ position: 'absolute', top: topPosition, left: selectionBoundingBox.left }}
		>
			{renderFormattingBar()}
		</div>
	);
};

export default PubInlineSuggestedEdits;
