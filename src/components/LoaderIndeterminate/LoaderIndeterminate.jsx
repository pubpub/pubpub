import React from 'react';
import Radium from 'radium';

let styles = {};

const LoaderIndeterminate = React.createClass({

	render: function() {
		return (
			<div className="loading-bar" style={styles.loadingBar}>
				
			</div>
		);
	}
});

const loadingBarFrames = Radium.keyframes({
	'0%': {transform: 'translateX(-100%)', opacity: 1},
	'98%': {transform: 'translateX(200%)', opacity: 1},
	'99%': {transform: 'translateX(200%)', opacity: 0},
	'100%': {transform: 'translateX(-100%)', opacity: 0},
}, 'Loading');

styles = {
	loadingBar: {
		width: '100%',
		height: '1px',
		backgroundColor: 'black',
		animation: `${loadingBarFrames} 1.5s linear infinite`,
	}
};

export default Radium(LoaderIndeterminate);
