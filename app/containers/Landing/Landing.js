import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, MenuDivider, NonIdealState } from '@blueprintjs/core';
import { ActivityItem, ActivityGroup, DropdownButton } from 'components';
import { getActivities } from './actions';

let styles;

export const Landing = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		activitiesData: PropTypes.object,
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

	render() {
		const accountData = this.props.accountData || {};
		const user = accountData.user || {};

		const activitiesData = this.props.activitiesData || {};
		const activities = activitiesData.activities || {};

		const activitiesPubs = activities.pubs || [];
		const activitiesUsers = activities.users || [];
		const activitiesJournals = activities.journals || [];
		const activitiesLabels = activities.labels || [];

		const uniqueIDs = {};
		const uniqueActivities = [...activitiesUsers, ...activitiesPubs, ...activitiesJournals, ...activitiesLabels].filter((activity)=>{
			if (activity.id in uniqueIDs) { return false; }
			uniqueIDs[activity.id] = true;
			return true;
		});

		const myActivitiesPubs = activities.myPubs || [];
		const myActivitiesUsers = activities.myUsers || [];
		const myActivitiesJournals = activities.myJournals || [];

		const myUniqueIDs = {};
		const myUniqueActivities = [...myActivitiesUsers, ...myActivitiesPubs, ...myActivitiesJournals].filter((activity)=>{
			if (activity.id in myUniqueIDs) { return false; }
			myUniqueIDs[activity.id] = true;
			return true;
		});


		// const globalActivities = activities.global || [];
		// const followingActivities = activities.following || [];
		// const selfActivities = activities.self || [];

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

		// const globalActivities = activities.global || [];
		// const youActivities = activities.you || [];


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
				'newReply', // 13 people replied to Discussion
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
					<div>
						<h1>Welcome to PubPub</h1>
						About section here!
					</div>
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
										<Link to={{ pathname: '/', query: { ...query, mode: 'you', filter: undefined } }} className={mode === 'you' ? 'pt-button pt-active' : 'pt-button'}>Your Things</Link>
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
										title={'Filter: ' + filterMode} 
										position={2} />
								</div>
							</div>

							{realActivities.map((activity)=> {
								if (Array.isArray(activity)) {
									return <ActivityGroup key={'activityGroup-' + activity[0].id} activities={activity} />;	
								}
								return <ActivityItem key={'activity-' + activity.id} activity={activity} />;
							})}

							{!realActivities.length &&
								<NonIdealState
									title={'No Activities'}
									visual={'pulse'} />
							}
							
						</div>

						<div style={styles.rightPanel}>
							<div style={styles.rightContent}>
								<div style={styles.rightSection} className={'pt-card pt-elevation-0'}>
									<div className="pt-dialog-header">
										{/* <span className="pt-icon-large pt-icon-application" /> */}
										<h5>Your Pubs</h5>
										<Link to={'/pubs/create'} className={'pt-button pt-icon-add'} style={styles.sideButton}>New</Link>
									</div>
									<div className="pt-dialog-body">
										{assetPubs.map((pub)=> {
											return <Link key={'pub-link-' + pub.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/pub/' + pub.slug}>{pub.title}</Link>;
										})}

										{/*
										<div style={styles.sideAction}>
											<Link to={'pubs/create'} className={'pt-button pt-fill pt-intent-primary'}>New Pub</Link>	
										</div>
										*/}
									</div>
										
									
								</div>

								<div style={styles.rightSection} className={'pt-card pt-elevation-0'}>
									<div className="pt-dialog-header">
										{/* <span className="pt-icon-large pt-icon-applications" /> */}
										<h5>Your Journals</h5>
										<Link to={'/journals/create'} className={'pt-button pt-icon-add'} style={styles.sideButton}>New</Link>
									</div>
									<div className="pt-dialog-body">
										{assetJournals.map((journal)=> {
											return <Link key={'journal-link-' + journal.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/' + journal.slug}>{journal.name}</Link>;
										})}

										{/* 
										<div style={styles.sideAction}>
											<Link to={'journals/create'} className={'pt-button pt-fill pt-intent-primary'}>New Journal</Link>	
										</div> 
										*/}
									</div>
								</div>
								

							</div>
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
	};
}

export default connect(mapStateToProps)(Landing);

styles = {
	container: {
		padding: '1.5em',
		width: 'calc(100% - 3em)',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	activitiesTable: {
		display: 'table',
		width: '100%',
	},
	leftPanel: {
		display: 'table-cell',
	},
	rightPanel: {
		display: 'table-cell',
		paddingLeft: '1em',
		width: '1%',
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
