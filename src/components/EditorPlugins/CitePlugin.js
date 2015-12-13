import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';
import {srcRef} from './pluginProps';

export const citeOptions = {srcRef};

// let styles = {};
const CitePlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		ref: PropTypes.string,
		children: PropTypes.string
	},
	getInitialState: function() {
		return {};
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
			html = <span>Could not find reference</span>;
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

export default Radium(CitePlugin);
