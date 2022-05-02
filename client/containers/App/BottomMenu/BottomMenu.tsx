import React from 'react';
import classNames from 'classnames';
import Color from 'color';
import { Icon, MenuButton, MenuItem } from 'components';
import { usePageContext } from 'utils/hooks';
import { getDashUrl, getDashboardModes } from 'utils/dashboard';
import ScopePicker from '../SideMenu/ScopePicker';

require('./bottomMenu.scss');

type Props = {
	isMobile?: boolean;
};

const BottomMenu = ({ isMobile }: Props) => {
	const { locationData, communityData, scopeData } = usePageContext();
	const { activePermissions, elements } = scopeData;
	const { canManage } = activePermissions;
	const { activeTargetType, activeCollection } = elements;
	const collectionSlug = activeCollection && activeCollection.slug;
	const pubSlug = locationData.params.pubSlug;

	const backgroundColor = Color(communityData.accentColorDark).fade(0.95).rgb().string();

	const contentItems = [
		{
			title: 'Overview',
			icon: 'home2' as const,
			href: getDashUrl({ collectionSlug, pubSlug }),
		},
		{
			title: 'Pages',
			icon: 'page-layout' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'pages',
			}),
			validScopes: ['community'],
			manageRequired: true,
		},
		{
			title: 'Layout',
			icon: 'page-layout' as const,
			href: getDashUrl({
				collectionSlug,
				mode: 'layout',
			}),
			manageRequired: true,
			validScopes: ['collection'],
		},
		{
			title: 'Reviews',
			icon: 'social-media' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'reviews',
			}),
		},
		{
			title: 'Connections',
			icon: 'layout-auto' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'connections',
			}),
			validScopes: ['pub'],
		},
		{
			title: 'Impact',
			icon: 'dashboard' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'impact',
			}),
			validScopes: ['pub', 'community'],
		},
		{
			title: 'Members',
			icon: 'people' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'members',
			}),
			manageRequired: true,
		},
		{
			title: 'Settings',
			icon: 'cog' as const,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'settings',
			}),
			manageRequired: true,
		},
	];

	return (
		<div className="bottom-menu-component">
			<style
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{
					__html: `
						.bottom-menu-component { background: ${communityData.accentColorDark} }
					`,
				}}
			/>

			<div className="content">
				<ScopePicker isMobile={isMobile} />
				<div className="mode-menu-component">
					<MenuButton
						aria-label="Dashboard Mode"
						buttonContent={
							<div className="current-mode">
								{getDashboardModes(locationData).mode}
							</div>
						}
						buttonProps={{
							className: 'mode-button',
							fill: true,
							minimal: true,
							rightIcon: 'caret-down',
						}}
						className="mode-menu"
						positionFixed={true}
					>
						<div className="mode-dropdown-component">
							<style
								/* eslint-disable-next-line react/no-danger */
								dangerouslySetInnerHTML={{
									__html: `
										.mode-dropdown-component { background: ${backgroundColor}; border-top: 2px solid ${communityData.accentColorDark} }
									`,
								}}
							/>
							{contentItems
								.filter((item) => {
									const { validScopes, manageRequired } = item;
									const scopeIsValid =
										!validScopes || validScopes.includes(activeTargetType);
									const permissionIsValid = canManage || !manageRequired;
									return scopeIsValid && permissionIsValid;
								})
								.map((item) => {
									const { mode } = getDashboardModes(locationData);
									const itemMode = item.title.toLowerCase().replace(/ /gi, '-');
									const active = mode === itemMode;
									return (
										<MenuItem
											href={item.href}
											key={item.title}
											text={
												<div
													key={item.title}
													className={classNames({ menu: true, active })}
												>
													<div className="side-icon"><Icon icon={item.icon} /></div>
													<div className="side-text">{item.title}</div>
												</div>
											}
										/>
									);
								})}
						</div>
					</MenuButton>
				</div>
			</div>
		</div>
	);
};

export default BottomMenu;
