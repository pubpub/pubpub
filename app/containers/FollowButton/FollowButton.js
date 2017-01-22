import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Popover, Position, Tooltip } from '@blueprintjs/core';

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
		};
	},

	createFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(postFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(postFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(postFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(postFollowsLabel(followId)); }
		this.setState({ justFollowed: this.state.justFollowed + 1 });
	},

	deleteFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(deleteFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(deleteFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(deleteFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(deleteFollowsLabel(followId)); }
		this.setState({ justFollowed: this.state.justFollowed -1 });
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

		const followDescription = {
			pub: 'Receiving updates for new versions, new discussions, new contributors, and new journal features.',
			user: 'Receiving updates for new pubs, new journals, and new follows.',
			journal: 'Receiving updates for new features, new submissions, and new admins.',
			label: 'Receiving updates for new pubs and new followers.',
		};

		return (
			<div className="pt-button-group">
				{!isFollowing && isLoggedIn &&
					<a role="button" className="pt-button pt-icon-new-person" onClick={this.createFollow.bind(this, followId, mode)}>Follow <span style={{textTransform: 'capitalie'}}>{mode}</span></a>
				}

				{!isFollowing && !isLoggedIn &&
					<Tooltip content="Must be logged in to Follow" position={Position.BOTTOM}>
						<Link to={'/login'} className="pt-button pt-icon-new-person">Follow <span style={{textTransform: 'capitalie'}}>{mode}</span></Link>
					</Tooltip>
				}

				{isFollowing &&
					<Popover 
						content={
							<div style={styles.followingBox}>
								<p style={styles.followDescription}>{followDescription[mode]}</p>
								<hr />
								<button className={'pt-button pt-fill'} onClick={this.deleteFollow.bind(this, followId, mode)}>Unfollow</button>
							</div>
							
						} 
						position={Position.BOTTOM_RIGHT}>

						<a role="button" className="pt-button pt-icon-new-person">Following <span className="pt-icon-standard pt-icon-caret-down pt-align-right" /></a>

					</Popover>
				}
				
				{followerCount !== undefined &&
					// Need to make this a link that appends /followers
					// Might need to take in a link
					<Link to={this.props.followersLink} className="pt-button">{followerCount + Number((followData.followerId && this.state.justFollowed === 1) ? 0 : this.state.justFollowed || 0)}</Link>
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
