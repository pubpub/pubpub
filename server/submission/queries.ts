import { Submission } from 'server/models';

export const createSubmission = async (inputValues, actorId = null) =>
	Submission.create(
		{
			pubId: inputValues.pubId,
			status: inputValues.status,
		},
		{ actorId },
	);

export const updateSubmission = async (inputValues, updatePermissions, actorId = null) => {
	const filteredValues: Record<string, any> = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});
	return Submission.update(filteredValues, {
		where: { id: inputValues.submissionId },
		actorId,
		individualHooks: true,
	}).then(() => filteredValues);
};

export const destroySubmission = (inputValues, actorId = null) =>
	Submission.destroy({
		where: {
			id: inputValues.submissionId,
			pubId: inputValues.pubId,
		},
		actorId,
		individualHooks: true,
	});
