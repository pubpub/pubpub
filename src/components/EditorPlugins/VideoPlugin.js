import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';

import {src, width, height, inline, align} from './pluginProps';
export const videoOptions = {src: src('video'), width, height, inline, align};

// let styles = {};
const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,

		width: PropTypes.string,
		height: PropTypes.string,
		inline: PropTypes.string,
		align: PropTypes.string,
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		let html;

		const styleObject = {
			width: this.props.width || videoOptions.width.defaultString,
			height: this.props.height || videoOptions.height.defaultString,
			display: this.props.inline === 'true' ? 'inline-block' : 'block',
			textAlign: this.props.align || videoOptions.align.defaultString,
		};

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Could not find video asset.</ErrorMsg>;
		} else {
			html = (<video style={styleObject} controls>
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
