import React, {PropTypes} from 'react';
import Radium from 'radium';


let styles = {};

const ErrorPlugin = React.createClass({
	propTypes: {
		children: PropTypes.string
	},
	render: function() {
		return (<span style={[styles.ref]}>[Error: {this.props.children}]</span>);
	}
});

styles = {
	ref: {
		backgroundColor: 'rgba(255,0,0,0.25)'
	}
};


export default Radium(ErrorPlugin);
