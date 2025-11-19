import { wrap } from 'server/wrap';
import { Router } from 'express';
import { ForbiddenError } from 'server/utils/errors';
import { expect } from 'utils/assert';

import { canManipulateSpamTags } from './permissions';
import { updateSpamTagForCommunity } from './queries';
import { queryCommunitiesForSpamManagement } from './communities';

export const router = Router();

router.put(
	'/api/spamTags',
	wrap(async (req, res) => {
		const { communityId, status } = req.body;
		const canUpdate = await canManipulateSpamTags({ userId: req.user?.id });
		if (!canUpdate) {
			throw new ForbiddenError();
		}
		await updateSpamTagForCommunity({ communityId, status });
		return res.status(200).send({});
	}),
);

router.post('/api/spamTags/queryCommunitiesForSpam', async (req, res) => {
	const { offset, limit, searchTerm, status, ordering } = req.body;
	const canQuery = await canManipulateSpamTags({
		userId: expect(req.user).id,
	});
	if (!canQuery) {
		throw new ForbiddenError();
	}
	const queryResult = await queryCommunitiesForSpamManagement({
		offset: offset && parseInt(offset, 10),
		limit: limit && parseInt(limit, 10),
		ordering,
		searchTerm,
		status,
	});
	return res.status(200).send(queryResult);
});
