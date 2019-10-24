import React, { useContext } from 'react';
import classNames from 'classnames';
import { MenuItem as BPMenuItem } from '@blueprintjs/core';
import {
	Menu as RKMenu,
	MenuItem as RKMenuItem,
	MenuDisclosure as RKMenuDisclosure,
	MenuSeparator as RKMenuSeparator,
	useMenuState,
} from 'reakit/Menu';

require('./menu.scss');

const MenuContext = React.createContext(null);

export const Menu = (props) => {
	const { children, disclosure } = props;
	const menu = useMenuState();
	return (
		<React.Fragment>
			<RKMenuDisclosure {...menu}>
				{(disclosureProps) => disclosure(disclosureProps)}
			</RKMenuDisclosure>
			<RKMenu {...menu} as="ul" className="bp3-menu bp3-elevation-1">
				<MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
			</RKMenu>
		</React.Fragment>
	);
};

const DisplayMenuItem = React.forwardRef((props, ref) => {
	const { children, ...restProps } = props;
	return (
		<li {...restProps} ref={ref}>
			<a className="bp3-menu-item">{children}</a>
		</li>
	);
});

export const MenuItem = React.forwardRef((props, ref) => {
	const { children, text, ...restProps } = props;
	const parentMenu = useContext(MenuContext);
	if (children) {
		return (
			<Menu
				disclosure={(dProps) => (
					<RKMenuItem as={DisplayMenuItem} {...dProps} {...parentMenu}>
						{text}
					</RKMenuItem>
				)}
			>
				{children}
			</Menu>
		);
	}
	return (
		<RKMenuItem as={DisplayMenuItem} ref={ref} {...parentMenu} {...restProps}>
			{text}
		</RKMenuItem>
	);
});

MenuItem.propTypes = {};
