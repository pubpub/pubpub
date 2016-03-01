import React, {PropTypes} from 'react';
import TextField from './baseTextField';

const URLField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string,
		saveChange: PropTypes.func,
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		return (<TextField ref="val" saveChange={this.props.saveChange} selectedValue={this.props.selectedValue}/>);
	}
});

export default URLField;
