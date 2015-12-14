import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';

import {src, width, height, align} from './pluginProps';

export const videoOptions = {src: src('video'), width, height, align};

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
			html = (<ErrorMsg>Could not find video!</ErrorMsg>);
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
