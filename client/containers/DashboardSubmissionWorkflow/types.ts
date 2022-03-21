import { SubmissionWorkflow } from 'types';

export const submissionWorkflowConfigSteps = [
	'instructions-requirements',
	'response-emails',
	'layout-banner',
] as const;

export type SubmissionWorkflowConfigStep = typeof submissionWorkflowConfigSteps[number];

export type EditableSubmissionWorkflow = Omit<
	SubmissionWorkflow,
	'id' | 'createdAt' | 'updatedAt' | 'collectionId'
>;
