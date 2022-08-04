import React, { useState, useMemo } from 'react';
import { Button } from '@blueprintjs/core';
import Color from 'color';

import { DialogLauncher } from 'components';
import { Community, PubPageData } from 'types';

import ReviewerDialog from './ReviewerDialog';

require('./reviewModal.scss');

type Props = {
	isLoading: boolean;
	pubData: PubPageData;

	reviewTitle: string;
	setReviewTitle: React.Dispatch<React.SetStateAction<string>>;
	isUser: boolean;
	setReviewerName: React.Dispatch<React.SetStateAction<string>>;
	reviewerName: string;
	onSubmit: any;
	communityData: Community;
};

const ReviewModal = (props: Props) => {
	const {
		isLoading,
		pubData,
		reviewTitle,
		setReviewTitle,
		isUser,
		setReviewerName,
		reviewerName,
		onSubmit,
		communityData,
	} = props;
	const [hover, setHover] = useState(false);
	const lighterAccentColor = useMemo(
		() => Color(communityData.accentColorDark).alpha(0.4),
		[communityData.accentColorDark],
	);
	const bgColor = !hover ? lighterAccentColor : communityData.accentColorDark;
	return (
		<div className="review-modal">
			<DialogLauncher
				renderLauncherElement={({ openDialog }) => (
					<Button
						icon="document-share"
						onClick={openDialog}
						minimal={true}
						loading={isLoading}
						className="review-submission-button"
						style={{ background: bgColor }}
						intent="primary"
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
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
						onCreateReviewDoc={onSubmit}
						setReviewTitle={setReviewTitle}
						reviewTitle={reviewTitle}
						reviewerName={reviewerName}
						setReviewerName={setReviewerName}
						isUser={isUser}
					/>
				)}
			</DialogLauncher>
		</div>
	);
};

export default ReviewModal;
