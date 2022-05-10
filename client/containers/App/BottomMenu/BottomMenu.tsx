import React from 'react';
import classNames from 'classnames';
import Color from 'color';

import { Icon, MenuButton, MenuItem } from 'components';
import { usePageContext } from 'utils/hooks';
import ScopePicker from '../SideMenu/ScopePicker';

require('./bottomMenu.scss');

type Props = {
	isMobile?: boolean;
};

const BottomMenu = ({ isMobile }: Props) => {
	const {
		communityData,
		dashboardMenu: { activeMode, menuItems },
	} = usePageContext();

	const backgroundColor = Color(communityData.accentColorDark).fade(0.95).rgb().string();

	return (
		<div className="bottom-menu-component">
			<style
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{
					__html: `
						.bottom-menu-component { background: ${communityData.accentColorDark} }
						.mode-dropdown-component { background: ${backgroundColor}; border-top: 2px solid ${communityData.accentColorDark} }
					`,
				}}
			/>

			<div className="content">
				<ScopePicker isMobile={isMobile} />
				<div className="mode-menu-component">
					<MenuButton
						aria-label="Dashboard Mode"
						buttonContent={<div className="current-mode">{activeMode!.mode}</div>}
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
							{menuItems.map((item) => {
								const { active, count, href, icon, title } = item;
								return (
									<MenuItem
										href={href}
										key={title}
										text={
											<div
												key={title}
												className={classNames({ menu: true, active })}
											>
												<div className="side-icon">
													<Icon icon={icon} />
												</div>
												<div className="side-text">{title}</div>
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
