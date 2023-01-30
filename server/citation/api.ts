import zoteroClient from 'zotero-api-client';

import app from 'server/server';

import { Integration, IntegrationDataOAuth1 } from '../models';

// the parameters which can be passed to the get() method
// can be found at https://www.zotero.org/support/dev/web_api/v3/basics
app.get('/api/citations/zotero', (req, res) => {
	const userId = req.user.id;
	const { q } = req.query;
	return Integration.findOne({
		where: { name: 'zotero', userId },
		include: { model: IntegrationDataOAuth1, required: false },
	})
		.then((zoteroIntegration) => {
			if (!zoteroIntegration) {
				throw new Error('No zotero integration found');
			}
			const { integrationDataOAuth1 } = zoteroIntegration;
			if (!integrationDataOAuth1) {
				throw new Error('Zotero not authenticated');
			}
			const externalUserId = parseInt(zoteroIntegration.externalUserData.externalUserId, 10);
			const myApi = zoteroClient(integrationDataOAuth1.accessToken).library(
				'user',
				externalUserId,
			);
			return myApi.items().get({ q });
		})
		.then((items) => {
			return res.status(200).json({ items });
		});
});
