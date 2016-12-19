import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Popover, PopoverInteractionKind, Position, Menu, MenuDivider, Checkbox } from '@blueprintjs/core';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

// import { getLabel } from './actions';

let styles;

export const FollowButton = React.createClass({
	propTypes: {
		followButtonData: PropTypes.object,
		pubId: PropTypes.number,
		journalId: PropTypes.number,
		userId: PropTypes.number,
		labelId: PropTypes.number,
		followData: PropTypes.object,
		followerCount: PropTypes.number,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		// Populate state with journalData values if they exist
	},

	getInitialState() {
		return {
			pubNotifyOnVersion: false,
			pubNotifyOnDiscussion: false,
			pubNotifyOnJournal: false,
			pubNotifyOnContributors: false,

			userNotifyOnPub: false,
			userNotifyOnAdmin: false,

			journalNotifyOnFeature: false,
			journalNotifyOnCollection: false,

			labelNotifyOnPub: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		
	},

	handleChange: function(option, evt) {
		this.setState({ [option]: evt.target.checked });
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
		
		const isFollowing = !!this.props.followData || true;
		const followerCount = this.props.followerCount || 12;

		const options = Object.keys(this.state).filter((key)=> {
			return key.indexOf(mode) === 0;
		});

		const optionsLanguage = {
			pubNotifyOnVersion: 'When Pubs Change',
			pubNotifyOnDiscussion: 'When Discussions added',
			pubNotifyOnJournal: 'When journals feature',
			pubNotifyOnContributors: 'when contributors added',

			userNotifyOnPub: 'When involved with new pub',
			userNotifyOnAdmin: 'when admining a new journal',

			journalNotifyOnFeature: 'when feautre new pub',
			journalNotifyOnCollection: 'when create new collection',

			labelNotifyOnPub: 'when new pub added',
		};
		return (
			<div style={styles.container}>
				

				<div className="pt-button-group">
					{!isFollowing &&
						<button className="pt-button">Follow</button>
					}

					{isFollowing &&
						<Popover 
							content={
								<Menu>
									<li className={'pt-menu-header'}><h6>Followed Activities</h6></li>
									{options.map((option, index)=> {
										return <li style={styles.checkboxItem}><Checkbox checked={this.state[option]} onChange={this.handleChange.bind(this, option)}>{optionsLanguage[option]}</Checkbox></li>;
									})}

									<MenuDivider />
									<li className={'pt-menu-item'} style={styles.unfollowButton}>Unfollow</li>
								</Menu>
							} 
							position={Position.BOTTOM}>

							<button className="pt-button">Following <span className="pt-icon-standard pt-icon-caret-down pt-align-right"/></button>

						</Popover>
					}
					
					{followerCount !== undefined &&
						<button className="pt-button">{followerCount}</button>
					}
					
				</div>
					
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
	container: {
		padding: '2em 1em',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	checkboxItem: {
		margin: '1em 0.5em 0em',
	},
	unfollowButton: {
		textAlign: 'center',
	},
	
};
