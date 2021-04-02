import React from 'react';
import { Button } from '@blueprintjs/core';

import { Icon } from 'client/components';
import { getDashUrl } from 'utils/dashboard';
import { Collection } from 'utils/types';
import { usePageContext } from 'utils/hooks';

import { iconSize } from './constants';
import OverviewRowSkeleton from './OverviewRowSkeleton';

require('./collectionOverviewRow.scss');

type Props = {
	collection: Collection;
	isOpen?: boolean;
	onToggleOpen?: () => unknown;
};

const getPublicStateLabel = (collection: Collection) => {
	const { isPublic } = collection;
	if (isPublic) {
		return {
			label: 'Public',
			icon: 'globe' as const,
		};
	}
	return {
		label: 'Private',
		icon: 'lock2' as const,
	};
};

const CollectionOverviewRow = (props: Props) => {
	const { collection, isOpen, onToggleOpen } = props;
	const { title, slug } = collection;
	const { communityData } = usePageContext();

	const toggleButton = (
		<Button
			aria-label={isOpen ? 'collapse Collection' : 'expand Collection'}
			onClick={onToggleOpen}
			minimal
			icon={
				<Icon
					iconSize={iconSize}
					icon={isOpen ? 'collapse-all' : 'expand-all'}
					color={communityData.accentColorDark}
				/>
			}
		/>
	);

	return (
		<OverviewRowSkeleton
			onClick={onToggleOpen}
			className="collection-overview-row-component"
			title={title}
			leftIcon="collection"
			href={getDashUrl({ collectionSlug: slug })}
			iconLabelPairs={[getPublicStateLabel(collection)]}
			rightElement={toggleButton}
		/>
	);
};

export default CollectionOverviewRow;
