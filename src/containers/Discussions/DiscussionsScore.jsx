import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubDiscussionsScore = React.createClass({
	propTypes: {
		discussionID: PropTypes.string,
		score: PropTypes.number,
		userYay: PropTypes.bool,
		userNay: PropTypes.bool,
		handleVoteSubmit: PropTypes.func,
		readOnly: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			score: 0,
		};
	},

	handleVoteClick: function(type, discussionID) {
		return ()=> {
			this.props.handleVoteSubmit(type, discussionID, this.props.userYay, this.props.userNay);
		};

	},

	render: function() {
		const discussionID = this.props.discussionID;
		return (
			<div style={styles.container}>

				<div key={'yay-' + discussionID} style={[styles.voteButton, styles.voteUp, this.props.userYay && styles.activeVote, this.props.readOnly && styles.readOnly]} onClick={this.handleVoteClick('yay', discussionID)}>
					^
					{/* We're not quite ready for this. Don't have the right design
						<div style={[styles.voteMessage, styles.yayMessage]}>For constructive, insightful, or productive discussion</div>
					*/}
				</div>
				<div style={styles.voteScore}>{this.props.score + 1}</div>
				<div key={'nay-' + discussionID} style={[styles.voteButton, styles.voteDown, this.props.userNay && styles.activeVote, this.props.readOnly && styles.readOnly]} onClick={this.handleVoteClick('nay', discussionID)}>
					^
					{/* We're not quite ready for this. Don't have the right design
						<div style={[styles.voteMessage, styles.nayMessage]}>For unproductive or trolling discussion. <br/>NOT for thoughtful discussion you happen to disagree with.</div>
					*/}

				</div>

			</div>
		);
	}
});

export default Radium(PubDiscussionsScore);

styles = {
	voteButton: {
		position: 'relative',
		overflow: 'hidden',
		':hover': {
			color: '#444',
			cursor: 'pointer',
			overflow: 'visible',
		}
	},
	voteMessage: {
		position: 'absolute',
		fontSize: '15px',
		lineHeight: '18px',
		fontFamily: globalStyles.headerFont,
		backgroundColor: 'rgba(255,255,255,0.9)',
		color: 'black',
		width: '300px',
		textAlign: 'left',
		padding: 5,
		border: '1px solid #333',
		bottom: 20,
	},
	voteUp: {
		height: 10,
		lineHeight: '22px',
		fontSize: '24px',
		color: '#aaa',
	},
	activeVote: {
		color: '#000',
	},
	yayMessage: {
		left: 5,
	},
	voteScore: {
		color: '#888',
		fontFamily: 'Lato',
	},
	voteDown: {
		height: 10,
		lineHeight: '22px',
		fontSize: '24px',
		color: '#aaa',
		transform: 'rotate(180deg)',
	},
	nayMessage: {
		right: 5,
		transform: 'rotate(180deg)',
	},
	readOnly: {
		opacity: 0.15,
		pointerEvents: 'none',
	},

};
