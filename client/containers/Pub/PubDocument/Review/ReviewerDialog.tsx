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
	reviewTitle: any;
};

const defaultProps = {};

type Props = OwnProps & typeof defaultProps;

const ReviewerDialog = (props: Props) => {
	const { isOpen, onClose, pubData, createReviewDoc, setReviewTitle, reviewTitle } = props;

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
					<p>Add a title to your review?</p>
					<div className="title-input">
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
