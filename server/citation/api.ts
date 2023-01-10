import zoteroClient from 'zotero-api-client';

import app from 'server/server';

import { UserLoginDataExternal, ExternalLoginProvider } from '../models';

app.post('/api/citations/zotero', (req, res) => {
	const userId = req.user.id;
	return ExternalLoginProvider.findOne({ where: { name: 'zotero' } })
		.then((zoteroProvider) => {
			if (!zoteroProvider) throw new Error('No such external login provider');
			return UserLoginDataExternal.findOne({
				where: { userId, externalLoginProviderId: zoteroProvider.id },
			});
		})
		.then((loginData) => {
			if (!loginData) throw new Error('Zotero not authenticated');
			const externalUserId = parseInt(loginData.externalUserId, 10);
			const myApi = zoteroClient(loginData.externalProviderToken).library(
				'user',
				externalUserId,
			);
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
