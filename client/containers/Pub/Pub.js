import React from 'react';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utils';
import { communityDataProps, locationDataProps, loginDataProps } from 'types/base';
import { pubDataProps } from 'types/pub';
import PubSyncManager from './PubSyncManager';
import PubHeader from './PubHeader';
import PubDocument from './PubDocument';
import PubMeta from './PubMeta';
import PubMerge from './PubMerge';
import PubManage from './PubManage';
import PubReviewCreate from './PubReviewCreate';
import PubReviews from './PubReviews';
import PubReview from './PubReview';
import PubBranchCreate from './PubBranchCreate';
import PubDetails from './PubDetails';
import PubHeaderFormatting from './PubDocument/PubHeaderFormatting';
import PubHistory from './PubHistory';

require('./pub.scss');

const propTypes = {
	communityData: communityDataProps.isRequired,
	loginData: loginDataProps.isRequired,
	locationData: locationDataProps.isRequired,
	pubData: pubDataProps.isRequired,
};

const Pub = (props) => {
	return (
		<div id="pub-new-container">
			<PageWrapper
				locationData={props.locationData}
				communityData={props.communityData}
				loginData={props.loginData}
			>
				<PubSyncManager
					pubData={props.pubData}
					locationData={props.locationData}
					loginData={props.loginData}
				>
					{({ pubData, collabData, firebaseBranchRef, updateLocalData, historyData }) => {
						const mode = pubData.mode;
						const { isViewingHistory } = historyData;
						const modeProps = {
							pubData: pubData,
							collabData: collabData,
							historyData: historyData,
							firebaseBranchRef: firebaseBranchRef,
							updateLocalData: updateLocalData,
						};
						return (
							<React.Fragment>
								<PubHeader
									pubData={pubData}
									updateLocalData={updateLocalData}
									collabData={collabData}
									historyData={historyData}
								/>
								<PubMeta
									pubData={pubData}
									updateLocalData={updateLocalData}
									collabData={collabData}
									historyData={historyData}
								/>
								{mode === 'document' && (
									<React.Fragment>
										{!pubData.isStaticDoc && !isViewingHistory && (
											<PubHeaderFormatting
												pubData={pubData}
												collabData={collabData}
											/>
										)}
										{isViewingHistory && <PubHistory {...modeProps} />}
										{!isViewingHistory && <PubDetails {...modeProps} />}
										<PubDocument {...modeProps} />
									</React.Fragment>
								)}
								{mode === 'manage' && <PubManage {...modeProps} />}
								{mode === 'merge' && <PubMerge {...modeProps} />}
								{mode === 'review' && <PubReview {...modeProps} />}
								{mode === 'reviews' && <PubReviews {...modeProps} />}
								{mode === 'reviewCreate' && <PubReviewCreate {...modeProps} />}
								{mode === 'branchCreate' && <PubBranchCreate {...modeProps} />}
							</React.Fragment>
						);
					}}
				</PubSyncManager>
			</PageWrapper>
		</div>
	);
};

Pub.propTypes = propTypes;
export default Pub;

hydrateWrapper(Pub);
