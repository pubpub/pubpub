import React, { useContext } from 'react';
import classNames from 'classnames';
import { MenuItem as BPMenuItem, Icon } from '@blueprintjs/core';
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
	const { children, disclosure, isRoot = true } = props;
	const menu = useMenuState();
	return (
		<div className="menu-component">
			<RKMenuDisclosure {...menu}>
				{(disclosureProps) => disclosure(disclosureProps)}
			</RKMenuDisclosure>
			<RKMenu {...menu} as="ul" className="bp3-menu bp3-elevation-1">
				<MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
			</RKMenu>
		</div>
	);
};

const DisplayMenuItem = React.forwardRef((props, ref) => {
	const {
		children,
		disabled,
		icon,
		hasSubmenu,
		rightElement: propRightElement,
		...restProps
	} = props;
	const rightElement = hasSubmenu ? <Icon icon="caret-right" /> : propRightElement;
	return (
		<li {...restProps} ref={ref}>
			<a className={classNames('bp3-menu-item', disabled && 'bp3-disabled')}>
				{icon && <Icon icon={icon} />}
				<div className="bp3-text-overflow-ellipsis bp3-fill">{children}</div>
				{rightElement && <span className="bp3-menu-item-label">{rightElement}</span>}
			</a>
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
					<RKMenuItem
						as={DisplayMenuItem}
						{...dProps}
						{...parentMenu}
						{...restProps}
						hasSubmenu={true}
					>
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

export const MenuItemDivider = () => {
	return (
		<RKMenuSeparator>
			{(props) => <li className="bp3-menu-divider" {...props} />}
		</RKMenuSeparator>
	);
};
