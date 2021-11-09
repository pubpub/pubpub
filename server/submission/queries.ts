import { Submission } from 'server/models';
import { Submission as SubmissionType, managerStatuses, submitterStatuses } from 'types';

const updateToStatuses = [...managerStatuses, ...submitterStatuses] as const;

type UpdateToStatus = typeof updateToStatuses;

type PatchType = Partial<SubmissionType> & { status: UpdateToStatus };

export const createSubmission = async ({ pubId }, actorId: string) =>
	Submission.create(
		{
			pubId,
			status: 'incomplete',
		},
		{ actorId },
	);

export const updateSubmission = async (patch: PatchType, actorId: string) =>
	Submission.update(
		{ status: patch.status },
		{
			where: { id: patch.id },
			individualHooks: true,
			actorId,
		},
	).then(() => patch);

export const destroySubmission = async ({ id }: { id: string }, actorId: string) =>
	Submission.destroy({
		where: { id },
		individualHooks: true,
		actorId,
	});
