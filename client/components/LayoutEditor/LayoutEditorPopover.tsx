// resource: https://blueprintjs.com/docs/#core/components/popover

import React from 'react';

import {
	Button,
	Classes,
	H5,
	Intent,
	Popover,
	PopoverInteractionKind,
	PopoverPosition,
	PopperBoundary,
	PopperModifiers,
} from '@blueprintjs/core';

const INTERACTION_KINDS = [{ label: 'Click', value: PopoverInteractionKind.CLICK.toString() }];

const VALID_POSITIONS: PopoverPosition[] = [
	PopoverPosition.AUTO,
	PopoverPosition.AUTO_START,
	PopoverPosition.AUTO_END,
	PopoverPosition.TOP_LEFT,
	PopoverPosition.TOP,
	PopoverPosition.TOP_RIGHT,
	PopoverPosition.RIGHT_TOP,
	PopoverPosition.RIGHT,
	PopoverPosition.RIGHT_BOTTOM,
	PopoverPosition.BOTTOM_LEFT,
	PopoverPosition.BOTTOM,
	PopoverPosition.BOTTOM_RIGHT,
	PopoverPosition.LEFT_TOP,
	PopoverPosition.LEFT,
	PopoverPosition.LEFT_BOTTOM,
];

export interface IPopoverExampleState {
	boundary?: PopperBoundary;
	canEscapeKeyClose?: boolean;
	exampleIndex?: number;
	hasBackdrop?: boolean;
	inheritDarkTheme?: boolean;
	interactionKind?: PopoverInteractionKind;
	isOpen?: boolean;
	minimal?: boolean;
	modifiers?: PopperModifiers;
	position?: PopoverPosition;
	sliderValue?: number;
	usePortal?: boolean;
}

const LayoutEditorPopover = (initialPopoverState: IPopoverExampleState) => {
	const {
		boundary = 'viewport',
		canEscapeKeyClose = true,
		exampleIndex = 0,
		hasBackdrop = false,
		inheritDarkTheme = true,
		interactionKind = PopoverInteractionKind.CLICK,
		isOpen = false,
		minimal = false,
		position = 'auto',
		sliderValue = 5,
		usePortal = true,
	} = initialPopoverState;

	const getContents = () => {
		return (
			<div key="text">
				<H5>Confirm deletion</H5>
				<p>
					Are you sure you want to delete these items? You won't be able to recover them.
				</p>
				<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
					<Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
						Cancel
					</Button>
					<Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
						Delete
					</Button>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="docs-popover-example-scroll">
				<Popover
					popoverClassName={exampleIndex <= 2 ? Classes.POPOVER_CONTENT_SIZING : ''}
					portalClassName="foo"
					enforceFocus={false}
					isOpen={isOpen}
				>
					<Button intent={Intent.PRIMARY} text="Popover target" />
					{getContents()}
				</Popover>
			</div>
		</>
	);
};

export default LayoutEditorPopover;
