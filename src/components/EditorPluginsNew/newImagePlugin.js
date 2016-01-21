import React, {PropTypes} from 'react';
import ImageLoader from 'react-imageloader';
import Media from './baseMediaPlugin';
import {propSrc, propSize, propAlign, propCaption, propSrcRef} from './pluginProps';


import createPubPubPlugin from './PubPub';

const ImageProps = {
	source: {name: 'source', params: 'image'}
};

const ImageOptions = {
	title: 'image',
	color: 'red',
	inline: true,
	autocomplete: true
};

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

		return (<span>THIS IS AN IAMGE {this.props.source}</span>);

		const refName = this.props.children;
		const url = this.props.url;
		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;

		let html;

		const imgProps = {style: {width: '100%', height: '100%'}};

		html = (<Media caption={caption} size={size} align={align}>
				<ImageLoader onLoad={this.loadedImage} imgProps={imgProps} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
					{refName}
				</ImageLoader>
			</Media>
		);

		return html;
	}
});


export default createPubPubPlugin(ImagePlugin, ImageOptions, ImageProps);
