import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	appData: PropTypes.object.isRequired,
};

class DashboardSite extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.appData.title,
		};
	}
	render() {
		return (
			<div>
				<h1 className={'content-title'}>Site</h1>
				{this.props.appData.title}
				<p>Site settings and options here. </p>
			</div>
		);
	}
}

DashboardSite.propTypes = propTypes;
export default DashboardSite;
