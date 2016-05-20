import React, {PropTypes} from 'react';
import RadioField from './baseRadioField';
import ColorPicker from 'react-color';

let styles = {};

const ColorField = React.createClass({

	getInitialState() {
		return {
					colorSelections: {
						modelColor: {
							display: false,
							color: '#D4AF37',
						},
					}
		}
	},



	handleChange: function(color) {
		this.setState({colorSelections: ({modelColor: ({color: 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'})})});
	},


	propTypes: {
		selectedValue: PropTypes.string,
		saveChange: PropTypes.func,
	},
	value: function() {
		return this.state.colorSelections.modelColor.color;
	},
	render: function() {
		//const choices = ['red', 'green', 'black', 'white', 'gold'];
		//Change state and then return that state
		return (<div ref="val" style={styles.pickerWrapper} >

			<div style={styles.swatch}>
			<ColorPicker
				type="chrome"
				color={this.state.colorSelections.modelColor.color}
				display={this.state.colorSelections.modelColor.state}
				positionCSS={styles.popupPosition}
				onChange={this.handleChange}
				/>
					</div>
		</div>);


		// return (<RadioField ref="val" selectedValue={this.props.selectedValue} saveChange={this.props.saveChange} choices={choices}/>);
	}
});

export default ColorField;
