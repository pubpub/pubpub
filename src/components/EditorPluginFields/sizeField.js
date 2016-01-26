import React, {PropTypes} from 'react';
import RadioField from './baseRadioField';

const SizeField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const choices = ['small', 'medium', 'large', 'number'];
		return (<RadioField ref="val" selectedValue={this.props.selectedValue} choices={choices}/>);
	}
});

export default SizeField;
