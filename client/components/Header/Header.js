import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider, Button } from '@blueprintjs/core';
import { getResizedUrl } from 'utilities';

if (typeof require.ensure === 'function') {
	require('./header.scss');
}

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

	onLogout: PropTypes.func.isRequired,
	isBasePubPub: PropTypes.bool,
	isLandingPage: PropTypes.bool,

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
	isBasePubPub: false,
	isLandingPage: false,
};

const Header = function(props) {
	const loggedIn = !!props.userSlug;
	const showGradient = props.isLandingPage && !!props.largeHeaderBackground;
	const backgroundStyle = {};
	if (showGradient) {
		const resizedBackground = getResizedUrl(props.largeHeaderBackground, 'fit-in', '1500x600');
		backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
	}
	if (props.isBasePubPub && !props.isLandingPage) {
		backgroundStyle.boxShadow = '0 0 0 1px rgba(16, 22, 26, 0.1), 0 0 0 rgba(16, 22, 26, 0), 0 1px 1px rgba(16, 22, 26, 0.2)';
	}

	const resizedSmallHeaderLogo = getResizedUrl(props.smallHeaderLogo, 'fit-in', '0x50');
	const resizedLargeHeaderLogo = getResizedUrl(props.largeHeaderLogo, 'fit-in', '0x200');
	const useAccentsString = props.isBasePubPub ? '' : 'accent-background accent-color';
	return (
		<nav className={`header-component ${useAccentsString} ${props.largeHeaderBackground && props.isLandingPage ? 'has-image' : ''}`} style={backgroundStyle} >
			<div className={showGradient ? 'header-gradient' : ''}>
				<div className="container">
					<div className="row">
						<div className="col-12">

							{/* App Logo - do not show on homepage */}
							{!props.isLandingPage &&
								<div className="headerItems headerItemsLeft">
									<a href="/">
										<img alt="header logo" className="headerLogo" src={resizedSmallHeaderLogo} />
									</a>
								</div>
							}

							<div className="headerItems headerItemsRight">

								{/* Search button */}
								<a href="/search" role="button" tabIndex="0" className="pt-button pt-large pt-minimal pt-icon-search" />

								{/* Dashboard panel button */}
								{props.userIsAdmin &&
									<a href="/dashboard" className="pt-button pt-large pt-minimal pt-icon-page-layout" />
								}

								{/* User avatar and menu */}
								{loggedIn &&
									<Popover
										content={
											<Menu>
												<li>
													<a href={`/user/${props.userSlug}`} className="pt-menu-item pt-popover-dismiss">
														<div>{props.userName}</div>
														<div className="subtext">View Profile</div>
													</a>
												</li>
												<MenuDivider />
												{!props.isBasePubPub &&
													<li>
														<a href="/pub/create" className="pt-menu-item pt-popover-dismiss">
															Create New Pub
														</a>
													</li>
												}
												<MenuItem text="Logout" onClick={props.onLogout} />
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
									<a href="/login" className="pt-button pt-large pt-minimal">Login or Signup</a>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			{props.isLandingPage &&
				<div className="community-header">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<img alt="community logo" className="logo" src={resizedLargeHeaderLogo} />
								<div className="description">{props.largeHeaderDescription}</div>
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
