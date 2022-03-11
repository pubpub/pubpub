import React, { useRef } from 'react';

import { usePageContext } from 'utils/hooks';
import { PubHistoryViewer } from 'components';
import {
	PubEdgeListing,
	Filter as PubEdgeFilter,
	Mode as PubEdgeMode,
} from 'components/PubEdgeListing';

import { usePubContext } from '../pubHooks';
import { usePermalinkOnMount } from '../usePermalinkOnMount';
import { usePubHrefs } from '../usePubHrefs';
import { PubSuspendWhileTyping } from '../PubSuspendWhileTyping';
import PubBody from './PubBody';
import PubBottom from './PubBottom/PubBottom';
import PubFileImport from './PubFileImport';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubHistoricalNotice from './PubHistoricalNotice';
import PubInlineMenu from './PubInlineMenu';
import PubLinkController from './PubLinkController';
import PubMaintenanceNotice from './PubMaintenanceNotice';

require('./pubDocument.scss');

const PubDocument = () => {
	const {
		pubData,
		historyData,
		collabData,
		updatePubData,
		updateLocalData,
		updateHistoryData,
		pubBodyState: { isReadOnly, hidePubBody },
	} = usePubContext();
	const { isViewingHistory } = historyData;
	const { communityData, locationData } = usePageContext();
	const mainContentRef = useRef(null);
	const sideContentRef = useRef(null);
	const editorWrapperRef = useRef(null);

	usePermalinkOnMount();
	usePubHrefs({ enabled: !isReadOnly });

	if (hidePubBody) {
		return null;
	}

	return (
		<div className="pub-document-component">
			{(!isReadOnly || isViewingHistory) && (
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
					{!isReadOnly && (
						<PubFileImport
							editorChangeObject={collabData.editorChangeObject!}
							updatePubData={updatePubData}
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
					{isViewingHistory && (
						<PubHistoryViewer
							updateHistoryData={updateHistoryData}
							historyData={historyData}
							pubData={pubData}
							onClose={() => updateHistoryData({ isViewingHistory: false })}
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
					/>
				)}
			</PubSuspendWhileTyping>
			<PubLinkController locationData={locationData} mainContentRef={mainContentRef} />
		</div>
	);
};

export default PubDocument;
