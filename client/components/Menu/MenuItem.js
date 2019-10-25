import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Classes } from '@blueprintjs/core';
import * as RK from 'reakit/Menu';

import { MenuContext } from './menuContext';
import { Menu } from './Menu';

const sharedPropTypes = {
	disabled: PropTypes.boolean,
	href: PropTypes.string,
	target: PropTypes.string,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	onClick: PropTypes.func,
	rightElement: PropTypes.node,
};

const sharedDefaultProps = {
	disabled: false,
	href: null,
	target: '_self',
	icon: null,
	onClick: null,
	rightElement: null,
};

const DisplayMenuItem = React.forwardRef((props, ref) => {
	const {
		children,
		disabled,
		href,
		target,
		icon,
		hasSubmenu,
		onClick,
		rightElement,
		...restProps
	} = props;

	const label = hasSubmenu ? <Icon icon="caret-right" /> : rightElement;

	const onClickWithHref = (evt) => {
		if (onClick) {
			onClick(evt);
		}
		if (href) {
			window.open(href, target);
		}
	};

	return (
		// The ...restProps are from Reakit and help us handle the interactions accessibly.
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<li {...restProps} ref={ref} onClick={onClickWithHref}>
			<a
				href={href}
				target={target}
				className={classNames(Classes.MENU_ITEM, disabled && Classes.DISABLED)}
			>
				{icon && (typeof icon === 'string' ? <Icon icon={icon} /> : icon)}
				<div className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, Classes.FILL)}>
					{children}
				</div>
				{label && <span className={Classes.MENU_ITEM_LABEL}>{label}</span>}
			</a>
		</li>
	);
});

DisplayMenuItem.propTypes = {
	...sharedPropTypes,
	hasSubmenu: PropTypes.bool.isRequired,
};

DisplayMenuItem.defaultProps = {
	...sharedDefaultProps,
};

export const MenuItem = React.forwardRef((props, ref) => {
	const { children, text, ...restProps } = props;
	const parentMenu = useContext(MenuContext);
	if (children) {
		return (
			<Menu
				disclosure={(dProps) => (
					<RK.MenuItem
						as={DisplayMenuItem}
						{...dProps}
						{...parentMenu}
						{...restProps}
						style={{ display: 'block', '-webkit-appearance': 'unset' }}
						hasSubmenu={true}
					>
						{text}
					</RK.MenuItem>
				)}
			>
				{children}
			</Menu>
		);
	}
	return (
		<RK.MenuItem as={DisplayMenuItem} ref={ref} {...parentMenu} {...restProps}>
			{text}
		</RK.MenuItem>
	);
});

MenuItem.propTypes = {
	...sharedPropTypes,
	children: PropTypes.arrayOf(PropTypes.node),
	text: PropTypes.string.isRequired,
};

MenuItem.defaultProps = {
	...sharedDefaultProps,
	children: null,
};

export const MenuItemDivider = () => {
	return (
		<RK.MenuSeparator>
			{(props) => <li className={Classes.MENU_DIVIDER} {...props} />}
		</RK.MenuSeparator>
	);
};
