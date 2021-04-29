import React from 'react';

import { DashboardFrame } from 'components';
import { Collection, Pub, UserScopeVisit } from 'utils/types';

import { usePageContext } from 'utils/hooks';
import CommunityItems from './CommunityItems';
import { OverviewFrame, OverviewSection, ScopeSummaryList, RecentVisitList } from '../helpers';

require('./dashboardCommunityOverview.scss');

type RecentVisit = {
	title: string;
	id: string;
};

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
	const { pubs, recentPubs, userScopeVisits, collections, includesAllPubs } = overviewData;
	const { communityData } = usePageContext();

	return (
		<DashboardFrame title="Overview">
			<OverviewFrame
				primary={
					<OverviewSection title="Explore" icon="overview" descendTitle>
						<CommunityItems
							initialPubs={pubs}
							collections={collections}
							initiallyLoadedAllPubs={includesAllPubs}
						/>
					</OverviewSection>
				}
				secondary={
					<>
						<OverviewSection title="recently viewed">
							<RecentVisitList
								userScopeVisits={userScopeVisits}
								pubs={recentPubs}
								collections={collections}
							/>
						</OverviewSection>
						<OverviewSection title="about">
							<ScopeSummaryList scope={communityData} scopeKind="community" />
						</OverviewSection>
					</>
				}
			/>
		</DashboardFrame>
	);
};

export default DashboardCommunityOverview;
