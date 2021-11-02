export type SubmissionStatus = 'incomplete' | 'submitted' | 'accepted' | 'declined';

export type Submission = {
	id: string;
	status: SubmissionStatus;
};
