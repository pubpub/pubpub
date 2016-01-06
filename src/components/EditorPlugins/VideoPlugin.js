import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';
import Media from './baseMediaPlugin';

import {propSrc, propSize, propAlign, propCaption} from './pluginProps';
export const videoOptions = {source: propSrc('video'), size: propSize, align: propAlign, caption: propCaption};

let styles = {};

const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		caption: PropTypes.string,
		size: React.PropTypes.oneOf(['small', 'medium', 'large']),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		let html;

		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;


		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Could not find video asset.</ErrorMsg>;
		} else {
			html = (
				<Media caption={caption} size={size} align={align}>
					<video controls style={styles.video}>
						<source src={this.props.url} type="video/mp4"/>
					</video>
				</Media>);
		}
		return html;
	}
});


styles = {
	video: {
		width: '100%',
		height: '100%'
	}
};


export default Radium(VideoPlugin);
