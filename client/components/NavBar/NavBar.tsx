import React from 'react';
import PropTypes from 'prop-types';

import {
	NavbarItem,
	getNavItemsForCommunityNavigation,
	populateSocialItems,
} from 'client/utils/navigation';
import { usePageContext } from 'utils/hooks';

import { GridWrapper, Icon } from 'components';
import { Menu, MenuItem } from 'components/Menu';

require('./navBar.scss');

const propTypes = {
	previewContext: PropTypes.object,
};

const defaultProps = {
	previewContext: undefined,
};

const NavBar = function(props) {
	const { communityData } = usePageContext(props.previewContext);
	const { pages = [], collections = [], navigation = [] } = communityData;
	const navItems = getNavItemsForCommunityNavigation({
		navigation: navigation,
		pages: pages,
		collections: collections,
	});
	const socialItems = populateSocialItems(communityData);

	return (
		<nav className="nav-bar-component accent-background accent-color">
			<GridWrapper>
				<div className="scrollable-nav">
					<ul className="nav-list">
						{navItems
							.filter((x) => x)
							.map((item) => {
								if ('children' in item) {
									return (
										// @ts-expect-error
										<Menu
											aria-label={item.title}
											disclosure={
												<li className="dropdown">
													<span className="title">{item.title}</span>
													<span className="bp3-icon-standard bp3-icon-caret-down bp3-align-right" />
												</li>
											}
											className="nav-bar-popover"
											key={`nav-item-${item.id}`}
										>
											{item.children.map((subitem, index) => {
												if ('href' in subitem) {
													return (
														<MenuItem
															// eslint-disable-next-line react/no-array-index-key
															key={index}
															// @ts-expect-error
															href={subitem.href}
															icon={
																subitem.isPrivate && (
																	<Icon
																		icon="lock2"
																		iconSize={14}
																	/>
																)
															}
															rightElement={
																subitem.isExternal && (
																	<Icon
																		icon="share"
																		iconSize={14}
																	/>
																)
															}
															text={subitem.title}
														/>
													);
												}
												return null;
											})}
										</Menu>
									);
								}
								return (
									<a href={item.href} key={`nav-item-${item.id}`}>
										<li>
											{item.isPrivate && <Icon icon="lock2" iconSize={14} />}
											<span className="title">{item.title}</span>
											{item.isExternal && (
												<Icon
													icon="share"
													iconSize={11}
													className="external-icon"
												/>
											)}
										</li>
									</a>
								);
							})}
					</ul>
					{/* <div className="overflow-gradient" /> */}
				</div>
				{!!socialItems.length && (
					<ul className="social-list">
						{socialItems.map((item) => {
							return (
								<a
									href={item.url}
									key={`social-item-${item.id}`}
									aria-label={item.title}
								>
									<li>
										<Icon icon={item.icon} />
									</li>
								</a>
							);
						})}
					</ul>
				)}
			</GridWrapper>
		</nav>
	);
};

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default NavBar;
