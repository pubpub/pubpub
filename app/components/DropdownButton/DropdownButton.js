import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

let styles;

export const DropdownButton = React.createClass({
	propTypes: {
		content: PropTypes.node,
		title: PropTypes.node,
		position: PropTypes.number,
		style: PropTypes.object,
	},

	render: function() {
		let position;
		if (this.props.position === 0) { position = Position.BOTTOM_LEFT; }
		if (this.props.position === 1) { position = Position.BOTTOM; }
		if (this.props.position === 2) { position = Position.BOTTOM_RIGHT; }
		const propsStyle = this.props.style || {};
		console.log(propsStyle);
		return (
			<Popover 
				content={this.props.content}
				popoverClassName={'pt-minimal'}
				interactionKind={PopoverInteractionKind.CLICK}
				position={position}
				transitionDuration={200}
				inheritDarkTheme={false}
			>
				<button className="pt-button pt-minimal" style={[styles.button, propsStyle]}>{this.props.title}<span className="pt-icon-standard pt-icon-caret-down pt-align-right" /></button>
			</Popover>
		);
	}
});

export default Radium(DropdownButton);

styles = {
	button: {
		whiteSpace: 'nowrap',
	},
};
