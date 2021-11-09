import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { getPermissions } from './permissions';
import {
	createSubmissionWorkflow,
	updateSubmissionWorkflow,
	destroySubmissionWorkFlow,
} from './queries';

const getRequestIds = (req) => {
	const user = req.user || {};
	return {
		userId: user.id,
		communityId: req.body.communityId,
		collectionId: req.body.id || null,
	};
};

app.post(
	'/api/submissionWorkflows',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions(requestIds);
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const workflow = await createSubmissionWorkflow(req.body);
		return res.status(201).json(workflow);
	}),
);

app.put(
	'/api/submissionWorkflows',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions(requestIds);
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updateSubmissionWorkflow(
			{
				...req.body,
				submissionWorkflowId: req.body.id,
			},
			permissions.update,
		);
		return res.status(200).json(updatedValues);
	}),
);

app.delete(
	'/api/submissionWorkflows',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions(requestIds);
		if (!permissions.destroy) {
			throw new ForbiddenError();
		}
		await destroySubmissionWorkFlow({
			...req.body,
			submissionWorkflowId: req.body.id,
		});
		return res.status(200).json(req.body.id);
	}),
);
