import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
// import smoothScroll from '../../utils/smoothscroll';
// import {DiscussionPreview, PubPreview} from '../ItemPreviews';
import {PubPreview} from '../ItemPreviews';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserMain = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
		username: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			profileData: {
				discussions: [],
				pubs: {
					published: [],
					unpublished: [],
					canRead: [],
				},
				groups: [],
				follows: {
					pubs: [],
					users: [],
					journals: [],
				},
			},
		};
	},

	getInitialState: function() {
		return {
			mode: 'pubs',
		};
	},

	// statClick: function(id) {
	// 	return ()=> {
	// 		const destination = document.getElementById(id);
	// 		smoothScroll(destination);
	// 	};
	// },

	calculateReputation: function() {

		let rep = 0;
		for (let index = this.props.profileData.discussions.length; index--;) {
			rep += this.props.profileData.discussions[index].points;
		}
		for (let index = this.props.profileData.pubs.published.length; index--;) {
			if (!this.props.profileData.pubs.published[index].settings || this.props.profileData.pubs.published[index].settings.pubPrivacy === 'public') {
				rep += 10;
			}
		}
		return rep;
	},

	render: function() {
		// console.log(this.props.profileData);
		const publishedPubs = (this.props.profileData.pubs && this.props.profileData.pubs.published) ? this.props.profileData.pubs.published : [];

		return (
			<div style={styles.container}>
				<p style={styles.profileDetail}>{this.props.profileData.title}</p>
				{/* <p style={styles.profileDetail}>Verfied with Twitter</p> */}
				<p style={styles.profileDetail}>{this.props.profileData.bio}</p>

				{/* Stats and Intra-Profile nav */}
				<div style={styles.statsWrapper}>
					<ul style={styles.statsList}>
						{/* <li key="profileStatsItem1" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>
								<FormattedMessage id="user.reputation" defaultMessage="Reputation"/>
							</div>
							<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>{this.calculateReputation()}<span style={styles.statParenthese}>)</span></div>
						</li> */ }

						<Link to={'/user/' + this.props.username + '/pubs'} style={globalStyles.link}>
						<li key="profileStatsItem2" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>
								<FormattedMessage {...globalMessages.pubs} />
							</div>
							<div style={styles.statsCount}>
								<span style={styles.statParenthese}>(</span>
								{publishedPubs.length}
								<span style={styles.statParenthese}>)</span>
							</div>
						</li>
						</Link>

						<Link to={'/user/' + this.props.username + '/discussions'} style={globalStyles.link}>
						<li key="profileStatsItem3" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>
								<FormattedMessage {...globalMessages.discussions} />
							</div>
							<div style={styles.statsCount}>
								<span style={styles.statParenthese}>(</span>
								{this.props.profileData.discussions ? this.props.profileData.discussions.length : 0}
								<span style={styles.statParenthese}>)</span>
							</div>
						</li>
						</Link>

						<Link to={'/user/' + this.props.username + '/groups'} style={globalStyles.link}>
						<li key="profileStatsItem4" style={[ styles.statsItem, this.props.ownProfile !== 'self' && {display: 'none'} ]}>
							<div style={styles.statsTitle}>
								<FormattedMessage {...globalMessages.groups} />
							</div>
							<div style={styles.statsCount}>
								<span style={styles.statParenthese}>(</span>
								{this.props.profileData.groups ? this.props.profileData.groups.length : 0}
								<span style={styles.statParenthese}>)</span>
							</div>
						</li>
						</Link>

						<Link to={'/user/' + this.props.username + '/follows'} style={globalStyles.link}>
						<li key="profileStatsItem5" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>
								<FormattedMessage {...globalMessages.follows} />
							</div>
							<div style={styles.statsCount}>
								<span style={styles.statParenthese}>(</span>
								{(()=>{
									if (!this.props.profileData.following) {
										return 0;
									}
									const pubCount = this.props.profileData.following.pubs ? this.props.profileData.following.pubs.length : 0;
									const userCount = this.props.profileData.following.users ? this.props.profileData.following.users.length : 0;
									const journalCount = this.props.profileData.following.journals ? this.props.profileData.following.journals.length : 0;

									return pubCount + userCount + journalCount;
								})()}
								<span style={styles.statParenthese}>)</span>
							</div>
						</li>
						</Link>

						{/* <li key="profileStatsItem4" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>Expert Papers</div>
							<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>14<span style={styles.statParenthese}>)</span></div>
						</li>

						<li key="profileStatsItem5" style={[styles.statsItem]}>
							<div style={styles.statsTitle}>Journals</div>
							<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>20<span style={styles.statParenthese}>)</span></div>
						</li> */}

					</ul>
				</div>

				{/* Selected Content based on nav */}
				<div style={styles.profileContent}>

					<div id={'pubs-section'} style={styles.sectionHeader}>
						{/* <FormattedMessage {...globalMessages.pubs} /> */}
						Recent Pubs
					</div>

					{
						publishedPubs.slice(0, 5).map((pub, index)=>{
							return (<PubPreview
								key={'pubItem-' + index}
								pubData={pub}
								canEdit={this.props.ownProfile === 'self' ? true : false} />
							);
						})
					}
					{publishedPubs.length === 0
						? <div style={globalStyles.emptyBlock}>
							<FormattedMessage id="user.noPubs" defaultMessage="No Pubs Yet"/>
						</div>
						: null
					}

					{/* <div id={'discussions-section'} style={styles.sectionHeader}>
						<FormattedMessage {...globalMessages.discussions} />
					</div>
					{(()=>{
						const outputDiscussions = [];
						for (let index = this.props.profileData.discussions.length; index--;) {
							outputDiscussions.push(<DiscussionPreview
								key={'discussionItem-' + index}
								discussionData={this.props.profileData.discussions[index]}
								canEdit={this.props.ownProfile === 'self' ? true : false} />);
						}
						return outputDiscussions;
					})()}
					{this.props.profileData.discussions.length === 0
						? <div style={globalStyles.emptyBlock}>
							<FormattedMessage id="user.noDiscussions" defaultMessage="No Discussions Yet"/>
						</div>
						: null
					} */}

				</div>
			</div>
		);
	}
});

