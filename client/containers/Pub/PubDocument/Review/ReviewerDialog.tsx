import React from 'react';
import { Button, Classes, Dialog, InputGroup } from '@blueprintjs/core';

require('./reviewerDialog.scss');

type OwnProps = {
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
	canManage: boolean;
};

const defaultProps = {};

type Props = OwnProps & typeof defaultProps;

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
		canManage,
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
	const helperTextToRender = (
		<p>
			You are about to submit a review for <b>{pubData.title}</b>.
		</p>
	);

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
							onKeyDown={(evt) => {
								if (evt.key === 'Enter') {
									evt.currentTarget.blur();
								}
							}}
							onBlur={(evt) => setReviewTitle(evt.target.value.trim())}
						/>
					</div>
					{!canManage && (
						<div className="title-input">
							<p>Add your name?</p>
							<InputGroup
								defaultValue={reviewerName}
								onKeyDown={(evt) => {
									if (evt.key === 'Enter') {
										evt.currentTarget.blur();
									}
								}}
								onBlur={(evt) => setReviewerName(evt.target.value.trim())}
							/>
						</div>
					)}
					{helperTextToRender}
				</div>
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>{renderPreReviewButtons()}</div>
			</div>
		</Dialog>
	);
};

export default ReviewerDialog;
