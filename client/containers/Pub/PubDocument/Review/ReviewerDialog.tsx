import React from 'react';
import { Button, Classes, Dialog, InputGroup } from '@blueprintjs/core';

require('./reviewerDialog.scss');

type Props = {
	isOpen: boolean;
	pubData: {
		title: string;
	};
	onClose: (...args: any[]) => any;
	createReviewDoc: () => any;
	setReviewTitle: any;
	reviewTitle: string;
	reviewerName: any;
	setReviewerName: any;
	isUser: boolean;
};

const ReviewerDialog = (props: Props) => {
	const {
		isOpen,
		onClose,
		pubData,
		createReviewDoc,
		setReviewTitle,
		reviewTitle,
		reviewerName,
		setReviewerName,
		isUser,
	} = props;

	const renderPreReviewButtons = () => {
		return (
			<React.Fragment>
				<Button onClick={onClose}>Cancel</Button>
				<Button intent="primary" onClick={createReviewDoc}>
					Create Review
				</Button>
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
			className="pub-release-review-dialog-component"
		>
			<div className={Classes.DIALOG_BODY}>
				<div className="reviewer-dialog">
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
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>{renderPreReviewButtons()}</div>
			</div>
		</Dialog>
	);
};

export default ReviewerDialog;
