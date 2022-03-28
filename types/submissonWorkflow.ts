import { Collection, DocJson } from 'types';

export type SubmissionWorkflow = {
	id: string;
	createdAt: string;
	updatedAt: string;
	enabled: boolean;
	title: string;
	introText: DocJson;
	instructionsText: DocJson;
	congratulationsEmailText: DocJson;
	condolencesEmailText: DocJson;
	thanksEmailText: DocJson;
	targetEmailAddress: string;
	collectionId: string;
	collection?: Collection;
};
