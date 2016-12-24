import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
let styles = {};

export const ActivityGroup = React.createClass({
	propTypes: {
		activities: PropTypes.array,
	},

	// getInitialState() {
	// 	return {
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},
	
	renderAttachment: function(image, link, string, details, id) {
		const adjustSize = image === 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png' ? { width: '20px' } : {};
		return (
			<div style={styles.objectWrapper} key={'attachment-' + id}>
				<div style={styles.imageWrapper}>
					<Link to={link}>
						<img src={image} style={[styles.largeImage, adjustSize]} alt={string} />
					</Link>
				</div>
				
				<div style={styles.detailsWrapper}>
					<h5 style={styles.objectTitle}><Link to={link} style={styles.link}>{string}</Link></h5>
					<p>{details}</p>
				</div>
			</div>
		);
	},

	render: function() {
		// Activities either all have the same actor and object, or all have the same target
		const activities = this.props.activities || [];
		
		const makeString = function(item) { 
			return item.title || item.name || item.firstName + ' ' + item.lastName; 
		};

		const makeLink = function(item) { 
			return (item.username && '/user/' + item.username)
				|| (item.icon && '/' + item.slug)
				|| (item.previewImage && '/pub/' + item.slug)
				|| '/label/' + item.title;
				// have to handle discussion links
		};

		const buildLink = function(link, string) { return <Link to={link} style={styles.link}>{string}</Link>; };

		const activitiesContent = activities.map((activity)=> {
			const actor = activity.actorPub || activity.actorUser || activity.actorJournal || activity.actorLabel || {};
			const verb = activity.verb || '';
			const target = activity.targetPub || activity.targetUser || activity.targetJournal || activity.targetLabel || {};
			const object = activity.objectPub || activity.objectUser || activity.objectJournal || activity.objectLabel || {};
			return {
				...activity,
				actor: actor,
				verb: verb,
				target: target,
				object: object,
				actorImage: actor.image || actor.previewImage || actor.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png',
				targetImage: target.image || target.previewImage || target.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png',
				objectImage: object.image || object.previewImage || object.icon || 'http://plainicon.com/dboard/userprod/2803_dd580/prod_thumb/plainicon.com-48762-256px-1a9.png',
				actorString: makeString(actor),
				targetString: makeString(target),
				objectString: makeString(object),

				actorLink: makeLink(actor),
				targetLink: makeLink(target),
				objectLink: makeLink(object),

				actorDetails: actor.description || actor.shortDescription || actor.bio,
				targetDetails: target.description || target.shortDescription || target.bio,
				objectDetails: object.description || object.shortDescription || object.bio,
				
				actorNode: <Link to={makeLink(actor)} style={styles.link}>{makeString(actor)}</Link>,
				targetNode: <Link to={makeLink(target)} style={styles.link}>{makeString(target)}</Link>,
				objectNode: <Link to={makeLink(object)} style={styles.link}>{makeString(object)}</Link>,
			};
		});

		
		const headerActivity = activitiesContent[0];
		return (
			<div style={styles.container}>
				<div style={styles.tableWrapper}>
					<div style={styles.imageWrapper}>
						<Link to={headerActivity.actorLink}>
							<img src={headerActivity.actorImage} style={styles.smallImage} alt={headerActivity.actorString} />
						</Link>
					</div>
					
					<div style={styles.detailsWrapper}>
						<div style={styles.date}>{dateFormat(headerActivity.createdAt, 'mmmm dd, yyyy HH:mm')}</div>
						
						{(() => {
							const { actor, verb, target, object, actorImage, targetImage, objectImage, actorString, targetString, objectString, actorLink, targetLink, objectLink, actorDetails, targetDetails, objectDetails, actorNode, targetNode, objectNode } = headerActivity;
							switch (verb) {
							// case 'followedUser': 
							// case 'followedPub': 
							// case 'followedJournal': 
							// case 'followedLabel': 
								// return <div>{actorNode} followed {targetNode}</div>;
							case 'followedUser': 
								return <div>{actorNode} followed {activities.length} people</div>;
							case 'followedPub': 
								return <div>{actorNode} followed {activities.length} pubs</div>;
							case 'followedJournal': 
								return <div>{actorNode} followed {activities.length} journals</div>;
							case 'followedLabel': 
								return <div>{actorNode} followed {activities.length} labels</div>;
							case 'newDiscussion': 
								return <div>{activities.length} people added new discussions to {targetNode}</div>;
							case 'addedContributor':
								return <div>{actorNode} added {activities.length} contributors to {targetNode}</div>;
							case 'newReply': 
								return <div>{activities.length} people replied to a discussion on {targetNode}</div>;
							case 'newPubLabel': 
								return <div>{actorNode} added {objectNode} to {activities.length} labels</div>;
							case 'featuredPub': 
								return <div>{actorNode} featured {activities.length} pubs</div>;
							default: 
								return <div />;
							}
						})()}

					</div>
				</div>

				<div style={styles.attachmentWrapper}>
					{activitiesContent.map((activity)=> {
						const { actor, verb, target, object, actorImage, targetImage, objectImage, actorString, targetString, objectString, actorLink, targetLink, objectLink, actorDetails, targetDetails, objectDetails, actorNode, targetNode, objectNode } = activity;
						switch (verb) {
						// case 'publishedPub':
						// 	return this.renderAttachment(targetImage, targetLink, targetString, targetDetails);
						case 'followedUser': 
						case 'followedPub': 
						case 'followedJournal': 
						case 'followedLabel': 
							return this.renderAttachment(targetImage, targetLink, targetString, targetDetails, activity.id);
						case 'newDiscussion': 
							return this.renderAttachment(actorImage, objectLink, objectString, objectDetails, activity.id);
						case 'addedContributor': 
							return this.renderAttachment(objectImage, objectLink, objectString, objectDetails, activity.id);
						case 'newReply': 
							return this.renderAttachment(actorImage, objectLink, '', objectDetails, activity.id);
						case 'newPubLabel': 
							return this.renderAttachment(targetImage, targetLink, targetString, '', activity.id);
						case 'featuredPub': 
							return this.renderAttachment(targetImage, targetLink, targetString, targetDetails, activity.id);
						default: 
							return <div />;
						}
					})}
				</div>
				
			</div>
		);
	}
});

export default Radium(ActivityGroup);

styles = {
	container: {
		borderTop: '1px solid #EEE',
		marginTop: '1.5em',
		paddingTop: '1.5em', 
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingRight: '1em',
		width: '1%',
	},
	tableWrapper: {
		display: 'table',
	},
	objectWrapper: {
		display: 'table',
		marginBottom: '.5em',
	},
	detailsWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	smallImage: {
		width: '30px',
		borderRadius: '2px',
	},
	largeImage: {
		width: '55px',
		borderRadius: '2px',
	},
	link: {
		fontWeight: 'bold',
	},
	date: {
		fontSize: '0.9em',
		color: '#777',
	},
	attachmentWrapper: {
		margin: '.75em 0em 0em 1em',
		padding: '0em 0em 0em 1em',
		borderLeft: '2px solid #EEE',
	},
	objectTitle: {
		margin: 0,
	},
};
