import React from 'react';
import { ControlGroup, Dialog, Divider, InputGroup } from '@blueprintjs/core';

import {
	ClickToCopyButton,
	MenuConfigProvider,
	PendingChangesProvider,
	PubReleaseReviewDialog,
} from 'components';
import { usePageContext } from 'utils/hooks';
import { pubUrl } from 'utils/canonicalUrls';
import { usePubContext } from 'containers/Pub/pubHooks';
import { PatchFn, PubPageData } from 'types';

type SharedProps = {
	pubData: PubPageData;
};

type PubShareDialogProps = SharedProps & {
	isOpen: boolean;
	onClose: (...args: any[]) => any;
	updatePubData: PatchFn<PubPageData>;
};

const AccessHashOptions = (props: SharedProps) => {
	const { pubData } = props;
	const { communityData, featureFlags } = usePageContext();

	const { historyData } = usePubContext();

	const { reviewHash } = pubData;

	const renderCopyLabelComponent = (label, url) => {
		return (
			<ControlGroup className="hash-row">
				<ClickToCopyButton minimal={false} copyString={url}>
					Copy {label} URL
				</ClickToCopyButton>
				<InputGroup className="display-url" value={url} fill />
			</ControlGroup>
		);
	};

	const createAccessUrl = (accessHash, options) =>
		pubUrl(communityData, pubData, { accessHash, ...options });

	const reviewAccessUrl = createAccessUrl(reviewHash, {
		historyKey: historyData.currentKey,
		isReview: true,
	});

	return (
		<div className="access-hash-options">
			<p>
				You can grant visitors permission to review the draft of this Pub by sharing a URL.
			</p>

			{featureFlags.reviews && renderCopyLabelComponent('Review', reviewAccessUrl)}
		</div>
	);
};

const ReviewSettings = (props: PubShareDialogProps) => {
	const { isOpen, onClose, pubData, updatePubData } = props;
	const { scopeData } = usePageContext();

	const { canCreateReviews } = scopeData.activePermissions;
	const { viewHash, editHash, isReview } = pubData;
	const hasHash = !!(viewHash || editHash);

	return (
		<Dialog
			lazy={true}
			title="Share Pub"
			className="pub-share-dialog-component"
			isOpen={isOpen}
			onClose={onClose}
		>
			<MenuConfigProvider config={{ usePortal: false }}>
				<PendingChangesProvider>
					<div>
						<div>
							{hasHash && (
								<React.Fragment>
									<Divider />
									<div className="pane">
										<h6 className="pane-title">Share a URL</h6>
										<AccessHashOptions pubData={pubData} />
									</div>
								</React.Fragment>
							)}
						</div>
						<div>
							{canCreateReviews && !isReview && (
								<div>
									<h6>Request Publication</h6>
									<PubReleaseReviewDialog
										onClose={onClose}
										pubData={pubData}
										updatePubData={updatePubData}
									/>
								</div>
							)}
						</div>
						<div>
							<h6>Allow released pubs to be reviewed?</h6>
						</div>
					</div>
				</PendingChangesProvider>
			</MenuConfigProvider>
		</Dialog>
	);
};
export default ReviewSettings;
