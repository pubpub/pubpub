import { wrap } from 'server/wrap';
import { Router } from 'express';
export const router = Router();
import { UserNotificationPreferences } from 'server/models';

import { updateUserNotificationPreferences } from './queries';

const unwrapRequest = (req: any) => {
	const { preferences } = req.body;
	return {
		userId: req.user?.id,
		preferences: preferences as Partial<UserNotificationPreferences>,
	};
};

router.put(
	'/api/userNotificationPreferences',
	wrap(async (req, res) => {
		const { userId, preferences } = await unwrapRequest(req);
		await updateUserNotificationPreferences({ userId, preferences });
		return res.status(200).json({});
	}),
);
