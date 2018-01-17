import React from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverInteractionKind, Position, Menu } from '@blueprintjs/core';

require('./navBar.scss');

const propTypes = {
	navItems: PropTypes.array.isRequired,
	socialItems: PropTypes.array.isRequired,
};

const NavBar = function(props) {
	return (
		<nav className="nav-bar-component accent-background accent-color">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<ul className="nav-list">
							{props.navItems.filter((item)=> {
								return !!item;
							}).map((item)=> {
								/* Return Simple Link */
								if (!item.children) {
									return (
										<a href={`/${item.slug}`} key={`nav-item-${item.id}`}>
											<li>
												{!item.isPublic &&
													<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
												}
												{item.title}
											</li>
										</a>
									);
								}
								/* Return Dropdown */
								return (
									<Popover
										content={
											<Menu>
												{item.children.map((subitem)=> {
													return (
														<a href={`/${subitem.slug}`} className="pt-menu-item pt-popover-dismiss" key={`nav-item-${subitem.id}`}>
															<li>
																{!subitem.isPublic &&
																	<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
																}
																{subitem.title}
															</li>
														</a>
													);
												})}
											</Menu>
										}
										popoverClassName="pt-minimal nav-bar-popover"
										inheritDarkTheme={false}
										position={Position.BOTTOM_LEFT}
										interactionKind={PopoverInteractionKind.HOVER}
										key={`dropdown-${item.title}`}
									>
										<a className="dropdown">
											<li>
												{item.title}
												<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
											</li>
										</a>
									</Popover>
								);
							})}
						</ul>
						{!!props.socialItems.length &&
							<ul className="social-list">
								{props.socialItems.map((item)=> {
									return (
										<a href={item.url} key={`social-item-${item.id}`}>
											<li>
												<span className={`pt-icon-standard ${item.icon}`} />
											</li>
										</a>
									);
								})}
							</ul>
						}
					</div>
				</div>
			</div>
		</nav>
	);
};

NavBar.propTypes = propTypes;
export default NavBar;
