import React, { useState } from 'react';

import { Callout, Button, Classes, Dialog } from '@blueprintjs/core';
import { apiFetch } from 'client/utils/apiFetch';
import { Submission, SubmissionStatus, DefinitelyHas } from 'types';
import { Editor } from 'components';
import { getEmptyDoc, jsonToNode } from 'components/Editor';
import { usePubContext } from 'containers/Pub/pubHooks';

type Props = {
	submission: DefinitelyHas<Submission, 'submissionWorkflow'>;
	isOpen: boolean;
	onClose: () => any;
};

const SubmitDialog = (props: Props) => {
	const { collabData } = usePubContext();
	const { view } = collabData.editorChangeObject;
	const [isHandlingSubmission, setIsHandlingSubmission] = useState(false);
	const [updatedSubmission, setUpdatedSubmission] = useState(null);
	const abstract = props.submission.abstract || getEmptyDoc();
	const [submissionErr, setSubmissionErr] = useState(null);
	const testDoc = collabData.editorChangeObject.view?.state.doc.toJSON() || {};
	const abstractNode = jsonToNode(abstract);
	const onSubmit = () => {
		setIsHandlingSubmission(true);
		if (collabData.status !== 'connecting') {
			const { tr } = view.state;
			tr.replaceSelectionWith(abstractNode);
			view.dispatch(tr);
		}
		if (collabData.status === 'connecting') {
			apiFetch
				.put('/api/submissions', {
					id: props.submission.id,
					status: 'pending' as SubmissionStatus,
				})
				.then((submissionRes) => setUpdatedSubmission(submissionRes))
				.catch((err) => setSubmissionErr(err))
				.finally(() => setIsHandlingSubmission(false));
		}
		setIsHandlingSubmission(false);
	};
	console.log(collabData, view?.state.doc.textContent, abstractNode.textContent);
	return (
		<Dialog isOpen={props.isOpen} onClose={props.onClose}>
			{submissionErr ? (
				<Callout intent="warning" title="There was an error updating this submission." />
			) : updatedSubmission ? (
				<>
					<div className={Classes.DIALOG_BODY}>
						<Callout intent="success" title="Submitted!">
							Your pub has been submitted and is under review.
							<Editor
								isReadOnly
								initialContent={props.submission.submissionWorkflow.emailText}
							/>
							<Editor isReadOnly initialContent={testDoc} />
						</Callout>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button
								onClick={props.onClose}
								disabled={
									isHandlingSubmission || collabData.status === 'connecting'
								}
							>
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
							<Button
								onClick={props.onClose}
								disabled={
									isHandlingSubmission || collabData.status === 'connecting'
								}
							>
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
