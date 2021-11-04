import { Submission } from 'server/models';
import { managerStatuses, submitterStatuses } from 'types';

const updateToStatuses = [...managerStatuses, ...submitterStatuses] as const;

type UpdateToStatus = typeof updateToStatuses;

export const createSubmission = async ({ pubId }) =>
	Submission.create({
		pubId,
		status: 'incomplete',
	});

export const updateSubmission = async ({
	status,
	submissionId,
}: {
	status: UpdateToStatus;
	submissionId: string;
}) =>
	Submission.update(
		{ status },
		{
			where: { id: submissionId },
		},
	);

export const destroySubmission = async ({ submissionId }: { submissionId: string }) =>
	Submission.destroy({
		where: {
			id: submissionId,
		},
	});
