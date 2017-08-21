import React, { Component } from 'react';
import PropTypes from 'prop-types';

// require('./dashboard.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
};

class DashboardSite extends Component {	

	render() {
		const data = this.props.appData;

		return (
			<div>

				<h1 className={'content-title'}>Site</h1>
				
				<div>Link:</div>
				<div>Description:</div>
				<div>Privacy:</div>
				<div>Submissions:</div>

				<div className="pt-button-group">
					<button type="button" className="pt-button pt-icon-globe pt-active">Public</button>
					<button type="button" className="pt-button pt-icon-lock">Private</button>
				</div>

				<div className="pt-button-group">
					<button type="button" className="pt-button pt-icon-add-to-artifact pt-active">Open</button>
					<button type="button" className="pt-button pt-icon-delete">Closed</button>
				</div>
			</div>
		);
	}
}

DashboardSite.propTypes = propTypes;
export default DashboardSite;
