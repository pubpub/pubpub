import zoteroClient from 'zotero-api-client';
import Cite from 'citation-js';

import app from 'server/server';

import { ZoteroIntegration, IntegrationDataOAuth1 } from '../models';

require('@citation-js/plugin-zotero-translation-server');

// the parameters which can be passed to the get() method
// can be found at https://www.zotero.org/support/dev/web_api/v3/basics
app.get('/api/citations/zotero', (req, res) => {
	const userId = req.user?.id;
	const { q, include } = req.query;
	if (!userId) return new Error('Log in to request citations');
	return ZoteroIntegration.findOne({
		where: { userId },
		include: { model: IntegrationDataOAuth1 },
	})
		.then((zoteroIntegration) => {
			if (!zoteroIntegration) {
				throw new Error('No zotero integration found');
			}
			const { integrationDataOAuth1 } = zoteroIntegration;
			if (!integrationDataOAuth1) {
				throw new Error('Zotero not authenticated');
			}
			const zoteroId = parseInt(zoteroIntegration.zoteroUserId, 10);
			const zoteroAPI = zoteroClient(integrationDataOAuth1.accessToken).library(
				'user',
				zoteroId,
			);
			return zoteroAPI.items().get({ q, include });
		})
		.then((results) => {
			const withStructuredValue = results.raw.map((entry) => ({
				...entry,
				bibtex: new Cite(entry.data).format('bibtex'),
			}));
			return res.status(200).json({ items: withStructuredValue });
		});
});
