import React, {PropTypes} from 'react';
// import {AtomViewerPane} from './AtomViewerPane';

let styles;

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
	},

	clicked: function() {
		console.log('Clicked on ', this.props.source);
	},
	
	render: function() {
		return (
			<div className={'pub-embed ' + this.props.className} style={styles.container} onClick={this.clicked}>
				{this.props.source}				
			</div>
		);
	}
});

export default EmbedWrapper;

styles = {
	container: {
		// width: '50px',
		// height: '50px',
		padding: '10px',
		backgroundColor: 'red',
		display: 'inline-block',
	},
};
