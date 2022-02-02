import React from 'react';

import { GridWrapper, PubByline } from 'components';
import { usePageContext } from 'utils/hooks';
import { Icon } from '@blueprintjs/core';
import { PubPageData } from 'types';
import PubHeaderBackground from '../../PubHeader/PubHeaderBackground';
import ResponsiveHeaderButton from '../../PubHeader/ResponsiveHeaderButton';
import { getHistoryButtonLabelForTimestamp } from '../../PubHeader/DraftReleaseButtons';

require('../../PubHeader/draftReleaseButtons.scss');

type Props = {
	historyData: any;
	updateHistoryData: any;
	pubData: PubPageData;
};

const PreviewTab = (props: Props) => {
	const { communityData } = usePageContext();
	const { pubData, historyData } = props;
	const { latestKey, timestamps } = historyData;
	const latestTimestamp = timestamps[latestKey];
	return (
		<PubHeaderBackground
			className="spub-header-component"
			communityData={communityData}
			pubData={props.pubData}
		>
			<GridWrapper containerClassName="pub">
				<div className="spub-header-content-component">
					<div className="title-group-component">
						<h1 className="title">
							<span className="text-wrapper">{pubData.title}</span>
						</h1>
						<h3 className="description pub-header-themed-secondary">
							{pubData.description}
						</h3>
						<PubByline pubData={pubData} />
						<div className="draft-submit-buttons-component">
							<ResponsiveHeaderButton
								// @ts-expect-error ts-migrate(2322) FIXME: Type '{ icon: string; className: string; active: a... Remove this comment to see the full error message
								icon="history"
								className="draft-history-button"
								active={historyData.isViewingHistory}
								outerLabel={getHistoryButtonLabelForTimestamp(
									latestTimestamp,
									'draft last updated',
									'draft created',
								)}
								disabled={historyData.loadedIntoHistory}
								onClick={() =>
									props.updateHistoryData({
										isViewingHistory: !historyData.isViewingHistory,
									})
								}
							/>
							<ResponsiveHeaderButton
								// @ts-expect-error ts-migrate(2322) FIXME: Type '{ icon: string; tagName: string; href: strin... Remove this comment to see the full error message
								className="submit-button"
								icon={<Icon iconSize={13} className="submit-icon" icon="saved" />}
								label={{ top: 'Submit Pub', bottom: 'finish your submission' }}
							/>
						</div>
					</div>
				</div>
			</GridWrapper>
		</PubHeaderBackground>
	);
};

export default PreviewTab;
