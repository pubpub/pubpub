import { DocJson } from 'types';

export type SubmissionWorkflow = {
	id: string;
	createdAt: string;
	updatedAt: string;
	enabled: boolean;
	instructionsText: DocJson;
	afterSubmittedText: DocJson;
	emailText: DocJson;
	targetEmailAddress: null | string;
};
