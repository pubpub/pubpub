import React, { useState } from 'react';
import { ControlGroup, Dialog, Divider, InputGroup, Checkbox } from '@blueprintjs/core';

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

require('./reviewSettings.scss');

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
	const { viewHash, editHash, isReview, canReviewRelease } = pubData;
	const hasHash = !!(viewHash || editHash);
	const [checked] = useState<boolean>(canReviewRelease);
	// const handlePublicReview = () => {
	// 	// set a field on review to public
	// 	apiFetch('/api/pubs', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			communityId: communityData.id,
	// 			pubId: pubData.id,
	// 			// @ts-expect-error ts-migrate(2339) FIXME: Property 'content' does not exist on type '{}'.
	// 			content: noteData.content,
	// 			// @ts-expect-error ts-migrate(2339) FIXME: Property 'text' does not exist on type '{}'.
	// 			text: noteData.text,
	// 			releaseRequested: true,
	// 		}),
	// 	})
	// 		.then(() => {
	// 			setError(null);
	// 			setChecked(!checked);
	// 			setIsCreatingReview(false);
	// 			updatePubData(() => {
	// 				return {
	// 					canReviewRelease: checked,
	// 				};
	// 			});
	// 		})
	// 		.catch((err) => {
	// 			setError(err);
	// 			setIsCreatingReview(false);
	// 		});
	// };

	return (
		<Dialog
			lazy={true}
			title="Review Settings"
			className="review-settings-component"
			isOpen={isOpen}
			onClose={onClose}
		>
			<MenuConfigProvider config={{ usePortal: false }}>
				<PendingChangesProvider>
					<div>
						<div>
							{hasHash && (
								<React.Fragment>
									<div className="pane">
										<h6 className="pane-title">Share a URL</h6>
										<AccessHashOptions pubData={pubData} />
									</div>
								</React.Fragment>
							)}
						</div>
						<Divider />
						<div>
							{canCreateReviews && !isReview && (
								<div className="pane">
									<h6 className="pane-title">Request Publication</h6>
									<PubReleaseReviewDialog
										onClose={onClose}
										pubData={pubData}
										updatePubData={updatePubData}
									/>
								</div>
							)}
						</div>
						<Divider />
						<div className="pane">
							<h6 className="pane-title">Open reviews</h6>
							<p>
								You can allow visitors to the releaseed verion of this Pub to review
								it.
							</p>
							<Checkbox label="Enabled " checked={checked} onChange={() => {}} />
						</div>
					</div>
				</PendingChangesProvider>
			</MenuConfigProvider>
		</Dialog>
	);
};
export default ReviewSettings;
