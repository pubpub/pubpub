import * as types from 'types';

type SendEmailOptions = {
	previousStatus: types.SubmissionStatus;
	currentStatus: types.SubmissionStatus;
};

const getEmailKindToSend = (
	options: Pick<SendEmailOptions, 'previousStatus' | 'currentStatus'>,
): null | types.SubmissionEmailKind => {
	const { previousStatus, currentStatus } = options;
	if (previousStatus === 'incomplete' && currentStatus === 'pending') {
		return 'received';
	}
	if (previousStatus === 'pending' && currentStatus === 'accepted') {
		return 'accepted';
	}
	if (previousStatus === 'pending' && currentStatus === 'declined') {
		return 'declined';
	}
	return null;
};

export const sendEmailToSubmissionParticiapnts = (options: SendEmailOptions) => {
	const emailKind = getEmailKindToSend(options);
	if (emailKind) {
	}
};
