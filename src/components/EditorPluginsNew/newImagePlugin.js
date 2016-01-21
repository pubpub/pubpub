import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';
import ErrorMsg from './ErrorPlugin';
import Media from './baseMediaPlugin';

import {propSrc, propSize, propAlign, propCaption, propSrcRef} from './pluginProps';
export const imageOptions = {source: propSrc('image'), size: propSize, align: propAlign, caption: propCaption, reference: propSrcRef};

// let styles = {};

const ImagePlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOfType([React.PropTypes.oneOf(['small', 'medium', 'large']), React.PropTypes.number]),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		caption: PropTypes.string,
	},
	getInitialState: function() {
		return {};
	},
	preloader: function() {
		let result;
		result = <span>loading</span>;
		return result;
	},
	loadedImage: function() {
		return;
	},
	render: function() {
		const refName = this.props.children;
		const url = this.props.url;
		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;

		let html;

		const imgProps = {style: {width: '100%', height: '100%'}};

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Not an Image-type asset.</ErrorMsg>;
		}	else if (url) {
			html = (<Media caption={caption} size={size} align={align}>
				<ImageLoader onLoad={this.loadedImage} imgProps={imgProps} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
					{refName}
				</ImageLoader>
			</Media>
		);
		} else {
			html = <ErrorMsg>Could not find Image asset.</ErrorMsg>;
		}
		return html;
	}
});


export default Radium(ImagePlugin);
