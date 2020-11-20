import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit';

import { Icon } from 'components';

require('./collectionsBarButton.scss');

type Props = {
	children: React.ReactNode;
	className?: string;
	href?: string;
	icon?: string;
	onClick?: (...args: any[]) => any;
	rightIcon?: string;
};

const defaultProps = {
	className: '',
	href: null,
	icon: null,
	onClick: null,
	rightIcon: null,
};

const CollectionsBarButton = React.forwardRef<any, Props>((props, ref) => {
	const { children, className, href, icon, onClick, rightIcon, ...restProps } = props;
	return (
		// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
		<Button
			{...restProps}
			onClick={onClick}
			href={href}
			className={classNames('collections-bar-button-component', className)}
			ref={ref}
			tabIndex="0"
		>
			{icon && (
				<span className="left-icon-container">
					<Icon icon={icon} iconSize={14} />
				</span>
			)}
			{children}
			{rightIcon && (
				<span className="right-icon-container">
					<Icon icon={rightIcon} iconSize={14} />
				</span>
			)}
		</Button>
	);
});
// @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; href: null; icon: null;... Remove this comment to see the full error message
CollectionsBarButton.defaultProps = defaultProps;
export default CollectionsBarButton;
