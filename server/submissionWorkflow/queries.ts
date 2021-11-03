import { Collection, SubmissionWorkflow } from 'server/models';

export const createSubmissionWorkflow = async (
	{
		collectionId,
		enabled,
		instructions,
		afterSubmittedText,
		emailText,
		layoutBlock,
		targetEmailAddress,
		id = null,
	},
	actorId?,
) => {
	return Collection.findOne({ where: { id: collectionId } }).then(() => {
		const submissionWorkflow = {
			enabled,
			instructions,
			afterSubmittedText,
			emailText,
			layoutBlock,
			targetEmailAddress,
			// @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
			...(id && { id }),
		};
		return SubmissionWorkflow.create({ ...submissionWorkflow }, { returning: true, actorId });
	});
};

export const updateSubmissionWorkflow = async (
	submissionWorkflowId,
	inputValues,
	updatePermissions,
	actorId?,
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
		actorId,
	});
	return filteredValues;
};

export const destroySubmissionWorkFlow = (submissionWorkflowId, inputValues, actorId?) => {
	return SubmissionWorkflow.destroy({
		where: { id: inputValues.collectionId },
		individualHooks: true,
		actorId,
	});
};
