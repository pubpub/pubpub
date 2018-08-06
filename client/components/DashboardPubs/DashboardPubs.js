import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./dashboardPubs.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubsData: PropTypes.array.isRequired,
};

class DashboardPubs extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="dashboard-pubs-component">
				<h1 className="content-title">Pubs</h1>
				{this.props.pubsData.sort((foo, bar)=> {
					if (foo.title < bar.title) { return -1; }
					if (foo.title > bar.title) { return 1; }
					return 0;
				}).map((pub)=> {
					return (
						<div key={`pub-${pub.id}`}>
							{pub.title}
						</div>
					);
				})}
			</div>
		);
	}
}

DashboardPubs.propTypes = propTypes;
// DashboardPubs.defaultProps = defaultProps;
export default DashboardPubs;
