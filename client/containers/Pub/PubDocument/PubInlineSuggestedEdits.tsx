import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { buttons, FormattingBarSuggestedEdits } from 'components/FormattingBar';
import { Avatar } from 'components';
import { UserAvatar } from 'types';
import {
	acceptSuggestedEdits,
	getResolvableRangeForSelection,
} from 'client/components/Editor/plugins/suggestedEdits/resolve';
import { getSuggestionAttrsForNode } from 'client/components/Editor/plugins/suggestedEdits/operations';

import { apiFetch } from 'client/utils/apiFetch';
import { usePageContext } from 'utils/hooks';

import { usePubContext } from '../pubHooks';

require('./pubInlineSuggestionMenu.scss');

const shouldOpenBelowSelection = () => {
	return ['Android', 'iPad', 'iPhone'].some((device) =>
		navigator.userAgent.toLowerCase().includes(device.toLowerCase()),
	);
};

const PubInlineSuggestedEdits = () => {
	const { collabData, pubBodyState } = usePubContext();
	const { communityData } = usePageContext();

	const { editorChangeObject } = collabData;
	const selection = collabData.editorChangeObject!.selection;
	const [suggestedUserAvatarInfo, setSuggestedUserAvatarInfo] = useState<UserAvatar | null>(null);

	const shouldHide = useMemo(() => {
		if (!collabData.editorChangeObject || !collabData.editorChangeObject.view || !selection)
			return true;
		const state = collabData.editorChangeObject.view.state;
		const inRange = acceptSuggestedEdits(state);
		return !inRange || !selection;
	}, [collabData.editorChangeObject, selection]);

	const suggestionAttrsForRange = useMemo(() => {
		if (editorChangeObject && editorChangeObject.view) {
			const doc = editorChangeObject!.view.state.doc;
			const range = getResolvableRangeForSelection(editorChangeObject.view.state);
			if (range) {
				let attrs;
				doc.nodesBetween(range.from, range.to, (node) => {
					const present = getSuggestionAttrsForNode(node);
					attrs = present;
				});
				return attrs;
			}
		}
		return null;
	}, [editorChangeObject]);

	const fetchSuggestedUserAvatarInfo = useCallback(async () => {
		if (suggestionAttrsForRange) {
			const suggestionUser: UserAvatar = await apiFetch.get(
				`/api/users?suggestionUserId=${encodeURIComponent(
					suggestionAttrsForRange.suggestionUserId,
				)}`,
			);
			console.log(suggestionAttrsForRange);
			if (suggestionUser) setSuggestedUserAvatarInfo(suggestionUser);
		}
	}, [suggestionAttrsForRange]);

	useEffect(() => {
		fetchSuggestedUserAvatarInfo();
	}, [fetchSuggestedUserAvatarInfo]);

	const renderAvatar = suggestedUserAvatarInfo ? (
		<Tooltip content={`Suggested by ${suggestedUserAvatarInfo.fullName}`}>
			<Avatar
				initials={suggestedUserAvatarInfo.initials}
				avatar={suggestedUserAvatarInfo.avatar}
				width={38}
				borderColor={communityData.accentColorDark}
				borderWidth={3}
			/>
		</Tooltip>
	) : null;

	// box around selection
	const selectionBoundingBox: Record<string, any> =
		collabData.editorChangeObject!.selectionBoundingBox || {};

	if (shouldHide) return null;

	const topPosition =
		window.scrollY +
		-17 +
		(shouldOpenBelowSelection()
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
