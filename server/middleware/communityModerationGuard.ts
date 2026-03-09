import type { NextFunction, Request, Response } from 'express';

import { isUserReportedInCommunity } from 'server/communityModerationReport/queries';
import { findCommunityByHostname } from 'utils/ensureUserIsCommunityAdmin';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);

const EXEMPT_PATHS = new Set([
	'/api/login',
	'/api/logout',
	'/api/password-reset',
	'/api/signup',
	'/api/health',
]);

const isExempt = (path: string) => {
	if (EXEMPT_PATHS.has(path)) return true;
	// community moderation endpoints must remain accessible so admins can retract flags
	if (path.startsWith('/api/communityModerationReports')) return true;
	// superadmin spam management must not be blocked
	if (path.startsWith('/api/spamTags')) return true;
	// read-like POSTs that don't mutate community content
	if (path === '/api/activityItems') return true;
	if (path === '/api/pubs/many') return true;
	if (path === '/api/analytics/track') return true;
	if (path === '/api/subscribe') return true;
	return false;
};

export const communityModerationGuard = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!MUTATING_METHODS.has(req.method)) return next();
		if (!req.path.startsWith('/api')) return next();
		if (isExempt(req.path)) return next();

		const userId = req.user?.id;
		if (!userId) return next();

		const community = await findCommunityByHostname(req.hostname).catch(() => null);
		if (!community) return next();

		const reported = await isUserReportedInCommunity(userId, community.id);
		if (!reported) return next();

		return res.status(403).json({
			error: 'communityBanned',
			message:
				'You have been banned by the administrators of this community and cannot perform this action.',
		});
	};
};
