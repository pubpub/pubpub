import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

import { Icon } from 'components';

export type FormattingItem = {
	ariaTitle?: string;
	title: string;
	isToggle?: string;
	icon: string;
};

export type FormattingBarButtonProps = {
	accentColor: string;
	formattingItem: FormattingItem;
	disabled?: boolean;
	isActive?: boolean;
	isDetached?: boolean;
	isIndicated?: boolean;
	isOpen?: boolean;
	isSmall?: boolean;
	label: string;
	onClick: (formattingItem: FormattingItem) => unknown;
	outerRef: React.RefObject<any>;
	PopoverComponent?: React.ComponentType<{ pubData: any }>;
	pubData: any;
};

const getOuterStyle = (accentColor, isOpen, isDetached) => {
	if (isOpen && !isDetached) {
		return {
			color: 'white',
			background: accentColor,
		};
	}
	return {};
};

const getInnerStyle = (accentColor, isOpen, isDetached) => {
	if (isOpen && isDetached) {
		return {
			background: accentColor,
		};
	}
	return {};
};

const getIndicatorStyle = (accentColor) => {
	return {
		background: accentColor,
	};
};

const FormattingBarButton = React.forwardRef<unknown, FormattingBarButtonProps>((props, ref) => {
	const {
		disabled = false,
		formattingItem,
		isActive = false,
		isIndicated = false,
		isDetached = false,
		isOpen = false,
		isSmall = false,
		label = null,
		onClick,
		accentColor = 'white',
		outerRef,
		PopoverComponent,
		pubData,
		...restProps
	} = props;

	let button = (
		/* @ts-expect-error ts-migrate(2769) FIXME: Type 'unknown' is not assignable to type 'HTMLButt... Remove this comment to see the full error message */
		<Button
			ref={ref}
			{...restProps}
			role="button"
			disabled={disabled}
			focusable
			title={formattingItem.title}
			aria-label={formattingItem.ariaTitle || formattingItem.title}
			aria-pressed={formattingItem.isToggle ? isActive : undefined}
			className={classNames(
				'bp3-button',
				'bp3-minimal',
				isActive && 'bp3-active',
				isSmall && 'bp3-small',
				disabled && 'bp3-disabled',
			)}
			style={getInnerStyle(accentColor, isOpen, isDetached)}
			onClick={() => onClick(formattingItem)}
		>
			<Icon icon={formattingItem.icon} iconSize={isSmall ? 12 : 16} />
			{label}
		</Button>
	);

	if (PopoverComponent) {
		button = (
			<Popover
				content={<PopoverComponent pubData={pubData} />}
				position={Position.BOTTOM}
				modifiers={{ preventOverflow: { enabled: false }, flip: { enabled: false } }}
				openOnTargetFocus={true}
				interactionKind={PopoverInteractionKind.HOVER}
			>
				{button}
			</Popover>
		);
	}

	return (
		<span
			ref={outerRef}
			className={classNames(
				'formatting-bar-button',
				isOpen && 'open',
				isDetached && 'detached',
				!!label && 'has-label',
			)}
			style={getOuterStyle(accentColor, isOpen, isDetached)}
		>
			{button}
			{isIndicated && <div className="indicator" style={getIndicatorStyle(accentColor)} />}
		</span>
	);
});

export default FormattingBarButton;
