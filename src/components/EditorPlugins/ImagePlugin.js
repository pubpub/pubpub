import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';

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
	loadedImage: function(evt) {
		// this.lastURL = evt.target.src;
		// debugger;
		// this.lastURL = this.props.children;
		return;
	},
	render: function() {
		const refName = this.props.children;
		const url = this.props.url;
		let html;
		if (url) {
			html = (<ImageLoader onLoad={this.loadedImage} src={url} wrapper={React.DOM.span} preloader={this.preloader}>
				{refName}
			</ImageLoader>);
		} else {
			html = <div>Could not find asset</div>;
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
