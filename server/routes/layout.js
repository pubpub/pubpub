import React from 'react';

import Html from 'server/Html';
import app, { wrap } from 'server/server';
import { Page } from 'server/models';
import { NotFoundError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { getPage } from 'server/utils/queryHelpers';
import { getPubsForLayout } from 'server/utils/queryHelpers/layout';

app.get(
	['/', '/:slug'],
	wrap(async (req, res) => {
		const { slug } = req.params;
		const initialData = await getInitialData(req);
		const { communityData } = initialData;
		const { pages, collections } = communityData;

		const matchingPage = pages.find((page) => page.slug === slug);
		const matchingCollection = collections.find((collection) => collection.slug === slug);

		if (matchingPage) {
			const pageData = await getPage({
				query: { id: matchingPage.id },
				initialData: initialData,
			});

			const pageTitle = !pageData.slug
				? communityData.title
				: `${pageData.title} · ${communityData.title}`;

			return renderToNodeStream(
				res,
				<Html
					chunkName="Page"
					initialData={initialData}
					viewData={{ pageData: pageData }}
					headerComponents={generateMetaComponents({
						initialData: initialData,
						title: pageTitle,
						description: pageData.description,
						image: pageData.avatar,
						unlisted: !pageData.isPublic,
					})}
				/>,
			);
		}

		if (matchingCollection) {
			const { layout, pageId } = matchingCollection;
			if (pageId) {
				const page = await Page.findOne({ where: { id: pageId } });
				if (page) {
					res.redirect(`/${page.slug}`);
				}
			}
			if (layout && layout.blocks) {
				const pubs = await getPubsForLayout({
					blocks: layout.blocks,
					initialData: initialData,
					scopedToCollectionId: matchingCollection.id,
				});
				const pageTitle = `${matchingCollection.title} · ${communityData.title}`;
				return renderToNodeStream(
					res,
					<Html
						chunkName="Collection"
						initialData={initialData}
						viewData={{ collection: matchingCollection, pubs: pubs }}
						headerComponents={generateMetaComponents({
							initialData: initialData,
							title: pageTitle,
							description: '',
							image: matchingCollection.avatar,
							unlisted: !matchingCollection.isPublic,
						})}
					/>,
				);
			}
		}
		throw new NotFoundError();
	}),
);
