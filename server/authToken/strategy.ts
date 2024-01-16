import { Strategy as BearerStrategy } from 'passport-http-bearer';
import type express from 'express';
import { includeUserModel, AuthToken } from '../models';
import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';

export const bearerStrategy = () => {
	console.log('bearing');
	return new BearerStrategy(
		{
			passReqToCallback: true,
		},
		async (
			req: express.Request,
			token: string,
			done: (error: any, user?: any, message?: string) => void,
		) => {
			console.log('AAA');
			if (!token) {
				return done(null, false);
			}

			if (req.user) {
				return done(null, req.user);
			}

			return AuthToken.findOne({
				where: { token },
				include: [
					includeUserModel({
						as: 'user',
						attributes: ['isSuperAdmin'],
					}),
				],
			})
				.then(async (authToken) => {
					if (!authToken) {
						return done(null, false);
					}

					const { expiresAt, user } = authToken;
					console.log({ user });

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
						console.log(e);
						return done(null, false);
					}
				})
				.catch((err) => {
					console.error(err);
					return done(err);
				});
		},
	);
};
