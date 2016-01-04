import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';
import ErrorMsg from './ErrorPlugin';

import {propSrc, propSize, propAlign, propCaption} from './pluginProps';
export const imageOptions = {src: propSrc('image'), size: propSize, align: propAlign, caption: propCaption};

let styles = {};

const ImagePlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOf(['small', 'medium', 'large']),
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
		const size = this.props.size || 'large';
		const align = this.props.align || 'full';
		const caption = this.props.caption || '';


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
			styleObject.margin = '2em';
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
			html = (<div style={styleObject}>
				<ImageLoader onLoad={this.loadedImage} imgProps={imgProps} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
					{refName}
				</ImageLoader>
				{ (caption) ? <span style={styles.caption}>{caption}</span> : null }
			</div>
		);
		} else {
			html = <ErrorMsg>Could not find Image asset.</ErrorMsg>;
		}
		return html;
	}
});

styles = {
	caption: {
		fontSize: '0.8em',
		color: '#757575'
	},
};


export default Radium(ImagePlugin);
