import React from 'react';
import { AnchorButton, Callout, Classes, Dialog, InputGroup } from '@blueprintjs/core';
import { PubPageData, ScopeData, Member } from 'types';

require('./reviewerDialog.scss');

type Props = {
	isOpen: boolean;
	pubData: PubPageData;
	onClose: (...args: any[]) => any;
	onCreateReviewDoc: () => void;
	setReviewTitle: React.Dispatch<React.SetStateAction<string>>;
	reviewTitle: string;
	reviewerName: string;
	setReviewerName: React.Dispatch<React.SetStateAction<string>>;
	createdReview: boolean;
	createError: any;
	activePermissions: ScopeData['activePermissions'];
	fullName: string | undefined;
	memberData: Member[];
	reviewPath: string;
	pubPath: string;
};

const ReviewerDialog = (props: Props) => {
	const {
		isOpen,
		onClose,
		pubData,
		onCreateReviewDoc,
		setReviewTitle,
		reviewTitle,
		reviewerName,
		setReviewerName,
		createdReview,
		createError,
		activePermissions,
		fullName,
		memberData,
		pubPath,
		reviewPath,
	} = props;
	const { canManage } = activePermissions;
	const isUser = !!(activePermissions.canEdit || fullName);
	const isMember = memberData.length > 0;
	const renderPreReviewButtons = () => {
		return (
			<React.Fragment>
				<AnchorButton onClick={onClose}>Cancel</AnchorButton>
				<AnchorButton intent="primary" onClick={onCreateReviewDoc}>
					Create Review
				</AnchorButton>
			</React.Fragment>
		);
	};

	const handleTitleOnBlur = (evt) => setReviewTitle(evt.target.value.trim());
	const handleReviewerNameOnBlur = (evt) => setReviewerName(evt.target.value.trim());
	const handleKeyDown = (evt) => {
		if (evt.key === 'Enter') {
			evt.currentTarget.blur();
		}
	};
	return (
		<Dialog
			lazy={true}
			title="Create Review"
			onClose={onClose}
			isOpen={isOpen}
			className="reviewer-dialog"
		>
			<div className={Classes.DIALOG_BODY}>
				<div className="title-input">
					<p>Add a title to your review?</p>
					<InputGroup
						defaultValue={reviewTitle}
						onKeyDown={handleKeyDown}
						onBlur={handleTitleOnBlur}
					/>
				</div>
				{!isUser && (
					<div className="title-input">
						<p>Add your name?</p>
						<InputGroup
							defaultValue={reviewerName}
							onKeyDown={handleKeyDown}
							onBlur={handleReviewerNameOnBlur}
						/>
					</div>
				)}
				<p>
					You are about to submit a review for <b>{pubData.title}</b>.
				</p>
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>{renderPreReviewButtons()}</div>
			</div>
			<div className="callout">
				{createdReview && (
					<Callout intent="success" title="Created Review!">
						Your review was successfully submitted!
						<div>
							<AnchorButton minimal={true} intent="success" href={pubPath}>
								Return to Pub
							</AnchorButton>
							{canManage && isMember && (
								<AnchorButton minimal={true} intent="success" href={reviewPath}>
									Go to Review
								</AnchorButton>
							)}
						</div>
					</Callout>
				)}
			</div>
			<div className="callout">
				{createError && (
					<Callout intent="danger" title="There was an error submitting your review">
						Your review was not successfully submitted!
					</Callout>
				)}
			</div>
		</Dialog>
	);
};

export default ReviewerDialog;
