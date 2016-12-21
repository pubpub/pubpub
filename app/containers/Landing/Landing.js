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
		const activities = activitiesData || {};
		const globalActivities = activities.global || [];
		const followingActivities = activities.following || [];
		const selfActivities = activities.self || [];

		const location = this.props.location || {};
		const query = location.query || {};
		const mode = query.mode || 'following';
		const filterMode = query.filter || 'All';
		const filterList = ['All', 'Pubs', 'Journals', 'Users', 'Labels'];

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
										<Link to={{ pathname: '/', query: { ...query, mode: 'global' } }} className={mode === 'global' ? 'pt-button pt-active' : 'pt-button'}>Global</Link>
										<Link to={{ pathname: '/', query: { ...query, mode: undefined } }} className={mode === 'following' ? 'pt-button pt-active' : 'pt-button'}>Following</Link>
										<Link to={{ pathname: '/', query: { ...query, mode: 'you' } }} className={mode === 'you' ? 'pt-button pt-active' : 'pt-button'}>You</Link>
									</div>
								</div>
								<div style={styles.headerRight}>
									<DropdownButton 
										content={
											<Menu>
												{filterList.map((filter, index)=> {
													return (
														<li key={'filter-' + index}><Link to={{ pathname: '/', query: { ...query, filter: filter } }} className="pt-menu-item pt-popover-dismiss">
															{filter}
															{filterMode === filter && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
														</Link></li>
													);
												})}
											</Menu>
										}
										title={'Filter'} 
										position={2} />
								</div>
							</div>

							<ActivityItem />
							<ActivityItem />
							<ActivityItem />
							<ActivityItem />
							<ActivityItem />
							<ActivityItem />

							
						</div>

						<div style={styles.rightPanel}>
							<div style={styles.rightContent}>
								<h3>Your Pubs</h3>

								<ActivityItem />
								<ActivityItem />

								<h3>Your Journals</h3>
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
		// activitiesData: state.activities.toJS(),
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
		maxWidth: '400px',
		width: '25%',
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
	
};
