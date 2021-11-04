import React from 'react';

import { SubmissionWorkflow } from 'types';
import { LayoutSubmissionBannerSkeleton } from 'client/components/Layout';

import { EditableText, InputGroup } from '@blueprintjs/core';
import { communityData } from 'dist/server/utils/storybook/data';
import { useSubmissionWorkflow } from './useSubmissionWorkflow';
import Step from './Step';
import WorkflowTextEditor from './WorkflowTextEditor';

require('./submissionWorkflowEditor.scss');

type Props = {
	initialWorkflow: null | SubmissionWorkflow;
	collectionUrl: string;
};

const SubmissionWorkflowEditor = (props: Props) => {
	const { initialWorkflow, collectionUrl } = props;
	const { workflow, updateWorkflow } = useSubmissionWorkflow(initialWorkflow);

	return (
		<div className="submission-workflow-editor-component">
			<Step
				className="banner-step"
				number={1}
				title="Invite submitters from this Collection's landing page"
			>
				<p>
					Visitors to{' '}
					<a href={collectionUrl} target="_blank" rel="noopener noreferrer">
						{collectionUrl}
					</a>{' '}
					will see a banner inviting them to submit to this Collection.
				</p>
				<LayoutSubmissionBannerSkeleton
					className="banner-skeleton"
					title={
						<EditableText
							className="banner-title-text"
							placeholder="Click to add banner title"
						/>
					}
					content={
						<WorkflowTextEditor
							placeholder="Banner content"
							initialContent={workflow.instructionsText}
							onContent={(content) => updateWorkflow({ instructionsText: content })}
						/>
					}
				/>
			</Step>
			<Step
				className="instructions-step"
				number={2}
				title="Add detailed submission instructions"
			>
				<p>
					Now provide instructions detailing any requirements for submissions to this
					Collection. Submitters will be able to refer to this text at any time.
				</p>
				<WorkflowTextEditor
					placeholder="Detailed submission instructions"
					initialContent={workflow.instructionsText}
					onContent={(content) => updateWorkflow({ instructionsText: content })}
				/>
			</Step>
			<Step
				className="feedback-step"
				number={3}
				title="Provide email feedback to completed submissions"
			>
				<p>
					When a submission is completed, PubPub will email the submitter and CC this
					address:
				</p>
				<InputGroup
					width={400}
					type="email"
					value={workflow.targetEmailAddress ?? ''}
					placeholder="Submissions email address"
					onChange={(e) => updateWorkflow({ targetEmailAddress: e.target.value })}
				/>
				<p>
					You can customize the automated response here, perhaps with a note of thanks and
					an expected response time.
				</p>
				<WorkflowTextEditor
					placeholder="Custom email text"
					initialContent={workflow.instructionsText}
					onContent={(content) => updateWorkflow({ instructionsText: content })}
				/>
			</Step>
		</div>
	);
};

export default SubmissionWorkflowEditor;
