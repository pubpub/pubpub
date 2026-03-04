import { Router } from 'express';

import { notify } from 'server/spamTag/notifications';
import { canManipulateSpamTags } from 'server/spamTag/permissions';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';
import { getScope } from 'server/utils/queryHelpers';
import { wrap } from 'server/wrap';

import {
	createFlag,
	getAllActiveFlags,
	getFlagById,
	getFlagsForCommunity,
	updateFlagStatus,
} from './queries';

export const router = Router();

router.post(
	'/api/userCommunityFlags',
	wrap(async (req, res) => {
		const { userId, communityId, reason, reasonText, sourceDiscussionId } = req.body;
		const flaggedById = req.user?.id;
		if (!flaggedById || !userId || !communityId || !reason) {
			return res.status(400).send({ error: 'Missing required fields' });
		}

		const scopeData = await getScope({ communityId, loginId: flaggedById });
		if (!scopeData.activePermissions.canAdmin) {
			throw new ForbiddenError();
		}

		const flag = await createFlag({
			userId,
			communityId,
			flaggedById,
			reason,
			reasonText,
			sourceDiscussionId,
		});

		notify('community-flag', {
			userId,
			userEmail: '',
			userName: '',
			userSlug: '',
			communityId,
			flaggedById,
			flagReason: reason,
			flagReasonText: reasonText,
			sourceDiscussionId,
		}).catch((err) => console.error('Failed to send community flag notification', err));

		return res.status(201).json(flag);
	}),
);

router.put(
	'/api/userCommunityFlags/:id',
	wrap(async (req, res) => {
		const { status } = req.body;
		const isSuperAdmin = await canManipulateSpamTags({ userId: req.user?.id });
		if (!isSuperAdmin) {
			throw new ForbiddenError();
		}
		const updated = await updateFlagStatus(req.params.id, status);
		if (!updated) {
			throw new NotFoundError();
		}
		return res.status(200).json(updated);
	}),
);

router.get(
	'/api/userCommunityFlags',
	wrap(async (req, res) => {
		const communityId = req.query.communityId as string | undefined;
		const userId = req.user?.id;
		if (!userId) {
			throw new ForbiddenError();
		}

		if (communityId) {
			const scopeData = await getScope({ communityId, loginId: userId });
			if (!scopeData.activePermissions.canAdmin) {
				throw new ForbiddenError();
			}
			const flags = await getFlagsForCommunity(communityId);
			return res.status(200).json(flags);
		}

		const isSuperAdmin = await canManipulateSpamTags({ userId });
		if (!isSuperAdmin) {
			throw new ForbiddenError();
		}
		const flags = await getAllActiveFlags();
		return res.status(200).json(flags);
	}),
);
