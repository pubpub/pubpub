import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
	appData: PropTypes.object, // Community Logo
	userData: PropTypes.object, // Whether to show login data or not
	hasBackground: PropTypes.bool, // Whether to show gradient or not
	isHome: PropTypes.bool.isRequired,
	logo: PropTypes.string.isRequired,
};

const defaultProps = {
	appData: {}, // Community Logo
	userData: {}, // Whether to show login data or not
	hasBackground: true, // Whether to show gradient or not
};

const Header = function(props) {
	return (
		<nav className={'accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'left' }}>
							<img alt={'header logo'} src={props.logo} height={'39px'} />
						</div>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'right' }}>
							<button className="pt-button pt-minimal pt-icon-search" />
							<button className="pt-button pt-minimal pt-icon-page-layout" />
							<Link to={'/about'}><button className="pt-button pt-minimal pt-icon-person" /></Link>
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
