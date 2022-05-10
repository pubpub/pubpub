import React, { useState } from 'react';

import { DashboardFrame } from 'components';
import { Collection, Pub, UserScopeVisit } from 'types';
import { AnchorButton, Button } from '@blueprintjs/core';

import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { useViewport } from 'client/utils/useViewport';
import CreateCollectionDialog from '../../App/Breadcrumbs/CreateCollectionDialog';

import CommunityItems from './CommunityItems';
import {
	OverviewFrame,
	OverviewSection,
	ScopeSummaryList,
	RecentVisitList,
	QuickActions,
	QuickAction,
} from '../helpers';

type Props = {
	overviewData: {
		collections: Collection[];
		pubs: Pub[];
		includesAllPubs: boolean;
		userScopeVisits: UserScopeVisit[];
		recentPubs: Pub[];
	};
};

const quickActions: QuickAction[] = [
	{
		label: 'Edit home page',
		icon: 'page-layout',
		href: getDashUrl({ mode: 'pages', subMode: 'home' }),
	},
	{
		label: 'Edit nav bar',
		icon: 'cog',
		href: getDashUrl({ mode: 'settings', section: 'navigation' }),
	},
	{
		label: 'Edit members/roles',
		icon: 'people',
		href: getDashUrl({ mode: 'members' }),
	},
];

const DashboardCommunityOverview = (props: Props) => {
	const { overviewData } = props;
	const { pubs, recentPubs, userScopeVisits, collections, includesAllPubs } = overviewData;
	const {
		communityData,
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();

	const { viewportWidth } = useViewport();
	const isMobile = viewportWidth && viewportWidth! <= 750;
	const [newCollectionIsOpen, setNewCollectionIsOpen] = useState(false);

	const renderControls = () => {
		return (
			<React.Fragment>
				<Button icon="plus" onClick={() => setNewCollectionIsOpen(true)} outlined>
					Create Collection
				</Button>
				<CreateCollectionDialog
					isOpen={newCollectionIsOpen}
					onClose={() => {
						setNewCollectionIsOpen(false);
					}}
				/>
			</React.Fragment>
		);
	};

	return (
		<DashboardFrame title="Overview" controls={isMobile && canManage && renderControls()}>
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
					!isMobile && (
						<>
							{userScopeVisits.length > 0 && (
								<OverviewSection title="recently viewed">
									<RecentVisitList
										userScopeVisits={userScopeVisits}
										pubs={recentPubs}
										collections={collections}
									/>
								</OverviewSection>
							)}
							{canManage && (
								<OverviewSection title="Quick Actions" spaced>
									<QuickActions actions={quickActions} />
								</OverviewSection>
							)}
							<OverviewSection title="About">
								<ScopeSummaryList scope={communityData} scopeKind="community" />
							</OverviewSection>
						</>
					)
				}
			/>
		</DashboardFrame>
	);
};

export default DashboardCommunityOverview;
