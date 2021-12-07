import React from 'react';
import { DashboardFrame } from 'components';
import { Pub } from 'types';

import { usePageContext } from 'utils/hooks';

import SubmissionItems from './SubmissionItems';
import SubmissionWorkFlowButton from './SubmissionWorkflowButton';
import { OverviewFrame, OverviewSection } from '../helpers';

require('./dashboardSubmissions.scss');

type Props = {
	initialPubs: Pub[];
	initiallyLoadedAllPubs: boolean;
};

const DashboardSubmissions = (props: Props) => {
	const { initialPubs, initiallyLoadedAllPubs } = props;
	const { scopeData } = usePageContext();
	const collection = scopeData.elements.activeCollection;

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
							initialPubs={initialPubs}
							collection={collection}
							initiallyLoadedAllPubs={initiallyLoadedAllPubs}
						/>
					</OverviewSection>
				}
				secondary={<></>}
			/>
		</DashboardFrame>
	);
};

export default DashboardSubmissions;
