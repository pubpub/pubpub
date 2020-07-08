import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { DashboardFrame, SettingsSection } from 'components';
import { usePageContext } from 'utils/hooks';

import NewEdgeEditor from './NewEdgeEditor';

require('./dashboardEdges.scss');

const propTypes = {};
const defaultProps = {};

const frameDetails = (
	<>
		Manage relationships between this Pub and others Pubs in your Community or publications
		elsewhere on the internet.
	</>
);

const DashboardEdges = (props) => {
	const { overviewData } = props;
	const {
		scopeData: {
			elements: { activePub },
		},
	} = usePageContext();
	return (
		<DashboardFrame
			className="dashboard-edges-container"
			title="Connections"
			details={frameDetails}
		>
			<NewEdgeEditor availablePubs={overviewData.pubs} usedPubIds={[activePub.id]} />
		</DashboardFrame>
	);
};

DashboardEdges.propTypes = propTypes;
DashboardEdges.defaultProps = defaultProps;
export default DashboardEdges;
