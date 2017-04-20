import React, { PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, NonIdealState, Spinner } from '@blueprintjs/core';
import ActivityItem from 'components/ActivityItem/ActivityItem';
import ActivityGroup from 'components/ActivityGroup/ActivityGroup';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { getActivities } from './actions';
import LandingAbout from './LandingAbout';

let styles;

export const Landing = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		activitiesData: PropTypes.object,
		landingData: PropTypes.object,
		signUpData: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			hasCookie: false,
		};
	},

	componentWillMount() {
		// this.setState({ hasCookie: document.cookie.indexOf('connect.sid') > -1 });
		this.props.dispatch(getActivities());
	},

	// handleSubmit: function(evt) {
	// 	evt.preventDefault();
	// 	this.props.dispatch(postUser(this.state.email, this.state.name));
	// },

	formatFilterString: function(mode, string) {
		if (mode === 'you' && string === 'People') { return 'You'; }
		if (mode === 'you') { return 'Your ' + string; }
		return string + ' you Follow';
	},

	filterUniqueActivities: function(activitiesArray) {
		const uniqueIDs = {};
		return activitiesArray.filter((activity)=>{
			const date = new Date(activity.createdAt);
			const actor = activity.actorPub || activity.actorUser || activity.actorJournal || activity.actorLabel || {};
			const target = activity.targetPub || activity.targetUser || activity.targetJournal || activity.targetLabel || {};
			const object = activity.objectPub || activity.objectUser || activity.objectJournal || activity.objectLabel || {};
			const activityKey = `${activity.verb}-${actor.id}-${object.id}-${target.id}-${date.getYear()}${date.getMonth()}${date.getDate()}`;
			if (activityKey in uniqueIDs) { return false; }
			uniqueIDs[activityKey] = true;
			return true;
		});
	},

	render() {
		const accountData = this.props.accountData || {};
		const user = accountData.user || {};

		const activitiesData = this.props.activitiesData || {};
		const activities = activitiesData.activities || {};
		const activitiesLoading = activitiesData.loading;

		const activitiesPubs = activities.pubs || [];
		const activitiesUsers = activities.users || [];
		const activitiesJournals = activities.journals || [];
		const activitiesLabels = activities.labels || [];
		const uniqueActivities = this.filterUniqueActivities([...activitiesUsers, ...activitiesPubs, ...activitiesJournals, ...activitiesLabels]);

		const myActivitiesPubs = activities.myPubs || [];
		const myActivitiesUsers = activities.myUsers || [];
		const myActivitiesJournals = activities.myJournals || [];
		const myUniqueActivities = this.filterUniqueActivities([...myActivitiesUsers, ...myActivitiesPubs, ...myActivitiesJournals]);


		const assets = activitiesData.assets || {};
		const assetPubs = assets.pubs || [];
		const assetJournals = assets.journals || [];

		const location = this.props.location || {};
		const query = location.query || {};
		const mode = query.mode || 'following';
		const filterMode = query.filter || 'All';
		const filterList = mode === 'you'
			? ['All', 'Pubs', 'Journals', 'People']
			: ['All', 'Pubs', 'Journals', 'People', 'Labels'];

		let followingActivities;
		if (filterMode === 'All') { followingActivities = uniqueActivities; }
		if (filterMode === 'Pubs') { followingActivities = activitiesPubs; }
		if (filterMode === 'People') { followingActivities = activitiesUsers; }
		if (filterMode === 'Journals') { followingActivities = activitiesJournals; }
		if (filterMode === 'Labels') { followingActivities = activitiesLabels; }

		let myActivities;
		if (filterMode === 'All') { myActivities = myUniqueActivities; }
		if (filterMode === 'Pubs') { myActivities = myActivitiesPubs; }
		if (filterMode === 'People') { myActivities = myActivitiesUsers; }
		if (filterMode === 'Journals') { myActivities = myActivitiesJournals; }

		let selectedActivities = [];
		if (mode === 'following') { selectedActivities = followingActivities; }
		if (mode === 'you') { selectedActivities = myActivities; }


		// Iterate over all activities and add create keys based on the actor-object, actor-target, or target values
		// Keys are also set with the date of the activity, so only same-day activities get grouped.
		// The key is checked across a list of approved groups per type. If valid, that specific type of key (keyTarget, keyActorObject or KeyActorTarget) is
		// added to the groups object.
		// Objects that are not an approved verb type for groups simply get added to the groups object with their id as key
		// At the end, we have a groups objet that has arrays organized by the specfic (groupable) keys.
		// We iterate over these keys, and if length === 1, pull out the single activity
		// If length > 1, we keep the activity group in place and render the items as a group.
		const groups = {};
		selectedActivities.map((activity)=> {
			const date = new Date(activity.createdAt);
			const actor = activity.actorPub || activity.actorUser || activity.actorJournal || activity.actorLabel || {};
			const target = activity.targetPub || activity.targetUser || activity.targetJournal || activity.targetLabel || {};
			const object = activity.objectPub || activity.objectUser || activity.objectJournal || activity.objectLabel || {};
			const keyTarget = `${activity.verb}-${target.id}-${date.getYear()}${date.getMonth()}${date.getDate()}`;
			const keyActorObject = `${activity.verb}-${actor.id}-${object.id}-${date.getYear()}${date.getMonth()}${date.getDate()}`;
			const keyActorTarget = `${activity.verb}-${actor.id}-${target.id}-${date.getYear()}${date.getMonth()}${date.getDate()}`;
			const keyObjectTarget = `${activity.verb}-${object.id}-${target.id}-${date.getYear()}${date.getMonth()}${date.getDate()}`;

			const actorObjectGroups = [
				'newPubLabel', // Travis added Pub to 4 labels
				'featuredPub', // Journal features 8 pubs
				'followedUser', // Ayla followed 6 people
				'followedPub', // Ayla followed 6 pubs
				'followedJournal', // Ayla followed 6 journal
				'followedLabel', // Ayla followed 6 label
			];
			const actorTargetGroups = [
				'addedContributor', // Amy added 4 contributors to Pub
				'addedAdmin', // Amy added 4 contributors to Pub
			];
			const targetGroups = [
				'newDiscussion', // 8 people added new discussions
			];
			const objectTargetGroups = [
				'newReply', // 13 people replied to a Discussion on Pub
			];
			if (targetGroups.includes(activity.verb)) {
				if (keyTarget in groups) {
					groups[keyTarget].push(activity);
				} else {
					groups[keyTarget] = [activity];
				}
			} else if (actorTargetGroups.includes(activity.verb)) {
				if (keyActorTarget in groups) {
					groups[keyActorTarget].push(activity);
				} else {
					groups[keyActorTarget] = [activity];
				}
			} else if (actorObjectGroups.includes(activity.verb)) {
				if (keyActorObject in groups) {
					groups[keyActorObject].push(activity);
				} else {
					groups[keyActorObject] = [activity];
				}
			} else if (objectTargetGroups.includes(activity.verb)) {
				if (keyObjectTarget in groups) {
					groups[keyObjectTarget].push(activity);
				} else {
					groups[keyObjectTarget] = [activity];
				}
			} else {
				groups[activity.id] = [activity];
			}
		});

		const realActivities = Object.keys(groups).map((activityGroupKey)=> {
			const activityGroup = groups[activityGroupKey];
			if (activityGroup.length === 1) {
				return activityGroup[0];
			}
			return activityGroup.sort((foo, bar)=> {
				if (foo.createdAt > bar.createdAt) { return -1; }
				if (foo.createdAt < bar.createdAt) { return 1; }
				return 0;
			});
		}).sort((foo, bar)=> {
			const fooDate = Array.isArray(foo) ? foo[0].createdAt : foo.createdAt;
			const barDate = Array.isArray(bar) ? bar[0].createdAt : bar.createdAt;
			if (fooDate > barDate) { return -1; }
			if (fooDate < barDate) { return 1; }
			return 0;
		});

		return (
			<div style={styles.container}>

				{!user.id &&
					<LandingAbout dispatch={this.props.dispatch} landingData={this.props.landingData} signUpData={this.props.signUpData} />
				}
      
				{user.id &&

					<div style={styles.activitiesTable}>
						<div style={styles.leftPanel}>
							<div style={styles.headerWrapper}>
								<div style={styles.headerTitle}>
									<h2 style={styles.header}>Activity</h2>
								</div>
								<div style={styles.headerOptions}>
									<div className="pt-button-group pt-minimal">
										{/* <Link to={{ pathname: '/', query: { ...query, mode: 'global', filter: undefined } }} className={mode === 'global' ? 'pt-button pt-active' : 'pt-button'}>Global</Link> */}
										<Link to={{ pathname: '/', query: { ...query, mode: undefined, filter: undefined } }} className={mode === 'following' ? 'pt-button pt-active' : 'pt-button'}>Following</Link>
										<Link to={{ pathname: '/', query: { ...query, mode: 'you', filter: undefined } }} className={mode === 'you' ? 'pt-button pt-active' : 'pt-button'}>Your Activity</Link>
									</div>
								</div>
								<div style={styles.headerRight}>
									<DropdownButton
										content={
											<Menu>
												{filterList.map((filter, index)=> {
													return (
														<li key={'filter-' + index}><Link to={{ pathname: '/', query: { ...query, filter: filter === 'All' ? undefined : filter } }} className="pt-menu-item pt-popover-dismiss">
															{index !== 0 ? this.formatFilterString(mode, filter) : filter}
															{filterMode === filter && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
														</Link></li>
													);
												})}
											</Menu>
										}
										title={'Filter: ' + ((filterMode === 'People' && mode === 'you') ? 'You' : filterMode)}
										position={2} />
								</div>
							</div>

							{activitiesLoading &&
								<div style={{ textAlign: 'center', padding: '2em 0em' }}>
									<Spinner />
								</div>
								
							}

							{!activitiesLoading && realActivities.map((activity)=> {
								if (Array.isArray(activity)) {
									return <ActivityGroup key={'activityGroup-' + activity[0].id} activities={activity} />;
								}
								return <ActivityItem key={'activity-' + activity.id} activity={activity} />;
							})}

							{!activitiesLoading && !realActivities.length &&
								<NonIdealState
									title={'No Activities'}
									visual={'pulse'} />
							}

						</div>

						<div style={styles.rightPanel}>
							{!activitiesLoading &&
								<div style={styles.rightContent}>
									<div style={styles.rightSection} className={'pt-card pt-elevation-0'}>
										<div className="pt-dialog-header">
											{/* <span className="pt-icon-large pt-icon-application" /> */}
											<h5>Your Pubs</h5>
											{!!assetPubs.length &&
												<Link to={'/pubs/create'} className={'pt-button pt-icon-add'} style={styles.sideButton}>New</Link>
											}

										</div>
										<div className="pt-dialog-body">
											{assetPubs.map((pub)=> {
												return <Link key={'pub-link-' + pub.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/pub/' + pub.slug}>{pub.title}</Link>;
											})}

											{!assetPubs.length &&
												<div style={{ paddingBottom: '1em' }}>
													<NonIdealState
														title={'No Pubs'}
														action={<Link to={'/pubs/create'} className={'pt-button pt-icon-add'} style={{ whiteSpace: 'nowrap' }}>Create new Pub</Link>}
														visual={'application'} />
												</div>
											}
										</div>


									</div>

									<div style={styles.rightSection} className={'pt-card pt-elevation-0'}>
										<div className="pt-dialog-header">
											{/* <span className="pt-icon-large pt-icon-applications" /> */}
											<h5>Your Journals</h5>
											{!!assetJournals.length &&
												<Link to={'/journals/create'} className={'pt-button pt-icon-add'} style={styles.sideButton}>New</Link>
											}

										</div>
										<div className="pt-dialog-body">
											{assetJournals.map((journal)=> {
												return <Link key={'journal-link-' + journal.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/' + journal.slug}>{journal.title}</Link>;
											})}

											{!assetJournals.length &&
												<div style={{ paddingBottom: '1em' }}>
													<NonIdealState
														title={'No Journals'}
														action={<Link to={'/journals/create'} className={'pt-button pt-icon-add'} style={{ whiteSpace: 'nowrap' }}>Create new Journal</Link>}
														visual={'applications'} />
												</div>
											}
										</div>
									</div>


								</div>
							}
						</div>
					</div>
				}

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
		activitiesData: state.activities.toJS(),
		landingData: state.landing.toJS(),
		signUpData: state.signUp.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Landing));

styles = {
	container: {
		// padding: '1.5em',
		// width: 'calc(100% - 3em)',
		// maxWidth: '1024px',
		// margin: '0 auto',
	},
	headerSection: {
		position: 'relative',

	},
	headerImage: {
		backgroundImage: 'url("https://images.unsplash.com/photo-1478250242432-9381e12b763b?dpr=1&auto=format&fit=crop&w=1500&h=1097&q=80&cs=tinysrgb&crop=")',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center bottom',
		backgroundSize: 'cover',
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: 1,
	},
	headerContent: {
		padding: '150px 1.5em 150px',
		width: 'calc(100% - 3em)',
		maxWidth: '1024px',
		margin: '0 auto',
		zIndex: 2,
		position: 'relative',
		color: 'white',
	},
	splashTitle: {
		fontSize: '3.5em',
		fontWeight: '200',
	},
	splashButtons: {
		paddingTop: '2em',
	},
	section: (isGray)=> {
		return {
			backgroundColor: isGray ? '#F3F3F4' : '#FFF',
		};
	},
	sectionContent: {
		padding: '4em 1.5em',
		width: 'calc(100% - 3em)',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	activitiesTable: {
		display: 'table',
		// width: '100%',
		padding: '1.5em',
		width: 'calc(100% - 3em)',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	leftPanel: {
		display: 'table-cell',
	},
	rightPanel: {
		display: 'table-cell',
		paddingLeft: '1em',
		// width: '1%',
		width: '268px',
	},
	rightContent: {
		// borderLeft: '1px solid #EEE',
		paddingLeft: '1em',
	},
	rightSection: {
		backgroundColor: '#ebf1f5',
		padding: '0em',
	},
	headerWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1em',
	},
	headerTitle: {
		display: 'table-cell',
		verticalAlign: 'middle',
		paddingRight: '1em',
		width: '1%',
		whiteSpace: 'nowrap',
	},
	header: {
		margin: 0,
	},
	headerOptions: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	headerRight: {
		display: 'table-cell',
		verticalAlign: 'middle',
		width: '1%',
	},
	sideLink: {
		// width: '100%',
		display: 'block',
		width: '200px',
		paddingBottom: '.5em',
	},
	sideAction: {
		textAlign: 'center',
		padding: '1em 0em',
	},
	sideButton: {
		margin: '.5em',
	},

};
