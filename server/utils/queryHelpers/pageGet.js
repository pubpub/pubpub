import { Page } from 'server/models';

import { enrichLayoutWithPubTokens, getPubsForLayout } from './layout';

export default async ({ query, forLayoutEditor, initialData }) => {
	const pageData = await Page.findOne({
		where: {
			...query,
			communityId: initialData.communityData.id,
		},
	});

	const pubsData = await getPubsForLayout({
		blocks: pageData.layout || [],
		forLayoutEditor: forLayoutEditor,
		initialData: initialData,
	});

	return {
		...pageData.toJSON(),
		layout: enrichLayoutWithPubTokens(pageData.layout, initialData),
		pubs: pubsData,
	};
};
