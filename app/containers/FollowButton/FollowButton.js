import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import Link from 'components/Link/Link';
import Radium from 'radium';
import {Position, Tooltip } from '@blueprintjs/core';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { 
	postFollowsPub, deleteFollowsPub,
	postFollowsUser, deleteFollowsUser,
	postFollowsJournal, deleteFollowsJournal,
	postFollowsLabel, deleteFollowsLabel 
} from './actions';

let styles;

export const FollowButton = React.createClass({
	propTypes: {
		followButtonData: PropTypes.object,
		accountData: PropTypes.object,
		pubId: PropTypes.number,
		journalId: PropTypes.number,
		journalCustomDomain: PropTypes.string,
		userId: PropTypes.number,
		labelId: PropTypes.number,
		followData: PropTypes.object,
		followerCount: PropTypes.number,
		followersLink: PropTypes.object,
		dispatch: PropTypes.func,
	},


	getInitialState() {
		return {
			justFollowed: 0,
			leftUnfollow: false,
		};
	},

	createFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(postFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(postFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(postFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(postFollowsLabel(followId)); }
		this.setState({ 
			justFollowed: this.state.justFollowed + 1,
			leftUnfollow: false
		});
	},

	deleteFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(deleteFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(deleteFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(deleteFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(deleteFollowsLabel(followId)); }
		this.setState({ justFollowed: this.state.justFollowed - 1 });
	},

	leftUnfollow: function() {
		this.setState({ leftUnfollow: true });
	},

	render() {
		const accountUser = this.props.accountData.user || {};
		const isLoggedIn = accountUser.id !== undefined;

		const submittedIds = Number(!!this.props.pubId) + Number(!!this.props.userId) + Number(!!this.props.journalId) + Number(!!this.props.labelId);
		if (submittedIds !== 1) { return <div>Incorrect number of submitted IDs!</div>; }

		const followId = this.props.pubId || this.props.journalId || this.props.userId || this.props.labelId;
		let mode;
		if (this.props.pubId !== undefined) { mode = 'pub'; }
		if (this.props.journalId !== undefined) { mode = 'journal'; }
		if (this.props.userId !== undefined) { mode = 'user'; }
		if (this.props.labelId !== undefined) { mode = 'label'; }
		
		const followData = this.props.followData || {};
		const isFollowing = this.state.justFollowed !== -1 && (followData.followerId || this.state.justFollowed === 1);
		const followerCount = this.props.followerCount;

		return (
			<div className="pt-button-group">
				{!isFollowing && isLoggedIn &&
					<a role="button" className="pt-button pt-icon-new-person" onClick={this.createFollow.bind(this, followId, mode)}>Follow <span style={{ textTransform: 'capitalize' }}>{mode}</span></a>
				}

				{!isFollowing && !isLoggedIn &&
					<Tooltip content="Must be logged in to Follow" position={Position.BOTTOM}>
						<Link to={'/login'} className="pt-button pt-icon-new-person">Follow <span style={{ textTransform: 'capitalize' }}>{mode}</span></Link>
					</Tooltip>
				}

				{isFollowing &&
					<a role="button" style={styles.following} className="pt-button pt-icon-new-person showChildOnHover" onMouseLeave={this.leftUnfollow}>
						Following
						{(!this.state.justFollowed || this.state.leftUnfollow) && 
							<button style={styles.unfollow} className={'pt-button pt-fill pt-intent-danger hoverChild'} onClick={this.deleteFollow.bind(this, followId, mode)}>Unfollow</button>
						}
						
					</a>
				}
				
				{followerCount !== undefined &&
					// Need to make this a link that appends /followers
					// Might need to take in a link
					<Link to={this.props.followersLink} customDomain={this.props.journalCustomDomain} className="pt-button">{followerCount + Number((followData.followerId && this.state.justFollowed === 1) ? 0 : this.state.justFollowed || 0)}</Link>
				}
				
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
		followButtonData: state.followButton.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(FollowButton));

styles = {
	following: {
		position: 'relative',
	},
	unfollow: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		transition: '0s linear all',
		border: '0px solid black',
		boxShadow: '0px 0px 0px black',
	},
	followingBox: {
		maxWidth: '250px',
		padding: '.5em',
	},
	unfollowButton: {
		textAlign: 'center',
	},
	followDescription: {
		margin: '0.5em 0em',
	},
	
};
