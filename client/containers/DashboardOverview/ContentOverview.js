import React from 'react';
import PropTypes from 'prop-types';

import { DashboardFrame } from 'components';

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

	return (
		<DashboardFrame
			className="content-overview-component"
			details={<OverviewDetails />}
			controls={<OverviewControls overviewData={overviewData} />}
		>
			<OverviewBlocks overviewData={overviewData} />
			<OverviewTable overviewData={overviewData} />
		</DashboardFrame>
	);
};

ContentOverview.propTypes = propTypes;
export default ContentOverview;
