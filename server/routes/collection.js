import { Op } from 'sequelize';
import React from 'react';

import app, { wrap } from 'server/server';
import Html from 'server/Html';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { getPubsForLayout } from 'server/utils/queryHelpers/layout';
import { sequelize, Collection, Page } from 'server/models';

const findCollectionByPartialId = (maybePartialId) => {
	return Collection.findOne({
		where: [
			sequelize.where(sequelize.cast(sequelize.col('Collection.id'), 'varchar'), {
				[Op.iLike]: `${maybePartialId}%`,
			}),
		],
	});
};

app.get(
	['/collection/:collectionSlug', '/:collectionSlug'],
	wrap(async (req, res, next) => {
		if (!hostIsValid(req, 'community')) {
			return next();
		}

		const { collectionSlug } = req.params;
		const initialData = await getInitialData(req);
		const { communityData } = initialData;
		const collection = communityData.collections.find((c) => c.slug === collectionSlug);

		if (collection) {
			const { pageId, layout } = collection;

			if (pageId) {
				const page = await Page.findOne({ where: { id: pageId } });
				if (page) {
					return res.redirect(`/${page.slug}`);
				}
			}

			if (layout) {
				const { blocks } = layout;
				const pubs = await getPubsForLayout({
					blocks: blocks,
					initialData: initialData,
					scopedToCollectionId: collection.id,
				});

				return renderToNodeStream(
					res,
					<Html
						chunkName="Collection"
						initialData={initialData}
						viewData={{ pubs: pubs, collection: collection }}
						headerComponents={generateMetaComponents({
							initialData: initialData,
							title: `${collection.title} · ${communityData.title}`,
							description: '',
							image: collection.avatar,
							unlisted: !collection.isPublic,
						})}
					/>,
				);
			}

			return res.redirect(`/search?q=${collection.title}`);
		}

		// Some Crossref deposits have occured with this scheme so we must continue to support it.
		const collectionByPartialId = await findCollectionByPartialId(collectionSlug);
		if (collectionByPartialId) {
			return res.redirect(`/${collectionByPartialId.slug}`);
		}

		return next();
	}),
);
