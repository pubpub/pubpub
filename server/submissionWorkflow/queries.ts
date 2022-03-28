import { SubmissionWorkflow } from 'server/models';
import { OmitSequelizeProvidedFields } from 'types/util';
import * as types from 'types';

type CreateFields = OmitSequelizeProvidedFields<types.SubmissionWorkflow>;
type UpdateFields = Partial<CreateFields>;

export const createSubmissionWorkflow = async (props: CreateFields) => {
	const {
		collectionId,
		enabled,
		introText,
		instructionsText,
		thanksEmailText,
		title,
		targetEmailAddress,
		congratulationsEmailText,
		condolencesEmailText,
	} = props;
	const submissionWorkflow = {
		enabled,
		instructionsText,
		thanksEmailText,
		introText,
		title,
		targetEmailAddress,
		collectionId,
		congratulationsEmailText,
		condolencesEmailText,
	};
	return SubmissionWorkflow.create(submissionWorkflow);
};

export const updateSubmissionWorkflow = async (update: UpdateFields) => {
	const {
		collectionId,
		enabled,
		instructionsText,
		thanksEmailText,
		introText,
		title,
		targetEmailAddress,
		congratulationsEmailText,
		condolencesEmailText,
	} = update;
	await SubmissionWorkflow.update(
		{
			enabled,
			instructionsText,
			thanksEmailText,
			targetEmailAddress,
			introText,
			title,
			congratulationsEmailText,
			condolencesEmailText,
		},
		{ where: { collectionId } },
	);
};

export const destroySubmissionWorkFlow = ({ id }: { id: string }) => {
	return SubmissionWorkflow.destroy({
		where: { id },
	});
};

export const getEnabledSubmissionWorkflowForCollection = (
	collectionId: string,
): Promise<null | types.SubmissionWorkflow> => {
	return SubmissionWorkflow.findOne({ where: { collectionId, enabled: true } });
};
