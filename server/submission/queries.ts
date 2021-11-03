import { Submission } from 'server/models';

export const createSubmission = async (inputValues) =>
	Submission.create({
		pubId: inputValues.pubId,
		status: inputValues.status,
	});

export const updateSubmission = async (inputValues) =>
	Submission.update(inputValues, {
		where: { id: inputValues.submissionId },
	});

export const destroySubmission = (inputValues) =>
	Submission.destroy({
		where: {
			id: inputValues.submissionId,
			pubId: inputValues.pubId,
		},
	});
