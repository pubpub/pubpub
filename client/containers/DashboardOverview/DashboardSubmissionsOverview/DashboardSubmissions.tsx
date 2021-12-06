import React from 'react';
import { DashboardFrame } from 'components';
// import { Collection, Pub, UserScopeVisit } from 'types';

// import { usePageContext } from 'utils/hooks';

import SubmissionItems from './SubmissionItems';
import SubmissionWorkFlowButton from './SubmissionWorkflowButton';
import { OverviewFrame, OverviewSection } from '../helpers';

require('./dashboardSubmissions.scss');

const DashboardSubmissions = () => {
	return (
		<DashboardFrame
			className="dashboard-submissions-container"
			title="Submissions Overview"
			icon="inbox"
			controls={<SubmissionWorkFlowButton />}
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
