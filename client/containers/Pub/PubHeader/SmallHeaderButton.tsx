import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit';

import { Icon } from 'components';

require('./smallHeaderButton.scss');

type Props = {
	className?: string;
	disabled?: boolean;
	href?: string;
	icon: string;
	label?: string;
	labelPosition?: 'left' | 'right';
	onClick?: (...args: any[]) => any;
	tagName?: string;
};

const defaultProps = {
	className: '',
	disabled: false,
	href: null,
	label: null,
	onClick: null,
	tagName: 'button',
	labelPosition: 'left',
};

const SmallHeaderButton = React.forwardRef<any, Props>((props, ref) => {
	const { className, disabled, href, icon, label, labelPosition, onClick, tagName } = props;
	return (
		<Button
			// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
			as={tagName}
			href={href}
			ref={ref}
			onClick={onClick}
			className={classNames(
				'small-header-button-component',
				'pub-header-themed-box-hover-target',
				labelPosition === 'left' ? 'label-left' : 'label-right',
				disabled && 'disabled',
				className,
			)}
		>
			<div className="pub-header-themed-box icon-container">
				<Icon icon={icon} iconSize={14} />
			</div>
			{label && <div className="label">{label}</div>}
		</Button>
	);
});
// @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; disabled: boolean; href... Remove this comment to see the full error message
SmallHeaderButton.defaultProps = defaultProps;
export default SmallHeaderButton;
