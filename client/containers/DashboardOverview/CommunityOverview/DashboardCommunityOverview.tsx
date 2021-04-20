import React from 'react';

import { DashboardFrame } from 'components';
import { Collection, Pub, UserScopeVisit } from 'utils/types';

import CommunityItems from './CommunityItems';

type Props = {
	overviewData: {
		collections: Collection[];
		pubs: Pub[];
		includesAllPubs: boolean;
		userScopeVisits: UserScopeVisit[];
		recentPubs: Pub[];
	};
};

const DashboardCommunityOverview = (props: Props) => {
	const { overviewData } = props;
	const { pubs, collections, includesAllPubs } = overviewData;
	return (
		<DashboardFrame title="Overview">
			<CommunityItems
				initialPubs={pubs}
				collections={collections}
				initiallyLoadedAllPubs={includesAllPubs}
			/>
		</DashboardFrame>
	);
};

export default DashboardCommunityOverview;
