import React, { useState } from 'react';
import { Switch, Popover } from '@blueprintjs/core';

import { DashboardFrame } from 'components';
// import { Collection, Pub, UserScopeVisit } from 'types';

// import { usePageContext } from 'utils/hooks';

import SubmissionItems from './SubmissionItems';

import { OverviewFrame, OverviewSection } from '../helpers';

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

const DashboardSubmissions = () => {
	// const { overviewData } = props;
	const [workflow, setWorkflow] = useState<null | EditableSubmissionWorkflow>(null);
	const [showSwitchTooltip, setShowSwitchTooltip] = useState(false);
	// const {
	// 	communityData,
	// 	scopeData: {
	// 		activePermissions: { canManage },
	// 	},
	// } = usePageContext();

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

	// const renderSubmissions= () => {
	// 	return (
	// 	<OverviewSection title="In this Collection" icon="overview" descendTitle>
	// 	<CommunityItems
	// 		initialPubs={[]}
	// 		collections={[]}
	// 		initiallyLoadedAllPubs={false}
	// 	/>
	// </OverviewSection>
	// 	);
	// };

	return (
		<DashboardFrame
			className="dashboard-submissions-container"
			title="Submissions Overview"
			icon="inbox"
			controls={renderControls()}
		>
			<OverviewFrame
				primary={
					<OverviewSection title="In this Collection" icon="overview" descendTitle>
						<SubmissionItems
							initialPubs={[]}
							collections={[]}
							initiallyLoadedAllPubs={false}
						/>
					</OverviewSection>
				}
				secondary={<></>}
			/>
		</DashboardFrame>
	);
};

export default DashboardSubmissions;
