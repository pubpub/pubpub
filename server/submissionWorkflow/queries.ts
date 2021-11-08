import { Collection, SubmissionWorkflow } from 'server/models';

export const createSubmissionWorkflow = async ({
	collectionId,
	enabled,
	instructions,
	afterSubmittedText,
	emailText,
	layoutBlock,
	targetEmailAddress,
}) => {
	return Collection.findOne({ where: { id: collectionId } }).then(() =>
		SubmissionWorkflow.create({
			collectionId,
			enabled,
			instructions,
			afterSubmittedText,
			emailText,
			layoutBlock,
			targetEmailAddress,
		}),
	);
};

export const updateSubmissionWorkflow = async (
	submissionWorkflowId,
	inputValues,
	updatePermissions,
) => {
	// Filter to only allow certain fields to be updated
	const filteredValues = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});

	await SubmissionWorkflow.update(filteredValues, {
		where: { id: submissionWorkflowId },
		individualHooks: true,
	});
	return filteredValues;
};

export const destroySubmissionWorkFlow = (submissionWorkflowId, inputValues) => {
	return SubmissionWorkflow.destroy({
		where: { id: inputValues.collectionId },
		individualHooks: true,
	});
};
