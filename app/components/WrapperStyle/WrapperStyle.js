import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	fixHeader: PropTypes.bool,
	hideNav: PropTypes.bool,
	hideFooter: PropTypes.bool,
};

const defaultProps = {
	fixHeader: false,
	hideNav: false,
	hideFooter: false,
};

const WrapperStyle = function(props) {
	return (
		<style>
			{props.fixHeader && `
				.header { position: fixed; width: 100%; z-index: 99; }
				.route-content { padding-top: 56px; }
			`}
			{props.hideNav && `
				.nav-bar { display: none; }
			`}
			{props.hideFooter && `
				.footer { display: none; }
			`}
		</style>
	);
};

WrapperStyle.defaultProps = defaultProps;
WrapperStyle.propTypes = propTypes;
export default WrapperStyle;
