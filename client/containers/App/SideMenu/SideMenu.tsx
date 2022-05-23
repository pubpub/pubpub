import React from 'react';
import classNames from 'classnames';
import Color from 'color';

import { Icon } from 'components';
import { usePageContext } from 'utils/hooks';

import ScopePicker from './ScopePicker';

require('./sideMenu.scss');

type Props = {
	className?: string;
};

const SideMenu = (props: Props) => {
	const { className } = props;
	const {
		communityData,
		dashboardMenu: { menuItems },
	} = usePageContext();
	const backgroundColor = Color(communityData.accentColorDark).fade(0.95).rgb().string();

	return (
		<div className={classNames('side-menu-component', className)}>
			<style
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{
					__html: `
						.menu.active:before { background: ${communityData.accentColorDark} }
						.side-menu-component { background: ${backgroundColor} }
					`,
				}}
			/>
			<ScopePicker />
			<div className="content">
				{menuItems.map((item) => {
					const { title, href, active, count, icon } = item;
					return (
						<div key={title} className={classNames({ menu: true, active })}>
							<a href={href} className="content-title">
								<Icon className="side-icon" icon={icon} />
								<span className="side-text">{title}</span>
								{count ? <div className="count">{count}</div> : null}
							</a>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SideMenu;
