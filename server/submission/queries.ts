import { Submission } from 'server/models';

export const createSubmission = async ({ pubId, status }) =>
	Submission.create({
		pubId,
		status,
	});

export const updateSubmission = async ({ status, submissionId }) =>
	Submission.update(
		{ status },
		{
			where: { id: submissionId },
		},
	);

export const destroySubmission = async ({ submissionId }) =>
	Submission.destroy({
		where: {
			id: submissionId,
		},
	});
