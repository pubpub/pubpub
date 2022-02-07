import React, { useState } from 'react';

// import { Callout, Button, Dialog, Classes, Checkbox } from '@blueprintjs/core';
import { Callout, Button, Classes, Dialog } from '@blueprintjs/core';
import { apiFetch } from 'client/utils/apiFetch';
import { Submission, SubmissionStatus, DefinitelyHas } from 'types';

type Props = {
	submission: DefinitelyHas<Submission, 'submissionWorkflow'>;
	isOpen: boolean;
	onClose: () => any;
};

const SubmitDialog = (props: Props) => {
	const [isHandlingSubmission, setIsHandlingSubmission] = useState(false);
	const [updatedSubmission, setUpdatedSubmission] = useState(null);
	const [submissionErr, setSubmissionErr] = useState(null);
	const onSubmit = () => {
		setIsHandlingSubmission(true);
		apiFetch
			.put('/api/submissions', {
				id: props.submission.id,
				status: 'pending' as SubmissionStatus,
			})
			.then((submissionRes) => setUpdatedSubmission(submissionRes))
			.catch((err) => setSubmissionErr(err))
			.finally(() => setIsHandlingSubmission(false));
	};
	// add me to the success message: {props.submission.submissionWorkflow.emailText || null}
	return (
		<Dialog isOpen={props.isOpen} onClose={props.onClose}>
			{submissionErr ? (
				<Callout intent="warning" title="There was an error updating this submission." />
			) : updatedSubmission ? (
				<>
					<div className={Classes.DIALOG_BODY}>
						<Callout intent="success" title="Submitted!">
							Your pub has been submitted and is under review.
						</Callout>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button onClick={props.onClose} disabled={isHandlingSubmission}>
								Close
							</Button>
							<Button
								onClick={() => window.location.reload()}
								loading={isHandlingSubmission}
								intent="primary"
							>
								View Submission
							</Button>
						</div>
					</div>
				</>
			) : (
				<>
					<div className={Classes.DIALOG_BODY}>
						<p>Are you sure you're reade to submit this Pub?</p>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button onClick={props.onClose} disabled={isHandlingSubmission}>
								Cancel
							</Button>
							<Button
								onClick={onSubmit}
								loading={isHandlingSubmission}
								intent="primary"
							>
								Submit
							</Button>
						</div>
					</div>
				</>
			)}
		</Dialog>
	);
};

export default SubmitDialog;
