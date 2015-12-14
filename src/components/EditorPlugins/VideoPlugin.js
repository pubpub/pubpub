import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';

import {src, width, height, align} from './pluginProps';

export const videoOptions = {src: src('video'), width, height, align};

// let styles = {};
const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		let html;

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Could not find video asset.</ErrorMsg>;
		} else {
			html = (<video width="100%" controls>
								<source src={this.props.url} type="video/mp4"/>
							</video>);
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
