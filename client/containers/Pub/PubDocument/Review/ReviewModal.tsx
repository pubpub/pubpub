import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';

import { DialogLauncher, PubReleaseReviewDialog } from 'components';

type Props = {
	createReviewDoc: () => any;
	isLoading: any;
	createError: any;
	pubData: any;
	updatePubData: any;
};

const ReviewModal = (props: Props) => {
	const { createReviewDoc, isLoading, createError, pubData, updatePubData } = props;

	return (
		<div>
			<DialogLauncher
				renderLauncherElement={({ openDialog }) => (
					<Button icon="document-share" onClick={openDialog} minimal={true}>
						Submit Review
					</Button>
				)}
			>
				{({ isOpen, onClose, key }) => (
					<PubReleaseReviewDialog
						key={key}
						isOpen={isOpen}
						onClose={onClose}
						pubData={pubData}
						updatePubData={updatePubData}
					/>
				)}
			</DialogLauncher>

			<Button onClick={createReviewDoc} loading={isLoading}>
				This button kinda lit
			</Button>

			{createError && (
				<NonIdealState
					title="Something something errors"
					// @ts-expect-error ts-migrate(2322) FIXME: Type '{ title: string; visual: string; action: Ele... Remove this comment to see the full error message
					visual="error"
					action={
						<a href="/login?redirect=/community/create" className="bp3-button">
							Login or Signup
						</a>
					}
				/>
			)}
		</div>
	);
};

export default ReviewModal;
