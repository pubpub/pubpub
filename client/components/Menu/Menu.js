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

const MenuContext = React.createContext(null);

export const Menu = (props) => {
	const menu = useMenuState();
	return (
		<React.Fragment>
			<RKMenuDisclosure {...menu}>Hello there!</RKMenuDisclosure>
			<RKMenu {...menu} as="ul" className="bp3-menu bp3-elevation-1">
				<MenuContext.Provider value={menu}>
					<MenuItem text="Cut" icon="cut" />
					<MenuItem text="Copy" icon="clipboard" />
					<MenuItem text="Paste" icon="duplicate" />
					<MenuItem text="Stuff" icon="cube" />
				</MenuContext.Provider>
			</RKMenu>
		</React.Fragment>
	);
};

const DisplayMenuItem = React.forwardRef((props, ref) => {
	const { text, ...restProps } = props;
	return (
		<li ref={ref} {...restProps}>
			<a className="bp3-menu-item">{text}</a>
		</li>
	);
});

export const MenuItem = React.forwardRef((props, ref) => {
	const { children, ...restProps } = props;
	const parentMenu = useContext(MenuContext);
	const subMenu = useMenuState();
	console.log(parentMenu);
	if (children) {
		return (
			<React.Fragment>
				<RKMenuDisclosure ref={ref} {...subMenu} {...parentMenu} {...restProps}>
					{(disclosureProps) => <DisplayMenuItem {...props} {...disclosureProps} />}
				</RKMenuDisclosure>
				<MenuContext.Provider value={subMenu}>
					<RKMenu {...subMenu} as="ul" className="bp3-menu bp3-elevation-1">
						{children}
					</RKMenu>
				</MenuContext.Provider>
			</React.Fragment>
		);
	}
	return (
		<RKMenuItem ref={ref} {...parentMenu} {...restProps}>
			{(menuItemProps) => <DisplayMenuItem {...props} {...menuItemProps} />}
		</RKMenuItem>
	);
});

MenuItem.propTypes = {};
