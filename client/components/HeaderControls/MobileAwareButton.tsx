import React, { useState, useEffect } from 'react';
import { Button, AnchorButton } from '@blueprintjs/core';
import classNames from 'classnames';
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
	const { isMobile: isMobileViewport } = useViewport({ withEarlyMeasurement: true });
	const [isFirstMount, setIsFirstMount] = useState(true);

	useEffect(() => setIsFirstMount(false), []);

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
		const matchesViewportSize = isMobileViewport === isMobileButton;
		// During server-side rendering, isFirstMount is true, so we unconditionally render
		// both the mobile and the desktop versions of the button, and rely on CSS to show only the
		// correct one. During the first client render, we already know what viewport size we have,
		// but we still need to render both buttons because React insists that the first client
		// render match the server render exactly. After that, we can stop rendering one button.
		if (!isFirstMount && !matchesViewportSize) {
			return null;
		}
		const sharedProps = {
			...omit(buttonProps, 'mobile', 'desktop', 'mobileOrDesktop'),
			...resolveDisplayOptionsProps(isMobileButton),
			minimal,
			// We need to be careful to wire this ref into only the button we plan to show, because
			// it'll be used to position popovers for menus and the like.
			elementRef: matchesViewportSize ? ref : null,
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
