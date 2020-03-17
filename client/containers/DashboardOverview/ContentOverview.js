import React from 'react';
import PropTypes from 'prop-types';

import { usePageContext } from 'utils/hooks';
import { DashboardFrame } from 'components';

import { useCollectionState, useCollectionPubs } from './collectionState';
import OverviewDetails from './OverviewDetails';
import OverviewControls from './OverviewControls';
import OverviewBlocks from './OverviewBlocks';
import OverviewTable from './OverviewTable';

require('./contentOverview.scss');

const propTypes = {
	overviewData: PropTypes.object.isRequired,
};

const ContentOverview = (props) => {
	const { overviewData } = props;
	const { scopeData } = usePageContext();
	const useCollectionStateObject = useCollectionState(scopeData);
	const useCollectionPubsObject = useCollectionPubs({
		scopeData: scopeData,
		overviewData: overviewData,
	});

	return (
		<DashboardFrame
			className="content-overview-component"
			details={<OverviewDetails />}
			controls={
				<OverviewControls
					overviewData={overviewData}
					useCollectionStateObject={useCollectionStateObject}
					useCollectionPubsObject={useCollectionPubsObject}
				/>
			}
		>
			<OverviewBlocks
				overviewData={overviewData}
				useCollectionPubsObject={useCollectionPubsObject}
			/>
			<OverviewTable
				overviewData={overviewData}
				useCollectionPubsObject={useCollectionPubsObject}
			/>
		</DashboardFrame>
	);
};

ContentOverview.propTypes = propTypes;
export default ContentOverview;
