import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, MenuDivider, NonIdealState } from '@blueprintjs/core';
import { ActivityItem, DropdownButton } from 'components';
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
		const filterList = ['All', 'Pubs', 'Journals', 'Users', 'Labels'];

		let followingActivities;
		if (filterMode === 'All') { followingActivities = uniqueActivities; }
		if (filterMode === 'Pubs') { followingActivities = activitiesPubs; }
		if (filterMode === 'Users') { followingActivities = activitiesUsers; }
		if (filterMode === 'Journals') { followingActivities = activitiesJournals; }
		if (filterMode === 'Labels') { followingActivities = activitiesLabels; }

		const globalActivities = activities.global || [];
		const youActivities = activities.you || [];

		// For following and self activities, they will come grouped by Journal, Pub, User, and Label
		// We need to 
		// 1) Search for groups. (Things applied to same target or object within a day's time)
		// 2) Deduplicate for master list (do we de-duplicate for filters?)

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
										<Link to={{ pathname: '/', query: { ...query, mode: 'global', filter: undefined } }} className={mode === 'global' ? 'pt-button pt-active' : 'pt-button'}>Global</Link>
										<Link to={{ pathname: '/', query: { ...query, mode: undefined } }} className={mode === 'following' ? 'pt-button pt-active' : 'pt-button'}>Following</Link>
										<Link to={{ pathname: '/', query: { ...query, mode: 'you', filter: undefined } }} className={mode === 'you' ? 'pt-button pt-active' : 'pt-button'}>You</Link>
									</div>
								</div>
								{mode === 'following' &&
									<div style={styles.headerRight}>
										<DropdownButton 
											content={
												<Menu>
													{filterList.map((filter, index)=> {
														return (
															<li key={'filter-' + index}><Link to={{ pathname: '/', query: { ...query, filter: filter } }} className="pt-menu-item pt-popover-dismiss">
																{filter}{index !== 0 ? ' you Follow ' : ''}
																{filterMode === filter && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
															</Link></li>
														);
													})}
												</Menu>
											}
											title={'Filter'} 
											position={2} />
									</div>
								}
							</div>

							{mode === 'following' && followingActivities.map((activity)=> {
								return <ActivityItem key={'activity-' + activity.id} activity={activity} />;
							})}

							{mode === 'global' && globalActivities.map((activity)=> {
								return <ActivityItem key={'activity-' + activity.id} activity={activity} />;
							})}

							{mode === 'you' && youActivities.map((activity)=> {
								return <ActivityItem key={'activity-' + activity.id} activity={activity} />;
							})}

							{((mode === 'following' && !followingActivities.length) || (mode === 'you' && !youActivities.length) || (mode === 'global' && !globalActivities.length)) &&
								<NonIdealState
									title={'No Activities'}
									visual={'pulse'} />
							}
							
						</div>

						<div style={styles.rightPanel}>
							<div style={styles.rightContent}>
								<h3>Your Pubs</h3>
								{assetPubs.map((pub)=> {
									return <Link key={'pub-link-' + pub.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/pub/' + pub.slug}>{pub.title}</Link>;
								})}

								<h3>Your Journals</h3>
								{assetJournals.map((journal)=> {
									return <Link key={'journal-link-' + journal.id} style={styles.sideLink} className={'pt-text-overflow-ellipsis'} to={'/' + journal.slug}>{journal.name}</Link>;
								})}

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
		borderLeft: '1px solid #EEE',
		paddingLeft: '1em',
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
	
};
