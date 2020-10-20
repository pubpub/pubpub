import React from 'react';

import { Layout, LayoutManageNotice } from 'components/Layout';
import { Pub, Collection as CollectionType } from 'utils/types';
import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';

type Props = {
	pubs: Pub[];
	collection: CollectionType;
};

const Collection = (props: Props) => {
	const { pubs, collection } = props;
	const {
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();
	if (collection.layout) {
		const { blocks, isNarrow } = collection.layout;
		return (
			<>
				<LayoutManageNotice
					type="collection"
					isPublic={collection.isPublic}
					manageUrl={
						canManage && getDashUrl({ mode: 'layout', collectionSlug: collection.slug })
					}
				/>
				<Layout
					blocks={blocks}
					isNarrow={isNarrow}
					pubs={pubs}
					collectionId={collection.id}
				/>
			</>
		);
	}
	return null;
};

export default Collection;
