/* ----------------------------- */
/* Functional Component Template */
/* ----------------------------- */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const propTypes = {
	appData: PropTypes.object,
};

const defaultProps = {
	appData: {}
};

const Template = function({ appData }) {
	return (
		<div id={'template-page'}>
			Template
			{JSON.stringify(appData)}
		</div>
	);
};

Template.defaultProps = defaultProps;
Template.propTypes = propTypes;
export default connect(state => ({ appData: state.app }))(Template);
