import React from 'react';
import classNames from 'classnames';
import { Button, AnchorButton } from '@blueprintjs/core';
import omit from 'lodash.omit';

import { Callback } from 'types';
import { Icon, IconName } from 'components';
import { useViewport } from 'client/utils/useViewport';

require('./mobileAwareButton.scss');

type OnClickProps = {
	href?: string;
	onClick?: Callback<any>;
};

type DisplayOptions = {
	icon?: IconName;
} & Pick<React.ComponentProps<typeof Button>, 'rightIcon' | 'text'>;

type MobileAwareProps =
	| {
			mobile: DisplayOptions;
			desktop: DisplayOptions;
	  }
	| { mobileOrDesktop: DisplayOptions };

type PartialButtonProps = Omit<React.ComponentProps<typeof Button>, 'icon' | 'text' | 'onClick'> &
	Omit<React.ComponentProps<typeof AnchorButton>, 'icon' | 'text' | 'href'>;

type Props = OnClickProps & MobileAwareProps & PartialButtonProps;

const componentPrefix = 'mobile-aware-button-component';

const MobileAwareButton = React.forwardRef((props: Props, ref: any) => {
	const { href, onClick, className, minimal = true, ...buttonProps } = props;
	const { isMobile: isMobileViewport } = useViewport();
	const elementRef = isMobileViewport !== null ? ref : null;

	const resolveDisplayOptions = (isMobileButton: boolean) => {
		if ('mobileOrDesktop' in props) {
			return props.mobileOrDesktop;
		}
		return isMobileButton ? props.mobile : props.desktop;
	};

	const resolveDisplayOptionsProps = (
		isMobileButton: boolean,
		iconProps?: React.ComponentProps<typeof Icon>,
	) => {
		const { icon, ...rest } = resolveDisplayOptions(isMobileButton);
		const iconElement = icon ? <Icon {...iconProps} icon={icon} /> : null;
		return { ...rest, icon: iconElement };
	};

	const renderMobileOrDesktopButton = (isMobileButton: boolean) => {
		if (isMobileViewport !== null && isMobileViewport !== isMobileButton) {
			console.log('bailing', { isMobileViewport, isMobileButton });
			return null;
		}
		const sharedProps = {
			...omit(buttonProps, 'mobile', 'desktop', 'mobileOrDesktop'),
			...resolveDisplayOptionsProps(isMobileButton),
			minimal,
			elementRef,
			key: `is-mobile-${isMobileButton}`,
			large: !isMobileButton,
			className: classNames(
				className,
				isMobileButton
					? `${componentPrefix}__mobile-button`
					: `${componentPrefix}__desktop-button`,
			),
		};
		if (href) {
			return <AnchorButton href={href} {...sharedProps} />;
		}
		return <Button onClick={onClick} {...sharedProps} />;
	};

	return (
		<>
			{renderMobileOrDesktopButton(true)}
			{renderMobileOrDesktopButton(false)}
		</>
	);
});

export default MobileAwareButton;
