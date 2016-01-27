import React, {PropTypes} from 'react';
import TextField from './baseTextField';

const URLField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		return (<TextField ref="val" selectedValue={this.props.selectedValue}/>);
	}
});

export default URLField;
