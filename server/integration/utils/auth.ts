import passportOAuth1 from 'passport-oauth1';

import { User, Integration, IntegrationDataOAuth1 } from 'server/models';

export const zoteroAuthStrategy = () =>
	new passportOAuth1.Strategy(
		{
			requestTokenURL: 'https://www.zotero.org/oauth/request',
			accessTokenURL: 'https://www.zotero.org/oauth/access',
			userAuthorizationURL: 'https://www.zotero.org/oauth/authorize',
			consumerKey: process.env.ZOTERO_CLIENT_KEY,
			consumerSecret: process.env.ZOTERO_CLIENT_SECRET,
			callbackURL: 'http://lvh.me:9876/auth/zotero/redirect',
			signatureMethod: 'HMAC-SHA1',
			passReqToCallback: true,
		},
		(req, token, tokenSecret, params, profile, cb) => {
			const userId = req.user.id;
			const { username: externalUsername, userID: externalUserId } = params;
			const externalUserData = {
				externalUserId,
				externalUsername,
			};
			const integrationDataOAuth1 = {
				userId,
				accessToken: token,
			};
			return User.findOne({
				where: { id: userId },
				include: {
					model: Integration,
					where: { name: 'zotero' },
					required: false,
					include: { model: IntegrationDataOAuth1, required: false },
				},
			})
				.then((user) => {
					if (!user.integrations.length) {
						return user.createIntegration({
							name: 'zotero',
							authSchemeName: 'OAuth1',
							externalUserData,
							integrationDataOAuth1,
						});
					}
					const integration = user.integrations[0];
					return integration
						.getIntegrationDataOAuth1()
						.then((oldData) => {
							if (!oldData) {
								return integration.createIntegrationDataOAuth1(
									integrationDataOAuth1,
								);
							}
							return oldData.update(integrationDataOAuth1);
						})
						.then(() => integration);
				})
				.then(() => {
					cb(null, req.user);
				})
				.catch((err) => cb(err));
		},
	);
