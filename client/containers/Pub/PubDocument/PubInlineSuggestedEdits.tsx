import React, { useMemo } from 'react';
import { Classes } from '@blueprintjs/core';

import { buttons, FormattingBarSuggestedEdits } from 'components/FormattingBar';
import { isDescendantOf } from 'components/Editor';

import { usePubContext } from '../pubHooks';

require('./pubInlineMenu.scss');

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
		return (
			!selection ||
			// selection.empty ||
			(selection as any).$anchorCell ||
			collabData.editorChangeObject!.selectedNode ||
			isDescendantOf('code_block', collabData.editorChangeObject!.selection)
		);
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
			className={`pub-inline-menu-component ${Classes.ELEVATION_2}`}
			style={{ position: 'absolute', top: topPosition, left: selectionBoundingBox.left }}
		>
			{renderFormattingBar()}
		</div>
	);
};

export default PubInlineSuggestedEdits;
