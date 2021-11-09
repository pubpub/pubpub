export type EnabledStatus = true | false;

export type SubmissionWorkflow = {
	id: string;
	enabled: EnabledStatus;
	instructions?: any;
	afterSubmittedText?: any;
	email?: any;
	layoutBlock?: any;
};
