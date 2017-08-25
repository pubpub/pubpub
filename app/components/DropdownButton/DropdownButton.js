import React from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

const propTypes = {
	label: PropTypes.string,
	icon: PropTypes.string,
	isRightAligned: PropTypes.bool,
	children: PropTypes.node.isRequired,
};

const defaultProps = {
	label: undefined,
	icon: undefined,
	isRightAligned: false,
};

const DropdownButton = function(props) {
	return (
		<Popover
			content={props.children}
			interactionKind={PopoverInteractionKind.CLICK}
			position={props.isRightAligned ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT}
			popoverClassName={'pt-minimal'}
			transitionDuration={-1}
			inheritDarkTheme={false}
		>
			{props.icon
				? <button type="button" className={`pt-button ${props.icon}`} />
				: <button type="button" className="pt-button">
					{props.label}
					<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
				</button>
			}
		</Popover>
	);
};

DropdownButton.defaultProps = defaultProps;
DropdownButton.propTypes = propTypes;
export default DropdownButton;
