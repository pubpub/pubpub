import React, {PropTypes} from 'react';
import {SimpleSelect} from 'react-selectize';
import Radium from 'radium';

let styles = {};


const DropdownProp = React.createClass({
	propTypes: {
		choices: PropTypes.array,
		selectedValue: PropTypes.string,
	},
	onValueChange: function(changedValue, callback) {
		callback();
	},
	focus: function() {
		if (Object.keys(this.props.selectedValue || {}).length === 0) {
			this.refs.select.showOptions();
		}
	},
	value: function() {
		const val = this.refs.select.value();
		return (val) ? val.value : null;
	},
	render: function() {
		const choices = this.props.choices || [];
		return (
			<SimpleSelect style={styles.select} onValueChange={this.onValueChange} ref="select" options={choices} defaultValue={this.props.selectedValue}/>
		);
	}
});

styles = {
	select: {
		minWidth: '75%',
		fontFamily: 'Courier'
	},
};

export default Radium(DropdownProp);
