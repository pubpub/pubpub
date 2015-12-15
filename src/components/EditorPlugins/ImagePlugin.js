import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';
import ErrorMsg from './ErrorPlugin';


import {src, width, height, inline, align} from './pluginProps';
export const imageOptions = {src: src('image'), width, height, inline, align};

// let styles = {};
const ImagePlugin = React.createClass({
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
	preloader: function() {
		let result;
		result = <span>loading</span>;
		return result;
	},
	// loadedImage: function(evt) {
	loadedImage: function() {
		// this.lastURL = evt.target.src;
		// debugger;
		// this.lastURL = this.props.children;
		return;
	},
	render: function() {
		const refName = this.props.children;
		const url = this.props.url;

		const styleObject = {
			width: this.props.width || imageOptions.width.defaultString,
			height: this.props.height || imageOptions.height.defaultString,
			display: this.props.inline === 'true' ? 'inline-block' : 'block',
			textAlign: this.props.align || imageOptions.align.defaultString,
		};

		let html;

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Not an Image-type asset.</ErrorMsg>;
		}	else if (url) {
			html = (<ImageLoader onLoad={this.loadedImage} style={styleObject} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
				{refName}
			</ImageLoader>);
		} else {
			html = <ErrorMsg>Could not find Image asset.</ErrorMsg>;
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

export default Radium(ImagePlugin);
