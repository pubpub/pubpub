import { Collection, SubmissionWorkflow } from 'server/models';
import { SubmissionWorkflow as SubmissionWorkflowType } from 'types';

export const createSubmissionWorkflow = async ({
	collectionId,
	instructions,
	afterSubmittedText,
	email,
	layoutBlock,
}) => {
	return Collection.findOne({ where: { id: collectionId } }).then(() =>
		SubmissionWorkflow.create({
			collectionId,
			enabled: false,
			instructions,
			afterSubmittedText,
			email,
			layoutBlock,
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
		where: { id: inputValues.submissionWorkflowId },
	});
	return filteredValues;
};

export const destroySubmissionWorkFlow = (submissionWorkflowId, inputValues) => {
	return SubmissionWorkflow.destroy({
		where: { id: inputValues.submissionWorkflowId0 },
		individualHooks: true,
	});
};
