import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';

// let styles = {};

const MathPlugin = React.createClass({
	propTypes: {
		svg: PropTypes.string,
		children: PropTypes.string
	},
	getInitialState: function() {
		this.lastURL = undefined;
		return {};
	},
	preloader: function() {
		let result;
		if (this.lastURL) {
			result = <span>{this.lastURL}</span>;
		} else {
			result = <span>loading</span>;
		}
		return result;
	},
	loadedImage: function(evt) {
		// this.lastURL = evt.target.src;
		this.lastURL = this.props.children;
	},
	render: function() {
		const equation = this.props.children;
		const urlRequest = 'https://dry-retreat-1640.herokuapp.com/mathtest?equation=' + encodeURIComponent(equation);
		return (
			<ImageLoader onLoad={this.loadedImage} src={urlRequest} wrapper={React.DOM.span} preloader={this.preloader}>
				{equation}
			</ImageLoader>
		);
	}
});

/*
styles = function() {
	return {
	};
};
*/

export default Radium(MathPlugin);
