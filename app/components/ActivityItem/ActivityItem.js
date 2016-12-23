import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
let styles = {};

const verbStrings = {
	'label/added': 'added a pub to',
	'created': 'created',
};
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
		const targetImage = target.image || target.previewImage || target.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png';
		const objectImage = object.image || object.previewImage || object.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png';

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

		const objectDetails = object.description || object.shortDescription || object.bio;
		const showObject = !!object.id;
		return (
			<div style={styles.container}>
				<div style={styles.tableWrapper}>
					<div style={styles.imageWrapper}>
						<Link to={actorLink}>
							<img src={actorImage} style={styles.smallImage} alt={actorString} />
						</Link>
					</div>
					
					<div style={styles.detailsWrapper}>
						<div style={styles.date}>{dateFormat(activity.createdAt, 'mmmm dd, yyyy HH:mm')}</div>
						
						<Link to={actorLink} style={styles.link}>{actorString}</Link>
						<span> {verbStrings[verb]} </span>
						<Link to={targetLink} style={styles.link}>{targetString}</Link>
						
					</div>
				</div>

				{showObject &&
					<div style={styles.attachmentWrapper}>
						<div style={styles.tableWrapper}>
							<div style={styles.imageWrapper}>
								<Link to={objectLink}>
									<img src={objectImage} style={styles.largeImage} alt={objectString} />
								</Link>
							</div>
							
							<div style={styles.detailsWrapper}>
								<h5 style={styles.objectTitle}><Link to={objectLink} style={styles.link}>{objectString}</Link></h5>
								<p>{objectDetails}</p>
								
								
							</div>
						</div>
					</div>
				}
				
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
	smallImage: {
		width: '30px',
	},
	largeImage: {
		width: '45px',
	},
	link: {
		fontWeight: 'bold',
	},
	date: {
		fontSize: '0.9em',
		color: '#777',
	},
	attachmentWrapper: {
		margin: '.75em 0em 0em .5em',
		padding: '0em 0em 1em .5em',
		borderLeft: '2px solid #EEE',
	},
	objectTitle: {
		margin: 0,
	},
};
