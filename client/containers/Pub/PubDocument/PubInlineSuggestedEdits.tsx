import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { buttons, FormattingBarSuggestedEdits } from 'components/FormattingBar';
import { Avatar } from 'components';
import { UserAvatar } from 'types';
import {
	acceptSuggestedEdits,
	getResolvableRangeForSelection,
} from 'client/components/Editor/plugins/suggestedEdits/resolve';
import { getSuggestionAttrsForNode } from 'client/components/Editor/plugins/suggestedEdits/operations';

import { apiFetch } from 'client/utils/apiFetch';
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
	const [suggestedUserAvatarInfo, setSuggestedUserAvatarInfo] = useState<UserAvatar | null>(null);

	const shouldHide = useMemo(() => {
		const selectionInSuggestionRange = (): boolean => {
			if (!collabData.editorChangeObject || !collabData.editorChangeObject.view) return false;
			const state = collabData.editorChangeObject.view.state;
			return acceptSuggestedEdits(state);
		};

		const inRange = selectionInSuggestionRange();

		return !inRange || !selection;
	}, [collabData.editorChangeObject, selection]);

	const suggestionUserForRange = useMemo(() => {
		if (editorChangeObject && editorChangeObject.view) {
			const doc = editorChangeObject!.view.state.doc;
			const range = getResolvableRangeForSelection(editorChangeObject.view.state);
			if (range) {
				let attrs;
				doc.nodesBetween(range.from, range.to, (node) => {
					const present = getSuggestionAttrsForNode(node);
					attrs = present;
				});

				return attrs.suggestionUserId;
			}
		}
		return null;
	}, [editorChangeObject]);

	const fetchSuggestedUserAvatarInfo = useCallback(async () => {
		const suggestionUser = await apiFetch
			.get(`/api/users?suggestionUserId=${encodeURIComponent(suggestionUserForRange)}`)
			.catch((err: Error) => {
				console.log(err.message);
			});
		console.log(suggestionUser);
		setSuggestedUserAvatarInfo(suggestionUser);
	}, [suggestionUserForRange]);

	useEffect(() => {
		fetchSuggestedUserAvatarInfo();
	}, [fetchSuggestedUserAvatarInfo]);

	const renderAvatar = suggestedUserAvatarInfo ? (
		<Avatar
			initials={suggestedUserAvatarInfo.initials}
			avatar={suggestedUserAvatarInfo.avatar}
			width={24}
		/>
	) : null;

	// range of editable editor space
	const selectionBoundingBox: Record<string, any> =
		collabData.editorChangeObject!.selectionBoundingBox || {};

	if (shouldHide) return null;

	const topPosition =
		window.scrollY +
		(!shouldOpenBelowSelection()
			? selectionBoundingBox.bottom + 5
			: selectionBoundingBox.top - 30);

	const renderFormattingBar = () => {
		if (pubBodyState.isReadOnly) {
			return null;
		}
		return (
			<FormattingBarSuggestedEdits
				avatar={renderAvatar}
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
