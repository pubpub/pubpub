import React from 'react';
// import PropTypes from 'prop-types';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

if (typeof require.ensure === 'function') {
	require('./header.scss');
}

const propTypes = {

};

const defaultProps = {

};

const Header = function() {
	return (
		<nav className="header-component">
			<div className="left">My SSR Site</div>
			<div className="right">
				<Popover
					content={
						<Menu>
							<MenuItem text="Here is a menu item! :) !" />
							<MenuDivider />
							<li>
								<a href={'/'} className="pt-menu-item pt-popover-dismiss">
									Home
								</a>
							</li>
							<li>
								<a href={'/about'} className="pt-menu-item pt-popover-dismiss">
									About
								</a>
							</li>
							<MenuItem text="Logout" />
						</Menu>
					}
					interactionKind={PopoverInteractionKind.CLICK}
					position={Position.BOTTOM_RIGHT}
					transitionDuration={-1}
					inheritDarkTheme={false}
				>
					<button className="pt-button pt-large pt-minimal">
						Login
					</button>
				</Popover>
			</div>
		</nav>
	);
};

Header.defaultProps = defaultProps;
Header.propTypes = propTypes;
export default Header;
