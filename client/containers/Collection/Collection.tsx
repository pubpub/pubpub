import React from 'react';

import { Layout } from 'components';
import { LayoutPubsByBlock, CollectionLayout } from 'utils/layout';
import { Pub, Collection as CollectionType } from 'types';
import { useAnalytics } from 'utils/analytics/useAnalytics';

type Props = {
	layoutPubsByBlock: LayoutPubsByBlock<Pub>;
	layout: CollectionLayout;
	collection: CollectionType;
};

const Collection = (props: Props) => {
	const { layoutPubsByBlock, layout, collection } = props;

	const { page } = useAnalytics();

	page({
		type: 'collection',
		communityId: collection.communityId,
		title: collection.title,
		collectionId: collection.id,
		collectionTitle: collection.title,
		collectionSlug: collection.slug,
	});

	if (layout) {
		const { blocks, isNarrow } = layout;
		return (
			<Layout
				blocks={blocks}
				isNarrow={isNarrow}
				layoutPubsByBlock={layoutPubsByBlock}
				collection={collection}
			/>
		);
	}
	return null;
};

export default Collection;
