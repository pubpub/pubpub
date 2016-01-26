import React, {PropTypes} from 'react';
import RadioField from './baseRadioField';

const AlignField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const choices = ['left', 'full', 'right'];
		return (<RadioField ref="val" selectedValue={this.props.selectedValue} choices={choices}/>);
	}
});

export default AlignField;
