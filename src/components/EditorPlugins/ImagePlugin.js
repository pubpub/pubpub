import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';

export const imageOptions = {
	titles: {
		width: 'width',
		height: 'height',
		align: 'align',
		inline: 'inline'
	},
	defaults: {
		width: '100%',
		height: 'auto',
		align: 'center',
		inline: 'false'
	},
	values: {
		width: '',
		height: '',
		align: '',
		inline: '',
	},
};

// let styles = {};
const ImagePlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		children: PropTypes.string
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
		const img = !(this.props.url === 'error:type');
		const url = this.props.url;
		let html;
		if (!img) {
			html = <span>Not an image asset.</span>;
		}	else if (url) {
			html = (<ImageLoader onLoad={this.loadedImage} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
				{refName}
			</ImageLoader>);
		} else {
			html = <span>Could not find asset</span>;
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
