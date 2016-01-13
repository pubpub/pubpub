import React, { PropTypes } from 'react';
import Radium from 'radium';

const loadingBarFrames = Radium.keyframes({
	'0%': {transform: 'translateX(-100%)', opacity: 1},
	'98%': {transform: 'translateX(200%)', opacity: 1},
	'99%': {transform: 'translateX(200%)', opacity: 0},
	'100%': {transform: 'translateX(-100%)', opacity: 0},
}, 'Loading');

const LoaderIndeterminate = React.createClass({
	propTypes: {
		color: PropTypes.string.isRequired
	},


	render: function() {

		const styles = {
			loadingBar: {
				width: '100%',
				height: '1px',
				backgroundColor: this.props.color,
				animation: 'x 1.5s linear infinite',
				animationName: loadingBarFrames,
			}
		};

		return (
			<div className="loading-bar" style={styles.loadingBar}></div>
		);
	}
});

export default Radium(LoaderIndeterminate);
