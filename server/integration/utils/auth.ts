import passportOAuth1 from 'passport-oauth1';

import { User, Integration, IntegrationDataOAuth1 } from 'server/models';
import { isDuqDuq, isDevelopment } from 'utils/environment';
import { expect } from 'utils/assert';

const baseRedirectUrl = isDuqDuq()
	? 'https://duqduq.org'
	: isDevelopment()
	? 'http://lvh.me:9876'
	: 'https://pubpub.org';

export const zoteroAuthStrategy = () =>
	new passportOAuth1.Strategy(
		{
			requestTokenURL: 'https://www.zotero.org/oauth/request',
			accessTokenURL: 'https://www.zotero.org/oauth/access',
			userAuthorizationURL: 'https://www.zotero.org/oauth/authorize',
			consumerKey: process.env.ZOTERO_CLIENT_KEY,
			consumerSecret: process.env.ZOTERO_CLIENT_SECRET,
			callbackURL: `${baseRedirectUrl}/auth/zotero/redirect`,
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
						return Integration.create({
							userId: user.id,
							name: 'zotero',
							authSchemeName: 'OAuth1',
							externalUserData,
						}).then((integration) =>
							IntegrationDataOAuth1.create({
								...integrationDataOAuth1,
								integrationId: integration.id,
							}),
						);
					}
					const integration = user.integrations[0];
					return IntegrationDataOAuth1.findOne({
						where: { integrationId: integration.id },
					})
						.then((oldData) => expect(oldData).update(integrationDataOAuth1))
						.then(() => integration);
				})
				.then(() => {
					cb(null, req.user);
				})
				.catch((err) => cb(err));
		},
	);
