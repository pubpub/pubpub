import { Strategy as BearerStrategy } from 'passport-http-bearer';
import type express from 'express';

import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';

import { includeUserModel, AuthToken } from '../models';

export const bearerStrategy = () => {
	return new BearerStrategy(
		{
			passReqToCallback: true,
		},
		async (
			req: express.Request,
			token: string,
			done: (error: any, user?: any, message?: string) => void,
		) => {
			if (!token) {
				return done(null, false);
			}

			if (req.user) {
				return done(null, req.user);
			}

			const authToken = await AuthToken.findOne({
				where: { token },
				include: [
					includeUserModel({
						as: 'user',
						attributes: ['isSuperAdmin'],
					}),
				],
			});

			if (!authToken) {
				return done(null, false);
			}

			const { expiresAt, user } = authToken;

			try {
				await ensureUserIsCommunityAdmin({
					hostname: req.hostname,
					user,
				});

				if (expiresAt === null) {
					return done(null, user);
				}

				if (expiresAt < new Date()) {
					return done(null, false, 'Token expired');
				}
				req.user = user;

				return done(null, user);
			} catch (e) {
				console.error(e);
				return done(null, false);
			}
		},
	);
};
