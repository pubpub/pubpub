import React from 'react';

import { DashboardFrame, Icon, IconName } from 'components';
import { Collection, Pub, UserScopeVisit } from 'utils/types';
import { getDashUrl } from 'utils/dashboard';

import CommunityItems from './CommunityItems';

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
	const { pubs, collections, recentPubs, userScopeVisits, includesAllPubs } = overviewData;
	const recentVisits = userScopeVisits
		.sort((visitA, visitB) => {
			return visitA.createdAt > visitB.createdAt ? -1 : 1;
		})
		.map((visit) => {
			const { pubId, collectionId } = visit;
			const isPub = !!pubId;
			const pub = recentPubs.find(({ id }) => id === pubId);
			const collection = collections.find(({ id }) => id === collectionId);
			return {
				href: isPub
					? getDashUrl({ pubSlug: pub?.slug })
					: getDashUrl({ collectionSlug: collection?.slug }),
				icon: isPub ? 'pubDoc' : 'collection',
				id: visit.id,
				title: isPub ? pub?.title : collection?.title,
			};
		});
	return (
		<div className="dashboard-community-overview-container">
			<DashboardFrame title="Overview">
				<CommunityItems
					initialPubs={pubs}
					collections={collections}
					initiallyLoadedAllPubs={includesAllPubs}
				/>
			</DashboardFrame>
			<div className="dashboard-sidebar-container">
				<span className="title">recently viewed</span>
				<ol className="recent-visits-component">
					{recentVisits.map(({ id, title, icon, href }) => {
						return (
							<li key={id}>
								<Icon
									className="visit-icon"
									icon={icon as IconName}
									iconSize={12}
								/>
								<a className="visit-link" href={href}>
									{title}
								</a>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
};

export default DashboardCommunityOverview;
