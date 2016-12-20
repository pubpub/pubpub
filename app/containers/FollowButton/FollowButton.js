import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Popover, PopoverInteractionKind, Position, Menu, MenuDivider, Checkbox } from '@blueprintjs/core';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { 
	postFollowsPub, putFollowsPub, deleteFollowsPub,
	postFollowsUser, putFollowsUser, deleteFollowsUser,
	postFollowsJournal, putFollowsJournal, deleteFollowsJournal,
	postFollowsLabel, putFollowsLabel, deleteFollowsLabel 
} from './actions';

let styles;

const followKeys = {
	pubNotifyOnNewVersion: true,
	pubNotifyOnNewDiscussions: true,
	pubNotifyOnNewFeature: true,

	userNotifyOnNewPub: true,
	userNotifyOnAdmin: true,

	journalNotifyOnNewFeature: true,
	journalNotifyOnNewSubmission: true,

	labelNotifyOnPub: true,
};

export const FollowButton = React.createClass({
	propTypes: {
		followButtonData: PropTypes.object,
		pubId: PropTypes.number,
		journalId: PropTypes.number,
		userId: PropTypes.number,
		labelId: PropTypes.number,
		followData: PropTypes.object,
		followerCount: PropTypes.number,
		followersLink: PropTypes.string,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		// Populate state with journalData values if they exist
		this.initializeState(this.props.followData);
	},

	componentWillReceiveProps(nextProps) {
		if (!this.props.followData && !!nextProps.followData) {
			this.initializeState(nextProps.followData);
		}
	},

	getInitialState() {
		return {
			justFollowed: 0,
			...followKeys,
		};
	},

	initializeState: function(followData) {
		let mode;
		if (!followData) { return null; }
		if (followData.pubId !== undefined) { mode = 'pub'; }
		if (followData.journalId !== undefined) { mode = 'journal'; }
		if (followData.userId !== undefined) { mode = 'user'; }
		if (followData.labelId !== undefined) { mode = 'label'; }

		Object.keys(followKeys).map((key)=> {
			const newKey = key.charAt(mode.length).toLowerCase() + key.substring(mode.length + 1, key.length); // Strips the mode prefix from the state key and fixes camelCase. Needed for backend.
			followKeys[key] = followData[newKey];
		});
		return this.setState(followKeys);
	},

	createFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(postFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(postFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(postFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(postFollowsLabel(followId)); }
		this.setState({ justFollowed: 1 });
	},

	deleteFollow: function(followId, mode) {
		if (mode === 'pub') { this.props.dispatch(deleteFollowsPub(followId)); }
		if (mode === 'user') { this.props.dispatch(deleteFollowsUser(followId)); }
		if (mode === 'journal') { this.props.dispatch(deleteFollowsJournal(followId)); }
		if (mode === 'label') { this.props.dispatch(deleteFollowsLabel(followId)); }
		this.setState({ justFollowed: -1 });
	},

	handleChange: function(followId, mode, option, evt) {
		const nextState = { 
			...this.state,
			[option]: evt.target.checked
		};
		this.setState(nextState);

		// Filter the new options and prep them for sending to backend.
		const putOptions = {};
		const putOptionsKeys = Object.keys(nextState).filter((key)=> {
			return key.indexOf(mode) === 0;
		}).map((key)=> {
			const newKey = key.charAt(mode.length).toLowerCase() + key.substring(mode.length + 1, key.length); // Strips the mode prefix from the state key and fixes camelCase. Needed for backend.
			putOptions[newKey] = nextState[key];
		});

		if (mode === 'pub') { this.props.dispatch(putFollowsPub(followId, putOptions)); }
		if (mode === 'user') { this.props.dispatch(putFollowsUser(followId, putOptions)); }
		if (mode === 'journal') { this.props.dispatch(putFollowsJournal(followId, putOptions)); }
		if (mode === 'label') { this.props.dispatch(putFollowsLabel(followId, putOptions)); }
	},

	render() {
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

		const options = Object.keys(this.state).filter((key)=> {
			return key.indexOf(mode) === 0;
		});

		const optionsLanguage = {
			pubNotifyOnNewVersion: 'When new version created',
			pubNotifyOnNewDiscussions: 'When Discussions added',
			pubNotifyOnNewFeature: 'When journals feature',

			userNotifyOnNewPub: 'When involved with new pub',
			userNotifyOnAdmin: 'when admining a new journal',

			journalNotifyOnNewFeature: 'when feautre new pub',
			journalNotifyOnNewSubmission: 'when create new submission',

			labelNotifyOnPub: 'when new pub added',
		};

		return (
			<div className="pt-button-group">
				{!isFollowing &&
					<button className="pt-button" onClick={this.createFollow.bind(this, followId, mode)}>Follow</button>
				}

				{isFollowing &&
					<Popover 
						content={
							<Menu>
								<li className={'pt-menu-header'}><h6>Followed Activities</h6></li>
								{options.map((option, index)=> {
									return (
										<li style={styles.checkboxItem} key={'checkbox-' + option}>
											<Checkbox checked={this.state[option]} onChange={this.handleChange.bind(this, followId, mode, option)}>
												{optionsLanguage[option]}
											</Checkbox>
										</li>
									);
								})}

								<MenuDivider />
								<li className={'pt-menu-item'} style={styles.unfollowButton} onClick={this.deleteFollow.bind(this, followId, mode)}>Unfollow</li>
							</Menu>
						} 
						position={Position.BOTTOM}>

						<button className="pt-button">Following <span className="pt-icon-standard pt-icon-caret-down pt-align-right"/></button>

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
		followButtonData: state.followButton.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(FollowButton));

styles = {
	checkboxItem: {
		margin: '1em 0.5em 0em',
	},
	unfollowButton: {
		textAlign: 'center',
	},
	
};
