import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const propTypes = {
	exact: PropTypes.bool,
	path: PropTypes.string.isRequired,
	component: PropTypes.func.isRequired,

	fixHeader: PropTypes.bool,
	hideNav: PropTypes.bool,
};

const defaultProps = {
	exact: false,
	fixHeader: false,
	hideNav: false,
};

const WrappedRoute = function(props) {
	return (
		<div>
			<style>
				{props.fixHeader && `
					.header { position: fixed; width: 100%; z-index: 99; }
					.route-content { padding-top: 56px; }
				`}
				{props.hideNav && `
					.nav-bar { display: none; }
				`}
			</style>

			<div className={'route-content'}>
				<Route exact={props.exact} path={props.path} component={props.component} />
			</div>

		</div>
	);
};

WrappedRoute.defaultProps = defaultProps;
WrappedRoute.propTypes = propTypes;
export default WrappedRoute;
