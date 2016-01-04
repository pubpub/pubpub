import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';
import ErrorMsg from './ErrorPlugin';


import {propSrc, propSize, propAlign} from './pluginProps';
export const imageOptions = {src: propSrc('image'), size: propSize, align: propAlign};


// let styles = {};
const ImagePlugin = React.createClass({
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
		const size = this.props.size || 'large';
		const align = this.props.align || 'full';

		// whether floating flows all of the text or just some is dependent on how much space is left
		// a 'large' image is smaller when floating because it needs to leave space for the text
		const sizeOptions = {
			'small': (this.props.align === 'full') ? '30%' : '25%',
			'medium': (this.props.align === 'full') ? '50%' : '40%',
			'large': (this.props.align === 'full') ? '100%' : '60%'
		};

		const styleObject = {
			width: sizeOptions[size],
			height: sizeOptions[size],
			display: 'block'
		};

		if (align === 'left' || align === 'right' ) {
			styleObject.float = align;
			styleObject.padding = '1em';
		} else if (this.props.align === 'full') {
			styleObject.margin = '0px auto';
		}

		let html;

		const imgProps = {style: {width: '100%', height: '100%'}};

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Not an Image-type asset.</ErrorMsg>;
		}	else if (url) {
			html = (<ImageLoader onLoad={this.loadedImage} style={styleObject} imgProps={imgProps} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
				{refName}
			</ImageLoader>);
		} else {
			html = <ErrorMsg>Could not find Image asset.</ErrorMsg>;
		}
		return html;
	}
});

export default Radium(ImagePlugin);
