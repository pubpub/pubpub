import React, { useState } from 'react';
import { Spinner } from '@blueprintjs/core';

import { useInfiniteScroll } from 'client/utils/useInfiniteScroll';
import { OverviewSearchGroup } from 'client/containers/DashboardOverview/helpers';

import { filters } from './filters';
import { CommunityWithSpam } from './types';
import { useSpamCommunities } from './useSpamCommunities';
import CommunitySpamEntry from './CommunitySpamEntry';

require('./communitySpam.scss');

type Props = {
	communities: CommunityWithSpam[];
};

const CommunitySpam = (props: Props) => {
	const { communities: initialCommunities } = props;
	const [filter, setFilter] = useState(filters[0]);
	const [searchTerm, setSearchTerm] = useState('');

	const { communities, isLoading, loadMoreCommunities, mayLoadMoreCommunities } =
		useSpamCommunities({
			limit: 50,
			searchTerm,
			initialCommunities,
			filter,
		});

	useInfiniteScroll({
		scrollTolerance: 0,
		useDocumentElement: true,
		onRequestMoreItems: loadMoreCommunities,
		enabled: mayLoadMoreCommunities,
	});

	return (
		<div className="community-spam-component">
			<OverviewSearchGroup
				filters={filters}
				placeholder="Search for Communities..."
				onUpdateSearchTerm={(t) => t === '' && setSearchTerm(t)}
				onCommitSearchTerm={setSearchTerm}
				onChooseFilter={setFilter}
				filter={filter}
				rightControls={isLoading && <Spinner size={20} />}
			/>
			<div className="communities">
				{communities.map((community) => (
					<CommunitySpamEntry community={community} key={community.id} />
				))}
			</div>
		</div>
	);
};

export default CommunitySpam;
