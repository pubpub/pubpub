import zoteroClient from 'zotero-api-client';

import app from 'server/server';

import { IntegrationDataOAuth1, Integration } from '../models';

app.post('/api/citations/zotero', (req, res) => {
	const userId = req.user.id;
	return Integration.findOne({ where: { name: 'zotero' } })
		.then((zoteroIntegration) => {
			if (!zoteroIntegration) throw new Error('No zotero integration found');
			return IntegrationDataOAuth1.findOne({
				where: { userId, integrationId: zoteroIntegration.id },
			});
		})
		.then((loginData) => {
			if (!loginData) throw new Error('Zotero not authenticated');
			const externalUserId = parseInt(loginData.externalUserId, 10);
			const myApi = zoteroClient(loginData.accessToken).library('user', externalUserId);
			return myApi.items().get();
		})
		.then((items) => {
			console.log('found these citation items: ', { items }, '\n\n');
			return res.status(200).json({ items });
		})
		.catch((err) => {
			console.log('error, damnit: ', { err }, '\n\n');
		});
});
