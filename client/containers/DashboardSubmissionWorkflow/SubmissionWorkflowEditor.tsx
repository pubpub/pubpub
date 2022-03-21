import React, { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup } from '@blueprintjs/core';

import { Collection } from 'types';
import { LayoutSubmissionBannerSkeleton } from 'client/components/Layout';
import { usePageContext } from 'utils/hooks';
import { isValidEmail } from 'utils/email';
import { withValue } from 'utils/fp';
import { collectionUrl } from 'utils/canonicalUrls';

import WorkflowTextEditor from './WorkflowTextEditor';
import EmailPreview from './EmailPreview';
import SubmissionWorkflowStepPicker from './SubmissionWorkflowStepPicker';
import { EditableSubmissionWorkflow, SubmissionWorkflowConfigStep } from './types';
import {
	RecordValidator,
	isValidDocJson,
	isAlwaysValid,
	validate,
	isValidTitle,
} from './validators';

require('./submissionWorkflowEditor.scss');

type Props = {
	collection: Collection;
	onUpdateWorkflow: (workflow: Partial<EditableSubmissionWorkflow>) => unknown;
	onValidateWorkflow: (isValid: boolean) => unknown;
	workflow: EditableSubmissionWorkflow;
};

const validator: RecordValidator<EditableSubmissionWorkflow> = {
	title: isValidTitle,
	introText: isValidDocJson,
	instructionsText: isValidDocJson,
	emailText: isValidDocJson,
	acceptedText: isAlwaysValid,
	declinedText: isAlwaysValid,
	targetEmailAddress: isValidEmail,
	enabled: isAlwaysValid,
};

const SubmissionWorkflowEditor = (props: Props) => {
	const { collection, onUpdateWorkflow, onValidateWorkflow, workflow } = props;
	const { communityData } = usePageContext();
	const { email: communityEmail } = communityData;
	const [step, setStep] = useState<SubmissionWorkflowConfigStep>('instructions-requirements');
	const [{ fields: fieldValidStates, isValid }, setValidation] = useState(() =>
		validate(workflow, validator),
	);

	const collectionLink = withValue(collectionUrl(communityData, collection), (url) => (
		<a href={url} target="_blank" rel="noopener noreferrer">
			{url}
		</a>
	));

	const updateWorkflow = (update: Partial<EditableSubmissionWorkflow>) => {
		const nextWorkflow = { ...workflow, ...update };
		const nextValidation = validate(nextWorkflow, validator);
		setValidation(nextValidation);
		onUpdateWorkflow(update);
	};

	const sharedEmailPreviewProps = {
		community: communityData,
		from: 'submissions@pubpub.org',
		to: 'submitter.name@place.org',
		cc: workflow.targetEmailAddress,
	};

	useEffect(() => void onValidateWorkflow(isValid), [onValidateWorkflow, isValid]);

	const renderInstructionsRequirements = () => {
		return (
			<>
				<h2>Add detailed submission instructions</h2>
				<p>
					Now provide instructions detailing any requirements for submissions to this
					Collection. Submitters will be able to refer to this text at any time.
				</p>
				<WorkflowTextEditor
					placeholder="Detailed submission instructions"
					initialContent={workflow.instructionsText}
					onContent={(content) => updateWorkflow({ instructionsText: content })}
				/>
			</>
		);
	};

	const renderResponseEmails = () => {
		return (
			<div className="email-step">
				<p>
					When a submission is completed, PubPub will email the submitter and CC this
					address:
				</p>
				<div className="target-email-input">
					<InputGroup
						type="email"
						value={workflow.targetEmailAddress}
						intent={
							workflow.targetEmailAddress && !fieldValidStates.targetEmailAddress
								? 'danger'
								: undefined
						}
						placeholder="Submissions email address"
						onChange={(e) => updateWorkflow({ targetEmailAddress: e.target.value })}
					/>
					{communityEmail && (
						<Button
							disabled={workflow.targetEmailAddress === communityEmail}
							onClick={() => updateWorkflow({ targetEmailAddress: communityEmail })}
						>
							Use {communityEmail}
						</Button>
					)}
				</div>
				<p>
					You can customize the automated response here, perhaps with a note of thanks and
					an expected response time:
				</p>
				<EmailPreview
					{...sharedEmailPreviewProps}
					kind="received"
					collectionTitle={collection.title}
					body={
						<WorkflowTextEditor
							placeholder="Custom email text"
							initialContent={workflow.emailText}
							onContent={(content) => updateWorkflow({ emailText: content })}
						/>
					}
				/>
				<h2>Create a template response for accepted and declined submissions</h2>
				<p>
					These are just templates. You'll be able to customize the message you send
					before each accepted or declined submission.
				</p>
				<h3>Accepted submissions</h3>
				<EmailPreview
					{...sharedEmailPreviewProps}
					kind="accepted"
					collectionTitle={collection.title}
					body={
						<WorkflowTextEditor
							placeholder="Custom email text"
							initialContent={workflow.acceptedText}
							onContent={(content) => updateWorkflow({ acceptedText: content })}
						/>
					}
				/>
				<h3>Declined submissions</h3>
				<EmailPreview
					{...sharedEmailPreviewProps}
					kind="declined"
					collectionTitle={collection.title}
					body={
						<WorkflowTextEditor
							placeholder="Custom email text"
							initialContent={workflow.declinedText}
							onContent={(content) => updateWorkflow({ declinedText: content })}
						/>
					}
				/>
			</div>
		);
	};

	const renderLayoutBanner = () => {
		return (
			<>
				<p>
					Visitors to {collectionLink} will see a banner inviting them to submit to this
					Collection.
				</p>
				<LayoutSubmissionBannerSkeleton
					className="banner-skeleton"
					title={
						<EditableText
							className="banner-title-text"
							placeholder='Click to add banner title (e.g. "Call for Submissions")'
							value={workflow.title}
							onChange={(title) => updateWorkflow({ title })}
						/>
					}
					content={
						<WorkflowTextEditor
							placeholder="Banner content"
							initialContent={workflow.introText}
							onContent={(introText) => updateWorkflow({ introText })}
						/>
					}
				/>
			</>
		);
	};

	return (
		<div className="submission-workflow-editor-component">
			<SubmissionWorkflowStepPicker
				selectedStep={step}
				onSelectStep={setStep}
				stepCompletions={{
					'instructions-requirements': true,
					'response-emails': false,
					'layout-banner': false,
				}}
			/>
			{step === 'instructions-requirements' && renderInstructionsRequirements()}
			{step === 'response-emails' && renderResponseEmails()}
			{step === 'layout-banner' && renderLayoutBanner()}
		</div>
	);
};

export default SubmissionWorkflowEditor;
