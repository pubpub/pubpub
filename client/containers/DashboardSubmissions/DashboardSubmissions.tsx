import React, { useState } from 'react';
import { Switch, Popover } from '@blueprintjs/core';

import { DashboardFrame } from 'components';
// import { Collection, Pub, UserScopeVisit } from 'types';

import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';

import CommunityItems from '../DashboardOverview/CommunityOverview/CommunityItems';

import {
	OverviewFrame,
	OverviewSection,
	ScopeSummaryList,
	// RecentVisitList,
	QuickActions,
	QuickAction,
} from '../DashboardOverview/helpers';

import { EditableSubmissionWorkflow } from './types';
// import NewSubmissionWorkflowEditor from './NewSubmissionWorkflowEditor';

require('./dashboardSubmissions.scss');

// type Props = {
// 	overviewData: {
// 		collections: Collection[];
// 		pubs: Pub[];
// 		includesAllPubs: boolean;
// 		userScopeVisits: UserScopeVisit[];
// 		recentPubs: Pub[];
// 	};
// };

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
const DashboardSubmissions = () => {
	// const { overviewData } = props;
	const [workflow, setWorkflow] = useState<null | EditableSubmissionWorkflow>(null);
	const [showSwitchTooltip, setShowSwitchTooltip] = useState(false);
	const {
		communityData,
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();

	// const handleWorkflowCreated = (w: EditableSubmissionWorkflow) => {
	// 	setWorkflow(w);
	// 	setTimeout(() => setShowSwitchTooltip(true), 500);
	// };

	const handleToggleSubmissionsEnabled = () => {
		if (workflow) {
			setWorkflow({ ...workflow, enabled: !workflow.enabled });
		}
		setShowSwitchTooltip(false);
	};

	const renderControls = () => {
		if (workflow) {
			const enabledSwitch = (
				<Switch large checked={workflow.enabled} onClick={handleToggleSubmissionsEnabled}>
					Accepting submissions
				</Switch>
			);
			if (showSwitchTooltip) {
				return (
					<Popover
						defaultIsOpen
						content={
							<div className="dashboard-submissions-container_accept-popover-content">
								<h5>Ready to accept submissions?</h5>
								When you're ready, you can enable submissions to this Collection
								here.
							</div>
						}
					>
						{enabledSwitch}
					</Popover>
				);
			}
			return enabledSwitch;
		}
		return null;
	};

	// const renderNewWorkflowEditor = () => {
	// 	return (
	// 		<ClientOnly>
	// 			<NewSubmissionWorkflowEditor onWorkflowCreated={handleWorkflowCreated} />
	// 		</ClientOnly>
	// 	);
	// };

	return (
		<DashboardFrame
			className="dashboard-submissions-container"
			title="Submissions Overview"
			icon="inbox"
			controls={renderControls()}
		>
			{/* {!workflow && renderNewWorkflowEditor()} */}
			<OverviewFrame
				primary={
					<OverviewSection title="In this Collection" icon="overview" descendTitle>
						<CommunityItems
							initialPubs={[]}
							collections={[]}
							initiallyLoadedAllPubs={false}
						/>
					</OverviewSection>
				}
				secondary={
					<>
						{/* {userScopeVisits.length > 0 && (
							<OverviewSection title="recently viewed">
								<RecentVisitList
									userScopeVisits={userScopeVisits}
									pubs={[]}
									collections={collections}
								/>
							</OverviewSection>
						)} */}
						<OverviewSection title="recently viewed">
							here be a recently poved
						</OverviewSection>
						{canManage && (
							<OverviewSection title="Quick Actions" spaced>
								<QuickActions actions={quickActions} />
								"Uh uh. I know what you're thinking. "Did he fire six shots or only
								five?" Well to tell you the truth in all this excitement I kinda
								lost track myself. But being this is a .44 Magnum, the most powerful
								handgun in the world and would blow your head clean off, you've
								gotta ask yourself one question: "Do I feel lucky?" Well, do ya,
								punk?"
							</OverviewSection>
						)}
						<OverviewSection title="About">
							<ScopeSummaryList scope={communityData} scopeKind="community" />
						</OverviewSection>
					</>
				}
			/>
		</DashboardFrame>
	);
};

export default DashboardSubmissions;
