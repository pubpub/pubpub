import React, {PropTypes} from 'react';
import RadioField from './baseRadioField';

const SizeField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string,
		saveChange: PropTypes.func,
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const choices = ['small', 'medium', 'large', 'number'];
		return (<RadioField ref="val" selectedValue={this.props.selectedValue} saveChange={this.props.saveChange} choices={choices}/>);
	}
});

export default SizeField;
