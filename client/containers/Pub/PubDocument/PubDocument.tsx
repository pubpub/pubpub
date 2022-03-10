import React, { useState, useEffect, useRef } from 'react';
import { setLocalHighlight } from 'components/Editor';

import { usePageContext } from 'utils/hooks';
import { PubHistoryViewer } from 'components';
import {
	PubEdgeListing,
	Filter as PubEdgeFilter,
	Mode as PubEdgeMode,
} from 'components/PubEdgeListing';

import PubBody from './PubBody';
import PubBottom from './PubBottom/PubBottom';
import PubFileImport from './PubFileImport';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubHistoricalNotice from './PubHistoricalNotice';
import PubInlineMenu from './PubInlineMenu';
import PubLinkController from './PubLinkController';
import PubMaintenanceNotice from './PubMaintenanceNotice';
import { PubSuspendWhileTyping } from '../PubSuspendWhileTyping';
import { usePubContext } from '../pubHooks';

require('./pubDocument.scss');

const isInViewport = (rect: DOMRect, offsets: { top?: number; left?: number } = {}) => {
	const { top, left, bottom, right } = rect;
	const { innerWidth, innerHeight } = window;
	const { clientWidth, clientHeight } = document.documentElement;
	const { top: offsetTop, left: offsetLeft } = { top: 0, left: 0, ...offsets };

	return (
		top >= offsetTop &&
		left >= offsetLeft &&
		bottom <= (innerHeight || clientHeight) &&
		right <= (innerWidth || clientWidth)
	);
};

const scrollToElementTop = (hash: string, delay = 0) => {
	let element: HTMLElement | null;

	try {
		element = document.getElementById(hash.replace('#', ''));
	} catch {
		return;
	}

	if (!element) {
		return;
	}

	setTimeout(() => {
		const rect = (element as HTMLElement).getBoundingClientRect();

		if (!isInViewport(rect, { top: 50 })) {
			document.body.scrollTop += rect.top - 80;
		}
	}, delay);
};

const PubDocument = () => {
	const { pubData, historyData, collabData, updateLocalData, pubBodyState } = usePubContext();
	const { isViewingHistory } = historyData;
	const { editorChangeObject } = collabData;
	const { isReadOnly } = pubBodyState;
	const { communityData, locationData, scopeData } = usePageContext();
	const { canEdit, canEditDraft } = scopeData.activePermissions;
	const [areDiscussionsShown, setDiscussionsShown] = useState(true);
	const mainContentRef = useRef(null);
	const sideContentRef = useRef(null);
	const editorWrapperRef = useRef(null);
	const editorView = editorChangeObject?.view;

	const updateHistoryData = (next) => updateLocalData('history', next);

	useEffect(() => {
		const fromNumber = Number(locationData.query.from);
		const toNumber = Number(locationData.query.to);
		const existingPermElement = document.getElementsByClassName('permanent')[0];
		if (editorView && fromNumber && toNumber && !existingPermElement) {
			setTimeout(() => {
				setLocalHighlight(editorView, fromNumber, toNumber, 'permanent');
				setTimeout(() => {
					const newlyCreatedPermElement = document.getElementsByClassName('permanent')[0];
					if (newlyCreatedPermElement) {
						newlyCreatedPermElement.scrollIntoView({ block: 'center' });
					}
				}, 0);
			}, 0);
		}
	}, [editorView, locationData]);

	useEffect(() => {
		const { hash } = window.location;

		if (hash) {
			scrollToElementTop(hash, 500);
		}

		const onClick = (event: MouseEvent) => {
			const { target, metaKey } = event;

			if (target instanceof HTMLAnchorElement && !metaKey) {
				const href = target.getAttribute('href');

				if (href && href.indexOf('#') === 0) {
					event.preventDefault();
					window.location.hash = href;
					scrollToElementTop(href);
				}
			}
		};

		if (isReadOnly) {
			document.addEventListener('click', onClick);
			return () => document.removeEventListener('click', onClick);
		}

		return () => {};
	}, [isReadOnly]);

	// We use the useEffect hook to wait until after the render to show or hide discussions, since
	// they mount into portals that we rely on Prosemirror to create.
	useEffect(() => {
		setDiscussionsShown(!isViewingHistory);
	}, [isViewingHistory]);

	// const editorFocused = editorChangeObject.view && editorChangeObject.view.hasFocus();
	return (
		<div className="pub-document-component">
			{!isReadOnly && (
				<PubHeaderFormatting
					collabData={collabData}
					disabled={isViewingHistory}
					editorWrapperRef={editorWrapperRef}
				/>
			)}
			<div className="pub-grid">
				<div className="main-content" ref={mainContentRef}>
					<PubMaintenanceNotice pubData={pubData} />
					<PubHistoricalNotice pubData={pubData} historyData={historyData} />
					<PubEdgeListing
						className="top-pub-edges"
						pubData={pubData}
						accentColor={communityData.accentColorDark}
						initialFilters={[PubEdgeFilter.Parent]}
						isolated
					/>
					<PubBody editorWrapperRef={editorWrapperRef} />
					{!isViewingHistory && (canEdit || canEditDraft) && !pubData.isReadOnly && (
						<PubFileImport
							editorChangeObject={collabData.editorChangeObject}
							updatePubData={(data) => updateLocalData('pub', data)}
						/>
					)}
					{!isViewingHistory && <PubInlineMenu />}
					<PubEdgeListing
						className="bottom-pub-edges"
						pubData={pubData}
						accentColor={communityData.accentColorDark}
						initialFilters={[PubEdgeFilter.Child, PubEdgeFilter.Sibling]}
						initialMode={
							pubData.pubEdgeListingDefaultsToCarousel
								? PubEdgeMode.Carousel
								: PubEdgeMode.List
						}
					/>
				</div>
				<div className="side-content" ref={sideContentRef}>
					{isViewingHistory && !pubData.isRelease && (
						<PubHistoryViewer
							updateHistoryData={updateHistoryData}
							historyData={historyData}
							pubData={pubData}
							onClose={() => updateLocalData('history', { isViewingHistory: false })}
						/>
					)}
				</div>
			</div>
			<PubSuspendWhileTyping delay={1000}>
				{() => (
					<PubBottom
						pubData={pubData}
						updateLocalData={updateLocalData}
						sideContentRef={sideContentRef}
						mainContentRef={mainContentRef}
						showDiscussions={areDiscussionsShown}
					/>
				)}
			</PubSuspendWhileTyping>
			<PubLinkController locationData={locationData} mainContentRef={mainContentRef} />
		</div>
	);
};

export default PubDocument;
