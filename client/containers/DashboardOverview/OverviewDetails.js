import React from 'react';
import dateFormat from 'dateformat';

import { getSchemaForKind } from 'shared/collections/schemas';
import { capitalize } from 'utils';
import { usePageContext } from 'utils/hooks';

const OverviewDetails = () => {
	const { scopeData, communityData } = usePageContext();
	const { activeTargetType, activeCollection } = scopeData.elements;
	const isCollectionView = activeTargetType === 'collection';

	if (!isCollectionView) {
		return <span>Created on {dateFormat(communityData.createdAt, 'mmmm dd, yyyy')}</span>;
	}

	const { createdAt } = activeCollection;
	const collectionSchema = getSchemaForKind(activeCollection.kind);
	const label = capitalize(collectionSchema.label.singular);
	const createdOnString = dateFormat(createdAt, 'mmmm dd, yyyy');
	return (
		<span>
			{label} • Created on {createdOnString}
		</span>
	);
};

export default OverviewDetails;
