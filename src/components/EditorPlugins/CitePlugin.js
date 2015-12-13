import React, {PropTypes} from 'react';
import Radium from 'radium';
import {srcRef} from './pluginProps';

export const citeOptions = {srcRef};

// let styles = {};
const CitePlugin = React.createClass({
	propTypes: {
		title: PropTypes.string,
		ref: PropTypes.string,
		children: PropTypes.string,
		count: PropTypes.number
	},
	getInitialState: function() {
		return {hover: false};
	},
	mouseOver: function() {
		console.log('set the state yoo');
		this.setState({hover: true});
	},
	mouseOut: function() {
		console.log('set the state yoo');
		this.setState({hover: false});
	},
	render: function() {
		const ref = !(this.props.title === 'error:type');
		// const title = this.props.title;
		let html;
		if (!ref) {
			html = <span>[COULD NOT FIND REFERENCE]</span>;
		}	else {
			html = (<span onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>[{this.props.count}: {this.state.hover}]</span>
				);
		}
		return html;
	}
});

/*
styles = function() {
	return {
	};
};
*/

export default Radium(CitePlugin);
