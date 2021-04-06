import React, { useMemo, useState } from 'react';

import { Collection, Pub, DefinitelyHas } from 'utils/types';
import { useManyPubs } from 'client/utils/useManyPubs';

import { fuzzyMatchCollection } from 'utils/fuzzyMatch';
import { PubOverviewRow, ExpandableCollectionOverviewRow, OverviewRows } from '../overviewRows';
import OverviewSearchGroup from '../OverviewSearchGroup';

type Props = {
	collections: Collection[];
	initialPubs: DefinitelyHas<Pub, 'attributions'>[];
};

const CommunityItems = (props: Props) => {
	const { collections, initialPubs } = props;
	const [searchTerm, setSearchTerm] = useState('');

	const matchingCollections = useMemo(
		() => collections.filter((collection) => fuzzyMatchCollection(collection, searchTerm)),
		[collections, searchTerm],
	);

	const {
		currentQuery: { pubs, isLoading },
	} = useManyPubs({
		isEager: !!searchTerm,
		initialPubs,
		query: {
			term: searchTerm,
		},
	});

	const renderCollections = () => {
		return matchingCollections.map((collection) => (
			<ExpandableCollectionOverviewRow collection={collection} key={collection.id} />
		));
	};

	const renderPubs = () => {
		return pubs.map((pub) => <PubOverviewRow pub={pub} key={pub.id} />);
	};

	return (
		<>
			<OverviewSearchGroup
				isLoading={isLoading}
				placeholder="Search Pubs and Collections"
				onUpdateSearchTerm={(term) => term === '' && setSearchTerm(term)}
				onCommitSearchTerm={setSearchTerm}
			/>
			<OverviewRows>
				{renderCollections()}
				{renderPubs()}
			</OverviewRows>
		</>
	);
};

export default CommunityItems;
