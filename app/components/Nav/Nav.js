import React from 'react';
// import { Link } from 'react-router-dom';

const NavBar = function() {
	return (
		<nav className={'accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'left' }}>
							<div className="pt-navbar-heading">PubPub</div>
						</div>
						<div style={{ height: '39px', display: 'flex', alignItems: 'center', float: 'right' }}>
							<button className="accent-color pt-intent-primary pt-button pt-minimal pt-icon-user" />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