export default Radium(UserMain);

styles = {
	profileDetail: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
			fontSize: '20px',
		},
	},

	statsWrapper: {
		borderWidth: '1px 0px 1px 0px',
		borderColor: '#CCC',
		borderStyle: 'solid',
		margin: '20px 0px',
		padding: '10px 0px',
		// clear: 'both',
		// height: 100,
		// backgroundColor: globalStyles.sideBackground,
		// backgroundColor: '#F0F0F0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// height: 300
			margin: '30px 0px',
		},
	},
	statsList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	statParenthese: {
		display: 'inline',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	statsItem: {
		// backgroundColor: 'rgba(200,200,100,0.3)',

		height: '30px',
		width: 'calc(100% / 3)',
		margin: '10px 0px',
		display: 'inline-block',

		// whiteSpace: 'nowrap',
		overflow: 'hidden',
		// textOverflow: 'ellipsis',

		textDecoration: 'none',
		color: globalStyles.sideText,
		userSelect: 'none',

		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '50%',
			height: 70,
			margin: '20px 0px',
		},

	},

	statsTitle: {
		// backgroundColor: 'rgba(255,0,0,0.2)',
		// textAlign: 'center',
		height: 30,
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(70,250,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 25,
			lineHeight: '25px',
			fontSize: '25px',
			textAlign: 'center',
		},

	},
	statsCount: {
		// backgroundColor: 'rgba(0,92,0,0.2)',
		height: 30,
		paddingLeft: 10,
		// textAlign: 'center',
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(190,70,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 45,
			lineHeight: '40px',
			textAlign: 'center',
			fontSize: '35px',
		},
	},
	profileContent: {
		// width: 'calc(100% - 40px)',
		// margin: '0px 20px',
	},
	sectionHeader: {
		fontSize: '30px',
		margin: '25px 0px 20px 0px',
	},
	pubBlock: {
		// margin: 15,
		// float: 'left',
		// backgroundColor: '#EAEAEA',
		// fontFamily: 'Lora',
		// width: 'calc(100% - 30px)',
		// width: 'calc(100% / 3 - 30px)',
		// height: 175,
		// overflow: 'hidden',
		// position: 'relative',
		// ':hover': {
			// backgroundColor: '#E5E5E5',
		// },
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// width: 'calc(100% - 30px)'
		// },

	},
	pubTextWrapper: {
		width: '100%',
		height: '100%',
	},
	pubTitle: {
		color: '#333',
		padding: '10px 10px 20px 10px',
		fontSize: '20px',
	},
	pubAbstract: {
		color: '#888',
		padding: '5px 15px 0px 15px',
	},
	pubEdit: {
		backgroundColor: '#FCFCFC',
		textAlign: 'center',
		position: 'absolute',
		bottom: 2,
		left: 2,
		height: '30px',
		lineHeight: '30px',
		color: '#555',
		width: 'calc(100% - 4px)',
		':hover': {
			cusror: 'pointer',
			color: '#111',

		},
	},
};
