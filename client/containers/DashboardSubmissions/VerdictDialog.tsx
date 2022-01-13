import React, { useState } from 'react';
import { Callout, Button, Dialog, Classes, Checkbox } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';
import { DefinitelyHas, Pub, DocJson } from 'types';
import { Icon } from 'components';
import WorkflowTextEditor from '../DashboardSubmissionWorkflow/WorkflowTextEditor';

require('./verdictDialog.scss');

type Props = {
	isOpen: boolean;
	onClose: () => unknown;
	actionTitle: string;
	completedName: string;
	apiMethod: string;
	status?: string;
	pub: DefinitelyHas<Pub, 'submission'>;
};

type PreSubmissionBodyProps = {
	handleSubmission: (customEmailText: DocJson, skipEmail: boolean) => void;
	isHandlingSubmission: boolean;
	actionTitle: string;
	onClose: () => unknown;
	initialEmailText: DocJson;
};

const PreSubmissionBody = (props: PreSubmissionBodyProps) => {
	const [customEmailText, setCustomEmailText] = useState(props.initialEmailText);
	const [shouldSkipEmail, setShouldSkipEmail] = useState(false);
	return (
		<>
			<div className={Classes.DIALOG_BODY}>
				<p>Would you like to {props.actionTitle} this submission?</p>
				<p className="email-text-header">
					<Icon icon="manually-entered-data" iconSize={12} />
					{'  '}Email to Authors
				</p>
				<WorkflowTextEditor
					initialContent={props.initialEmailText}
					onContent={setCustomEmailText}
					placeholder="Specify message to pub author(s)."
				/>
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Checkbox
						checked={shouldSkipEmail}
						disabled={props.isHandlingSubmission}
						onChange={(e) => {
							setShouldSkipEmail((e.target as HTMLInputElement).checked);
						}}
						label="Don't send email to author(s)"
					/>
					<Button onClick={props.onClose} disabled={props.isHandlingSubmission}>
						Cancel
					</Button>
					<Button
						onClick={() => props.handleSubmission(customEmailText, shouldSkipEmail)}
						loading={props.isHandlingSubmission}
						intent="primary"
					>
						Email & {props.actionTitle}
					</Button>
				</div>
			</div>
		</>
	);
};

type PostSubmitBodyProps = {
	completedName: string;
	onClose: () => unknown;
	isHandlingSubmission: boolean;
};
const PostSubmitBody = (props: PostSubmitBodyProps) => {
	return (
		<>
			<div className={Classes.DIALOG_BODY}>
				<Callout intent="success" title={`Submission ${props.completedName}!`}>
					You successfully {props.completedName} the submission!
				</Callout>
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={props.onClose} disabled={props.isHandlingSubmission}>
						Close
					</Button>
				</div>
			</div>
		</>
	);
};

const VerdictDialog = (props: Props) => {
	const [isHandlingSubmission, setIsHandlingSubmission] = useState(false);
	const [updatedSubmission, setUpdatedSubmission] = useState(null);
	const [submissionError, setSubmissionError] = useState(null);
	const handleSubmission = (customEmailText: DocJson, skipEmail: boolean) => {
		setIsHandlingSubmission(true);
		apiFetch('/api/submissions', {
			method: props.apiMethod,
			body: JSON.stringify({
				id: props.pub.submission.id,
				skipEmail,
				...(customEmailText && { customEmailText }),
				...(props.status && { status: props.status }),
			}),
		})
			.then((submissionRes) => {
				setUpdatedSubmission(submissionRes);
				setIsHandlingSubmission(false);
			})
			.catch((err) => {
				setSubmissionError(err);
				setIsHandlingSubmission(false);
			});
	};
	return (
		<Dialog
			lazy={true}
			title={props.actionTitle}
			className="verdict-dialog"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			{submissionError ? (
				<Callout intent="warning" title="There was an error creating this submission." />
			) : updatedSubmission ? (
				<PostSubmitBody
					isHandlingSubmission={isHandlingSubmission}
					completedName={props.completedName}
					onClose={props.onClose}
				/>
			) : (
				<PreSubmissionBody
					onClose={props.onClose}
					handleSubmission={handleSubmission}
					initialEmailText={props.pub.submission.submissionWorkflow.emailText}
					isHandlingSubmission={isHandlingSubmission}
					actionTitle={props.actionTitle}
				/>
			)}
		</Dialog>
	);
};

export default VerdictDialog;
