import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

require('./header.scss');

const propTypes = {
	userName: PropTypes.string,
	userInitials: PropTypes.string,
	userSlug: PropTypes.string,
	userAvatar: PropTypes.string,
	userIsAdmin: PropTypes.bool,

	smallHeaderLogo: PropTypes.string,
	largeHeaderLogo: PropTypes.string,
	largeHeaderDescription: PropTypes.string,
	largeHeaderBackground: PropTypes.string,
	isLargeHeader: PropTypes.bool,

	logoutHandler: PropTypes.func.isRequired,

};

const defaultProps = {
	userName: undefined,
	userInitials: undefined,
	userSlug: undefined,
	userAvatar: undefined,
	userIsAdmin: undefined,
	smallHeaderLogo: undefined,
	largeHeaderLogo: undefined,
	largeHeaderDescription: undefined,
	largeHeaderBackground: undefined,
	isLargeHeader: false,
};

const Header = function(props) {
	const loggedIn = !!props.userSlug;
	// const isHome = props.pageSlug === '/';
	const showGradient = props.isLargeHeader && !!props.largeHeaderBackground;
	const backgroundStyle = {};
	if (showGradient) {
		backgroundStyle.backgroundImage = `url("${props.largeHeaderBackground}")`;
	}

	return (
		<nav className={`header accent-background accent-color ${props.largeHeaderBackground ? 'has-image' : ''}`} style={backgroundStyle} >
			<div className={showGradient ? 'header-gradient' : ''}>
				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>

							{/* App Logo - do not show on homepage */}
							{!props.isLargeHeader &&
								<div className={'headerItems headerItemsLeft'}>
									<Link to={'/'}>
										<img alt={'header logo'} className={'headerLogo'} src={props.smallHeaderLogo} />
									</Link>
								</div>
							}

							<div className={'headerItems headerItemsRight'}>

								{/* Search button */}
								<Link to={'/search'} className="pt-button pt-large pt-minimal pt-icon-search" />

								{/* Dashboard panel button */}
								{props.userIsAdmin &&
									<Link to={'/dashboard'} className="pt-button pt-large pt-minimal pt-icon-page-layout" />
								}

								{/* User avatar and menu */}
								{loggedIn &&
									<Popover
										content={
											<Menu>
												<li>
													<Link to={`/user/${props.userSlug}`} className="pt-menu-item pt-popover-dismiss">
														<div>{props.userName}</div>
														<div className={'subtext'}>View Profile</div>
													</Link>
												</li>
												<MenuDivider />
												<li>
													<Link to={'/pub-create'} className="pt-menu-item pt-popover-dismiss">
														Create New Pub
													</Link>
												</li>
												<li>
													<Link to={`/user/${props.userSlug}/pubs`} className="pt-menu-item pt-popover-dismiss">
														Your Pubs
													</Link>
												</li>
												<MenuDivider />
												<MenuItem text={'Logout'} onClick={props.logoutHandler} />
											</Menu>
										}
										interactionKind={PopoverInteractionKind.CLICK}
										position={Position.BOTTOM_RIGHT}
										transitionDuration={-1}
										inheritDarkTheme={false}
									>
										<button className="pt-button pt-large pt-minimal avatar-button">
											<Avatar
												userInitials={props.userInitials}
												userAvatar={props.userAvatar}
												width={30}
											/>
										</button>
									</Popover>
								}

								{/* Login or Signup button */}
								{!loggedIn &&
									<Link to={'/login'} className="pt-button pt-large pt-minimal">Login or Signup</Link>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			{props.isLargeHeader &&
				<div className={'community-header'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								{/* <img alt={'community logo'} className={'logo'} src={`https://jake.pubpub.org/unsafe/fit-in/600x300/${props.logo}`} /> */}
								<img alt={'community logo'} className={'logo'} src={props.largeHeaderLogo} />
								<div className={'description'}>{props.largeHeaderDescription}</div>
							</div>
						</div>
					</div>
				</div>
			}
		</nav>
	);
};

Header.defaultProps = defaultProps;
Header.propTypes = propTypes;
export default Header;
