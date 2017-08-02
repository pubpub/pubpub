/* --------------------------- */
/* Stateful Component Template */
/* --------------------------- */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getData } from 'actions/app';

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	appData: PropTypes.object,
};

const defaultProps = {
	appData: {}
};

class Template extends Component {
	componentWillMount() {
		this.props.dispatch(getData());
	}

	render() {
		return (
			<div id="template-page">
				Template
				{JSON.stringify(this.props.appData)}
			</div>
		);
	}
}

Template.defaultProps = defaultProps;
Template.propTypes = propTypes;
export default connect(state => ({ appData: state.app }))(Template);
