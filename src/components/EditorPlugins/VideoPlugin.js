import React, {PropTypes} from 'react';
import Radium from 'radium';
import {src, width, height, align} from './pluginProps';

export const videoOptions = {src, width, height, align};

// let styles = {};
const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		children: PropTypes.string
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		const video = !(this.props.url === 'error:type' || this.props.url === null);
		let html;

		if (video) {
			html = (<video width="100%" controls>
								<source src={this.props.url} type="video/mp4"/>
							</video>);
		} else {
			html = (<span>Not rendered!</span>);
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

export default Radium(VideoPlugin);
