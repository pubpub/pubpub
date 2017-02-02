import React, { PropTypes } from 'react';
import Radium from 'radium';
import { CirclePicker } from 'react-color'
import { EditableInput } from 'react-color/lib/components/common';

import { Popover, Position } from '@blueprintjs/core';

let styles;

export const ColorPicker = React.createClass({
	propTypes: {
		color: PropTypes.string,
		onChange: PropTypes.func,
	},

	// getInitialState() {
	// 	return {
	// 		colorSelectOpen: false,
	// 	};
	// },

	// handleClick: function() {
	// 	this.setState({ colorSelectOpen: !this.state.colorSelectOpen });
	// },
	// handleClose: function() {
	// 	this.setState({ colorSelectOpen: false });
	// },

	render: function() {
		// const colors = ['#f3f3f4', "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"];
		const colors = ['#f7b8b8', '#f7d2b8', '#f7efb8', '#deded8','#cdf7b8', '#b8f7e0', '#b8f7f7', '#b8daf7', '#b8baf7', '#cdb8f7', '#edb8f7', '#f7b8d8', '#a6aaab', '#575858', '#f3f3f4'];
		return (
			<Popover 
				content={
					<div style={styles.pickerWrapper}>
						<CirclePicker color={this.props.color} colors={colors} onChange={this.props.onChange} />		
						<EditableInput style={{ wrap: { position: 'absolute', bottom: 16, right: 14 }, input: { width: '110px', padding: '2px 5px', color: '#58585B' }, label: {} }} label="" value={this.props.color} onChange={this.props.onChange} />
					</div>
				}
				position={Position.RIGHT}>
                <div style={styles.swatch}>
					<div style={styles.color(this.props.color)} />
				</div>
            </Popover>
		);
	}
});

export default Radium(ColorPicker);

styles = {
	// container: {
	// 	position: 'relative',
	// },
	pickerWrapper: {
		padding: '1em',
	},
	color: (color)=> {
		return {
			width: '36px',
			height: '14px',
			borderRadius: '2px',
			background: color,
		};
	},
	swatch: {
		padding: '5px',
		background: '#fff',
		borderRadius: '1px',
		boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
		display: 'inline-block',
		cursor: 'pointer',
	},
	// popover: {
	// 	position: 'absolute',
	// 	zIndex: '2',
	// 	top: '35px',
	// },
	// cover: {
	// 	position: 'fixed',
	// 	top: '0px',
	// 	right: '0px',
	// 	bottom: '0px',
	// 	left: '0px',
	// },
};
