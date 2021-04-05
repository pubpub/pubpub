import React from 'react';

import { Collection, Pub, DefinitelyHas } from 'utils/types';

import { PubOverviewRow, ExpandableCollectionOverviewRow, OverviewRows } from '../overviewRows';

type Props = {
	collections: Collection[];
	initialPubs: DefinitelyHas<Pub, 'attributions'>[];
};

const CommunityItems = (props: Props) => {
	const { collections, initialPubs: pubs } = props;

	const renderCollections = () => {
		return collections.map((collection) => (
			<ExpandableCollectionOverviewRow collection={collection} />
		));
	};

	const renderPubs = () => {
		return pubs.map((pub) => <PubOverviewRow pub={pub} />);
	};

	return (
		<OverviewRows>
			{renderCollections()}
			{renderPubs()}
		</OverviewRows>
	);
};

export default CommunityItems;
