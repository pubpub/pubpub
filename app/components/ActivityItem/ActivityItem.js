import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
let styles = {};


export const ActivityItem = React.createClass({
	propTypes: {
		activity: PropTypes.object,
		activities: PropTypes.array,
	},

	// getInitialState() {
	// 	return {
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	renderAttachment: function(image, link, string, details) {
		return (
			<div style={styles.objectWrapper}>
				<div style={styles.imageWrapper}>
					<Link to={link}>
						<img src={image} style={styles.largeImage} alt={string} />
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
		// See if it's single or a group
		// If a group, find the right actor, target, object.
		// Find the right string, based on group or not and Verb.
		// Lay out element.

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
				|| (item.icon && '/' + item.slug)
				|| (item.previewImage && '/pub/' + item.slug)
				|| '/label/' + item.title;
				// have to handle discussion links
		};
		const actorLink = makeLink(actor);
		const targetLink = makeLink(target);
		const objectLink = makeLink(object);

		const actorDetails = actor.description || actor.shortDescription || actor.bio;
		const targetDetails = target.description || target.shortDescription || target.bio;
		const objectDetails = object.description || object.shortDescription || object.bio;

		const verbsWithObjects = ['publishedPub', 'newDiscussion', 'newReply', 'newPubLabel', 'createdJournal', 'featuredPub'];
		const showObject = verbsWithObjects.includes(verb);

		const buildLink = function(link, string) { return <Link to={link} style={styles.link}>{string}</Link>; };
		const actorNode = <Link to={actorLink} style={styles.link}>{actorString}</Link>;
		const targetNode = <Link to={targetLink} style={styles.link}>{targetString}</Link>;
		const objectNode = <Link to={objectLink} style={styles.link}>{objectString}</Link>;

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
						
						{(() => {
							switch (verb) {
							case 'followedUser': 
							case 'followedPub': 
							case 'followedJournal': 
							case 'followedLabel': 
								return <div>{actorNode} followed {targetNode}</div>;
							case 'publishedPub':
								return <div>{actorNode} published a pub</div>;
							case 'forkedPub': 
								return <div>{actorNode} forked {targetNode}</div>;
							case 'addedContributor': 
								return <div>{actorNode} added {objectNode} as a contributor on {targetNode}</div>;
							case 'newVersion': 
								return <div>{actorNode} published a new version of {targetNode}</div>;
							case 'newDiscussion': 
								return <div>{actorNode} added a new {buildLink(targetLink + '?discussionId=' + object.id, 'discussion')} to {targetNode}</div>;
							case 'newReply': 
								return <div>{actorNode} {buildLink(targetLink + '?discussionId=' + object.id, 'replied')} to a discussion on {targetNode}</div>;
							case 'newPubLabel': 
								return <div>{actorNode} added a pub to {targetNode}</div>;
							case 'invitedReviewer': 
								return <div>{actorNode} invited {objectNode} to {targetNode}</div>;
							case 'acceptedReviewInvitation': 
								return <div>{actorNode} accepted {objectNode}'s invitation to review {targetNode}</div>;
							case 'submittedPub': 
								return <div>{actorNode} submitted {objectNode} to {targetNode}</div>;
							case 'createdJournal': 
								return <div>{actorNode} created a journal</div>;
							case 'addedAdmin': 
								return <div>{actorNode} added {objectNode} as an admin of {targetNode}</div>;
							case 'featuredPub': 
								return <div>{actorNode} featured a pub</div>;
							case 'createdJournalLabel': 
								return <div>{actorNode} created a new collection, {buildLink(actorLink + '/collection/' + target.title, targetString)}</div>;
							default: 
								return <div />;
							}
						})()}

					</div>
				</div>

				{showObject &&
					<div style={styles.attachmentWrapper}>
						{(() => {
							switch (verb) {
							case 'publishedPub':
								return this.renderAttachment(targetImage, targetLink, targetString, targetDetails);
							case 'newDiscussion': 
								return this.renderAttachment(targetImage, objectLink, objectString, objectDetails);
							case 'newReply': 
								return this.renderAttachment(targetImage, objectLink, '', objectDetails);
							case 'newPubLabel': 
								return this.renderAttachment(objectImage, objectLink, objectString, objectDetails);
							case 'createdJournal': 
								return this.renderAttachment(targetImage, targetLink, targetString, targetDetails);
							case 'featuredPub': 
								return this.renderAttachment(targetImage, targetLink, targetString, targetDetails);
							default: 
								return <div />;
							}
						})()}
					</div>
				}
				
			</div>
		);
	}
});

export default Radium(ActivityItem);

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
