import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { DashboardFrame } from 'components';

require('./dashboardEdges.scss');

const propTypes = {};
const defaultProps = {};

const frameDetails = (
	<>
		Manage relationships between this Pub and others in your Community, or elsewhere on the
		internet.
	</>
);

const DashboardEdges = (props) => {
	return (
		<DashboardFrame
			className="dashboard-edges-container"
			title="Connections"
			details={frameDetails}
		/>
	);
};

DashboardEdges.propTypes = propTypes;
DashboardEdges.defaultProps = defaultProps;
export default DashboardEdges;
