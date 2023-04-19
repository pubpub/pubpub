import React from 'react';
import { AnchorButton } from '@blueprintjs/core';

import './headerArcadia.scss';
import { GlobalControls, UserNotificationsPopover } from '..';
import GlobalControlsButton from '../GlobalControls/GlobalControlsButton';

type HeaderArcadiaNavItem = {
	title: string;
	url: string;
};

type Props = {
	logoUrl: string;
	navItems: HeaderArcadiaNavItem[];
	loggedIn: boolean;
};

export default function HeaderArcadia(props: Props) {
	const notifications = props.loggedIn ? (
		<UserNotificationsPopover>
			{({ hasUnreadNotifications }) => (
				<GlobalControlsButton
					aria-label="Notifications inbox"
					mobileOrDesktop={{
						icon: hasUnreadNotifications ? 'inbox-update' : 'inbox',
					}}
				/>
			)}
		</UserNotificationsPopover>
	) : null;

	return (
		<header className="arcadia-header-component">
			<div className="container">
				<div id="logo">
					<a href="/">
						<img src={props.logoUrl} />
					</a>
				</div>
				<nav>
					<ul>
						<li>
							<AnchorButton minimal icon="search" href="/search" />
						</li>
						<li>{notifications}</li>
						{props.navItems.map((navItem) => (
							<li key={navItem.url}>
								<a href={navItem.url}>{navItem.title}</a>
							</li>
						))}
						<li>Twitter</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
