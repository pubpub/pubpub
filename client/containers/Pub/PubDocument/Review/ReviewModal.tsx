import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';

import { DialogLauncher } from 'components';
import ReviewerDialog from './ReviewerDialog';

type Props = {
	createReviewDoc: () => any;
	isLoading: any;
	createError: any;
	pubData: any;
	canEdit: boolean;
	setReviewTitle: any;
};

const ReviewModal = (props: Props) => {
	const { createReviewDoc, isLoading, createError, pubData, canEdit, setReviewTitle } = props;

	return (
		<div>
			<DialogLauncher
				renderLauncherElement={({ openDialog }) => (
					<Button
						icon="document-share"
						onClick={openDialog}
						minimal={true}
						loading={isLoading}
					>
						Submit Review
					</Button>
				)}
			>
				{({ isOpen, onClose, key }) => (
					<ReviewerDialog
						key={key}
						isOpen={isOpen}
						onClose={onClose}
						pubData={pubData}
						createReviewDoc={createReviewDoc}
						canEdit={canEdit}
						setReviewTitle={setReviewTitle}
					/>
				)}
			</DialogLauncher>

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
