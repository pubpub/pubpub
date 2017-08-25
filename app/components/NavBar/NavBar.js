import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Popover, PopoverInteractionKind, Position, Menu } from '@blueprintjs/core';

require('./navBar.scss');

const propTypes = {
	navItems: PropTypes.array.isRequired,
};

const NavBar = function(props) {
	return (
		<nav className={'nav-bar accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<ul>
							{props.navItems.map((item)=> {
								/* Return Simple Link */
								if (!item.children) {
									return (
										<Link to={`/${item.slug}`} key={`nav-item-${item.id}`}>
											<li>{item.title}</li>
										</Link>
									);
								}
								/* Return Dropdown */
								return (
									<Popover
										content={
											<Menu>
												{item.children.map((subitem)=> {
													return (
														<Link className={'pt-menu-item pt-popover-dismiss'} to={`/${subitem.slug}`} key={`nav-item-${subitem.id}`}>
															<li>{subitem.title}</li>
														</Link>
													);
												})}
											</Menu>
										}
										popoverClassName={'pt-minimal'}
										inheritDarkTheme={false}
										position={Position.BOTTOM_LEFT}
										interactionKind={PopoverInteractionKind.HOVER}
										key={`dropdown-${item.title}`}
									>
										<a className={'dropdown'}>
											<li>
												{item.title}
												<span className={'pt-icon-standard pt-icon-caret-down pt-align-right'} />
											</li>
										</a>
									</Popover>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

NavBar.propTypes = propTypes;
export default NavBar;
