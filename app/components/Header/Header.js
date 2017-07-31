import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

const propTypes = {
	appData: PropTypes.object, // Community Logo
	userData: PropTypes.object, // Whether to show login data or not
	hasBackground: PropTypes.bool, // Whether to show gradient or not
};

const defaultProps = {
	appData: {}, // Community Logo
	userData: {}, // Whether to show login data or not
	hasBackground: true, // Whether to show gradient or not
};

const Header = function() {
	return (
		<nav className={'accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'left' }}>
							<div className="pt-navbar-heading">PubPub</div>
						</div>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'right' }}>
							<button className="accent-color pt-intent-primary pt-button pt-minimal pt-icon-search" />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

Header.defaultProps = defaultProps;
Header.propTypes = propTypes;
export default Header;
