import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';

import {propSrc, propSize, propAlign} from './pluginProps';
export const videoOptions = {src: propSrc('image'), size: propSize, align: propAlign};


// let styles = {};
const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOf(['small', 'medium', 'large']),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		let html;

		const size = this.props.size || 'large';
		const align = this.props.align || 'full';

		const sizeOptions = {
			'small': '30%',
			'medium': '50%',
			'large': '80%'
		};

		const styleObject = {
			width: sizeOptions[size],
			height: sizeOptions[size],
			display: 'block'
		};

		if (align === 'left' || align === 'righr' ) {
			styleObject.float = align;
			styleObject.padding = '1em';
		} else if (this.props.align === 'full') {
			styleObject.margin = '0px auto';
		}


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
