import React from 'react';
import { Button, MaybeElement, IconName as BlueprintIconName } from '@blueprintjs/core';

import Icon, { IconName } from 'components/Icon/Icon';
import { Menu, MenuProps } from './Menu';

type MenuButtonProps = {
	buttonContent?: React.ReactNode;
	buttonProps?: {
		className?: string;
		fill?: boolean;
		large?: boolean;
		outlined?: boolean;
		icon?: IconName | MaybeElement;
		rightIcon?: BlueprintIconName | MaybeElement;
		minimal?: boolean;
		small?: boolean;
		loading?: boolean;
	};
	disabled?: boolean;
	children: React.ReactNode;
} & Omit<MenuProps, 'disclosure'>;

const getIconProp = (icon: IconName | MaybeElement) => {
	if (icon && typeof icon === 'string') {
		return <Icon icon={icon as any} />;
	}
	return icon;
};

export const MenuButton = (props: MenuButtonProps) => {
	const { placement, unstable_fixed, buttonContent, children, buttonProps, ...restProps } = props;

	const buttonPropsWithIcon = {
		...buttonProps,
		icon: getIconProp(props.buttonProps?.icon),
	};

	return (
		<Menu
			placement={placement}
			unstable_fixed={unstable_fixed}
			disclosure={({ ref, ...restDisclosureProps }) => (
				<Button
					children={buttonContent}
					{...buttonPropsWithIcon}
					{...restDisclosureProps}
					elementRef={ref}
				/>
			)}
			{...restProps}
		>
			{children}
		</Menu>
	);
};
