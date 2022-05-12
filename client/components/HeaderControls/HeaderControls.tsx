import React from 'react';
import { Button, AnchorButton, Intent } from '@blueprintjs/core';

import { Callback, LoginData } from 'types';
import {
	Avatar,
	ScopeDropdown,
	MenuButton,
	MenuItem,
	Menu,
	UserNotificationsPopover,
} from 'components';

import { usePageContext } from 'utils/hooks';

import MobileAwareButton from './MobileAwareButton';

require('./headerControls.scss');

type Props = {
	loggedIn: boolean;
	isBasePubPub?: boolean;
};

const HeaderControls = (props: Props) => {
	const { isBasePubPub = false, loggedIn } = props;
	const {
		locationData,
		loginData,
		communityData: { hideCreatePubButton },
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();

	const renderSearch = () => {
		return (
			<MobileAwareButton
				href="/search"
				desktop={{ text: 'Search' }}
				mobile={{ icon: 'search' }}
			/>
		);
	};

	const renderDashboardMenu = () => {
		return (
			<Menu
				aria-label="Dashboard menu"
				placement="bottom-end"
				menuStyle={{ zIndex: 20 }}
				disclosure={
					<MobileAwareButton
						mobile={{ icon: 'settings' }}
						desktop={{ text: 'Dashboard', rightIcon: 'caret-down' }}
					/>
				}
			>
				<ScopeDropdown />
			</Menu>
		);
	};

	const renderNotificiations = () => {
		if (loggedIn) {
			return (
				<UserNotificationsPopover>
					{({ hasUnreadNotifications }) => (
						<MobileAwareButton
							mobileOrDesktop={{
								icon: hasUnreadNotifications ? 'inbox-update' : 'inbox',
							}}
						/>
					)}
				</UserNotificationsPopover>
			);
		}
		return null;
	};

	const renderItemsVisibleFromCommunity = () => {
		if (!isBasePubPub) {
			const canCreatePub = !hideCreatePubButton || canManage;
			return (
				<>
					{canCreatePub && (
						<MobileAwareButton
							desktop={{ text: 'Create Pub' }}
							mobile={{ icon: 'add-to-artifact' }}
						/>
					)}
					{renderSearch()}
					{renderDashboardMenu()}
					{renderNotificiations()}
				</>
			);
		}
		return null;
	};

	const renderBasePubPubLinks = () => {
		if (isBasePubPub) {
			return (
				<>
					<MobileAwareButton href="/explore" mobileOrDesktop={{ text: 'Explore' }} />
					<MobileAwareButton href="/pricing" mobileOrDesktop={{ text: 'Pricing' }} />
					<MobileAwareButton href="/about" mobileOrDesktop={{ text: 'About' }} />
					{renderSearch()}
				</>
			);
		}
		return null;
	};

	const renderUserMenuOrLogin = () => {
		if (loggedIn) {
			return (
				<MenuButton
					aria-label="User menu"
					placement="bottom-end"
					// The z-index of the PubHeaderFormatting is 19
					menuStyle={{ zIndex: 20 }}
					buttonProps={{
						minimal: true,
						large: true,
					}}
					buttonContent={
						<Avatar
							initials={loginData.initials}
							avatar={loginData.avatar}
							width={30}
						/>
					}
				>
					<MenuItem
						href={`/user/${loginData.slug}`}
						text={
							<React.Fragment>
								{loginData.fullName}
								<span className="subtext" style={{ marginLeft: 4 }}>
									View Profile
								</span>
							</React.Fragment>
						}
					/>
					<MenuItem href="/legal/settings" text="Privacy settings" />
					<MenuItem onClick={() => {}} text="Logout" />
				</MenuButton>
			);
		}
		const { path, queryString } = locationData;
		const redirectString = `?redirect=${path}${queryString.length > 1 ? queryString : ''}`;
		const loginHref = `/login${redirectString}`;
		return <MobileAwareButton href={loginHref} mobileOrDesktop={{ text: 'Login or Signup' }} />;
	};

	return (
		<div className="header-controls-component accent-color">
			{renderItemsVisibleFromCommunity()}
			{renderBasePubPubLinks()}
			{renderUserMenuOrLogin()}
		</div>
	);
};

export default HeaderControls;
