import React, {PropTypes} from 'react';
import Radium from 'radium';
import ColorPicker from 'react-color';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalDesign = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	getInitialState() {
		return {
			displayColorPicker: false,
			color: '#373737',

			activeKey: undefined,
			headerBackgroundDisplay: false,
			headerTextDisplay: false,
			landingHeaderBackgroundDisplay: false,
			landingHeaderTextDisplay: false,

			headerBackgroundColor: '#373737',
			headerTextColor: '#E0E0E0',
			landingHeaderBackgroundColor: '#E0E0E0',
			landingHeaderTextColor: '#373737',
		};
	},

	handleClick: function(key) {
		return ()=> {
			const output = {};
			output[key + 'Display'] = !output[key + 'Display'];
			output.activeKey = key;
			this.setState(output);
		};
		
	},

	handleClose: function(key) {
		return ()=> {
			const output = {};
			output[key + 'Display'] = false;
			this.setState(output);
		};
		
	},

	handleChange: function(color) {
		const output = {};
		console.log(color);
		output[this.state.activeKey + 'Color'] = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		this.setState(output);
	},

	renderColorPicker: function(key) {
		return (
			<div style={styles.pickerWrapper}>
				<div style={styles.swatch} onClick={this.handleClick(key)}>
					<div style={[styles.color, {background: this.state[key + 'Color']}]}></div>
				</div>
				<ColorPicker 
					type="chrome"
					color={this.state[key + 'Color']} 
					display={this.state[key + 'Display']}
					positionCSS={styles.popupPosition}
					onChange={this.handleChange}
					onClose={this.handleClose(key)}/>
			</div>
		);
	},

	render: function() {
		return (
			<div style={styles.container}>

				{/* <div style={styles.pickerWrapper}>
									<div style={styles.swatch} onClick={this.handleClick}>
										<div style={[styles.color, this.getBackgroundColor()]}></div>
									</div>
									<ColorPicker 
										type="chrome"
										color={this.state.color} 
										display={this.state.displayColorPicker}
										positionCSS={styles.popupPosition}
										onChange={this.handleChange}
										onClose={this.handleClose}/>
								</div> */}
				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>headerBackground</div>
					{this.renderColorPicker('headerBackground')}
				</div>

				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>headerText</div>
					{this.renderColorPicker('headerText')}
				</div>

				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>landingHeaderBackground</div>
					{this.renderColorPicker('landingHeaderBackground')}
				</div>

				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>landingHeaderText</div>
					{this.renderColorPicker('landingHeaderText')}
				</div>

			</div>
		);
	}
});

export default Radium(JournalDesign);

styles = {
	header: {
		color: 'red',
	},
	swatch: {
		padding: '5px',
		background: '#fff',
		borderRadius: '1px',
		boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
		display: 'inline-block',
		cursor: 'pointer',
	},
	color: {
		width: '36px',
		height: '14px',
		borderRadius: '2px',
	},
	colorRow: {
		height: 24,
		margin: '10px 0px',
		
	},
	colorRowHeader: {
		lineHeight: '24px',
		height: 24,
		width: 200,
		float: 'left',
	},
	pickerWrapper: {
		position: 'relative',
		float: 'left',
		margin: '0px 10px',
	},
	popupPosition: {
		position: 'absolute',
		left: 45,
		top: 0,
	},
};
