import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubDiscussionsScore = React.createClass({
	propTypes: {
		discussionID: PropTypes.string,
		score: PropTypes.number,
	},

	getDefaultProps: function() {
		return {
			score: 0,
		};
	},

	
	addYay: function(discussionID) {
		return ()=> {
			console.log('yay', discussionID);
		};
	},

	addNay: function(discussionID) {
		return ()=> {
			console.log('nay', discussionID);
		};
	},

	render: function() {
		const discussionID = this.props.discussionID;
		return (
			<div style={styles.container}>
				
				<div key={'yay-' + discussionID} style={[styles.voteButton, styles.voteUp]} onClick={this.addYay(discussionID)}>^</div>
				<div style={styles.voteScore}>{this.props.score}</div>
				<div key={'nay-' + discussionID} style={[styles.voteButton, styles.voteDown]} onClick={this.addNay(discussionID)}>^</div>
				
			</div>
		);
	}
});

export default Radium(PubDiscussionsScore);

styles = {
	voteButton: {
		':hover': {
			color: '#444',
			cursor: 'pointer',
		}
	},
	voteUp: {
		// backgroundColor: 'rgba(0,0,100,0.2)',
		// fontFamily: 'Courier',
		height: 20,
		lineHeight: '38px',
		fontSize: '28px',
		color: '#aaa',
	},
	voteScore: {
		// backgroundColor: 'rgba(255,100,100,0.2)',
		color: '#888',
		fontFamily: 'Lato',
		// fontWeight: 'bold',

	},
	voteDown: {
		// backgroundColor: 'rgba(0,0,100,0.2)',
		// fontFamily: 'Courier',
		height: 20,
		lineHeight: '38px',
		fontSize: '28px',
		color: '#aaa',
		transform: 'rotate(180deg)',
	},
	
};
