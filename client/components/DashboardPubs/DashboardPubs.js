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
						<div key={`pub-${pub.id}`} className="pub-wrapper">
							<div className="title">
								<a href={`/pub/${pub.slug}`}>{pub.title}</a>
							</div>
							<div>
								{pub.pubTags.map((pubTag)=> {
									return <span className="pt-tag pt-minimal pt-small">{pubTag.tag.title}</span>;
								})}
							</div>
							<div>{pub.versions.length} versions ·</div>
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
