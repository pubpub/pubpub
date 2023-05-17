import React, { useMemo } from 'react';

import { buttons, FormattingBarSuggestedEdits } from 'components/FormattingBar';
import { getSuggestionAttrsForNode } from 'components/Editor/plugins/suggestedEdits/operations';

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
		const selectionInSuggestionRange = (): boolean => {
			if (!collabData.editorChangeObject || !collabData.editorChangeObject.view) return false;
			const doc = collabData.editorChangeObject.view.state.doc;
			let inSuggestionRange = false;

			doc.nodesBetween(selection.$anchor.pos - 1, selection.$head.pos + 1, (node) => {
				if (inSuggestionRange) return;
				const present = getSuggestionAttrsForNode(node);
				if (present) inSuggestionRange = true;
			});
			return inSuggestionRange;
		};

		const inRange = selectionInSuggestionRange();

		return !inRange || !selection;
	}, [collabData.editorChangeObject, selection]);

	// range of editable editor space
	const selectionBoundingBox: Record<string, any> =
		collabData.editorChangeObject!.selectionBoundingBox || {};

	if (shouldHide) return null;

	const topPosition =
		window.scrollY +
		(shouldOpenBelowSelection()
			? selectionBoundingBox.bottom + 10
			: selectionBoundingBox.top - 50);

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
