import { DocJson } from 'types';
import { LayoutBlockSubmissionBanner } from 'utils/layout';

export type EnabledStatus = true | false;

export type SubmissionWorkflow = {
	id: string;
	createdAt: string;
	updatedAt: string;
	enabled: boolean;
	instructionsText: DocJson;
	emailText: DocJson;
	targetEmailAddress: string;
	bannerContent: LayoutBlockSubmissionBanner['content'];
};
