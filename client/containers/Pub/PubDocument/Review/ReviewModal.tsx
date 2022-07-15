import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';

type Props = {
	createReviewDoc: () => any;
	isLoading: any;
	createError: any;
};
const ReviewModal = (props: Props) => {
	const { createReviewDoc, isLoading, createError } = props;

	return (
		<div>
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
