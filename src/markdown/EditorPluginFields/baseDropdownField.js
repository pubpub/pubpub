import React, {PropTypes} from 'react';
import {SimpleSelect} from 'react-selectize';
import Radium from 'radium';

let styles = {};


const DropdownProp = React.createClass({
	propTypes: {
		choices: PropTypes.array,
		selectedValue: PropTypes.object,
		saveChange: PropTypes.func,
	},
	onValueChange: function(changedValue, callback) {
		this.props.saveChange();
		callback();
	},
	focus: function() {
		let focused;
		if (Object.keys(this.props.selectedValue || {}).length === 0) {
			this.refs.select.showOptions();
			focused = true;
		} else {
			focused = false;
		}
		return focused;
	},
	value: function() {
		const val = this.refs.select.value();
		return (val) ? val.value : null;
	},
	render: function() {
		const choices = this.props.choices || [];
		// note: Key is needed here, because components may not be cleanly re-rendered between refreshes
		return (
			<SimpleSelect key={this.props.selectedValue} style={styles.select} onValueChange={this.onValueChange} ref="select" options={choices} defaultValue={this.props.selectedValue}/>
		);
	}
});

styles = {
	select: {
		minWidth: '75%',
		fontFamily: 'Courier',
		backgroundColor: 'whitesmoke',
	},
};

export default Radium(DropdownProp);
