import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
let styles = {};

export const ActivityItem = React.createClass({
	propTypes: {
		activity: PropTypes.object,
	},

	// getInitialState() {
	// 	return {
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	render: function() {
		const activity = this.props.activity || {};
		

		const actor = activity.actorPub || activity.actorUser || activity.actorJournal || activity.actorLabel || {};
		const verb = activity.verb || '';
		const target = activity.targetPub || activity.targetUser || activity.targetJournal || activity.targetLabel || {};
		const object = activity.objectPub || activity.objectUser || activity.objectJournal || activity.objectLabel || {};

		const actorImage = actor.image || actor.previewImage || actor.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png';

		const makeString = function(item) { 
			return item.title || item.name || item.firstName + ' ' + item.lastName; 
		};
		const actorString = makeString(actor);
		const targetString = makeString(target);
		const objectString = makeString(object);

		const makeLink = function(item) { 
			return (item.username && '/user/' + item.username)
				|| (item.logo && '/' + item.slug)
				|| (item.previewImage && '/pub/' + item.slug)
				|| '/label/' + item.title;
		};
		const actorLink = makeLink(actor);
		const targetLink = makeLink(target);
		const objectLink = makeLink(object);

		return (
			<div style={styles.container}>
				<div style={styles.imageWrapper}>
					<Link to={actorLink}>
						<img src={actorImage} style={styles.image} alt={actorString} />
					</Link>
				</div>
				
				<div style={styles.detailsWrapper}>
					<div style={styles.date}>{dateFormat(activity.createdAt, 'mmmm dd, yyyy HH:mm')}</div>
					
					<Link to={actorLink} style={styles.link}>{actorString}</Link>
					<span> {verb} </span>
					<Link to={targetLink} style={styles.link}>{targetString}</Link>
					
				</div>
			</div>
		);
	}
});

export default Radium(ActivityItem);

styles = {
	container: {
		display: 'table',
		borderTop: '1px solid #EEE',
		marginTop: '0.5em',
		paddingTop: '0.5em', 
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingRight: '1em',
		width: '1%',
	},
	detailsWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	image: {
		width: '35px',
	},
	link: {
		fontWeight: 'bold',
	},
	date: {
		fontSize: '0.9em',
		color: '#777',
	},
};
