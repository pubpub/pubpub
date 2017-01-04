import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
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
	
	renderAttachment: function(verb, image, link, string, details, id) {
		let adjustSize = {};
		if (verb === 'newPubLabel') {
			adjustSize = { width: '20px' };
		}
		return (
			<div style={styles.objectWrapper} key={'attachment-' + id}>
				<div style={styles.imageWrapper} className={'opacity-on-hover-child'}>
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
		// Activities either all have the same actor and object, same actor and target, or same target
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
				actorImage: actor.image || actor.previewImage || actor.icon || 'https://assets.pubpub.org/_site/label.png',
				targetImage: target.image || target.previewImage || target.icon || 'https://assets.pubpub.org/_site/label.png',
				objectImage: object.image || object.previewImage || object.icon || 'https://assets.pubpub.org/_site/label.png',
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
			<div style={styles.container} className={'opacity-on-hover-parent'}>
				<div style={styles.tableWrapper}>
					<div style={styles.imageWrapper} className={'opacity-on-hover-child'}>
						<Link to={headerActivity.actorLink}>
							<img src={headerActivity.actorImage} style={styles.smallImage} alt={headerActivity.actorString} />
						</Link>
					</div>
					
					<div style={styles.detailsWrapper}>
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
								return <div>{activities.length} new discussions were added to {targetNode}</div>;
							case 'addedContributor':
								return <div>{actorNode} added {activities.length} contributors to {targetNode}</div>;
							case 'addedAdmin':
								return <div>{actorNode} added {activities.length} admins to {targetNode}</div>;
							case 'newReply': 
								return <div>{activities.length} people replied to a {buildLink(targetLink + '?discussion=' + object.threadNumber, 'discussion')} on {targetNode}</div>;
							case 'newPubLabel': 
								return <div>{actorNode} added {objectNode} to {activities.length} labels</div>;
							case 'featuredPub': 
								return <div>{actorNode} featured {activities.length} pubs</div>;
							default: 
								return <div />;
							}
						})()}

					</div>
					<div style={styles.dateWrapper}>
						<FormattedRelative value={headerActivity.createdAt} />
					</div>
				</div>

				<div style={styles.attachmentWrapper}>
					

					<div style={styles.tableWrapper}>
						<div style={styles.imageWrapper}>
							<div style={styles.smallImage} />
						</div>
						<div style={styles.tableCell}>
							{activitiesContent.map((activity)=> {
								const { actor, verb, target, object, actorImage, targetImage, objectImage, actorString, targetString, objectString, actorLink, targetLink, objectLink, actorDetails, targetDetails, objectDetails, actorNode, targetNode, objectNode } = activity;
								switch (verb) {
								// case 'publishedPub':
								// 	return this.renderAttachment(targetImage, targetLink, targetString, targetDetails);
								case 'followedUser': 
								case 'followedPub': 
								case 'followedJournal': 
								case 'followedLabel': 
									return this.renderAttachment(verb, targetImage, targetLink, targetString, targetDetails, activity.id);
								case 'newDiscussion': 
									return this.renderAttachment(verb, actorImage, (targetLink + '?discussion=' + object.threadNumber), objectString, objectDetails, activity.id);
								case 'addedContributor': 
									return this.renderAttachment(verb, objectImage, objectLink, objectString, objectDetails, activity.id);
								case 'addedAdmin': 
									return this.renderAttachment(verb, objectImage, objectLink, objectString, objectDetails, activity.id);
								case 'newReply': 
									return this.renderAttachment(verb, actorImage, objectLink, '', objectDetails, activity.id);
								case 'newPubLabel': 
									return this.renderAttachment(verb, targetImage, targetLink, targetString, '', activity.id);
								case 'featuredPub': 
									return this.renderAttachment(verb, targetImage, targetLink, targetString, targetDetails, activity.id);
								default: 
									return <div />;
								}
							})}
						</div>
						<div style={[styles.dateWrapper, styles.hidden]}>
							<FormattedRelative value={headerActivity.createdAt} />
						</div>
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(ActivityGroup);

styles = {
	container: {
		borderTop: '1px solid #EEE',
		marginTop: '0.75em',
		paddingTop: '0.75em', 
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
	tableCell: {
		display: 'table-cell',
	},
	objectWrapper: {
		display: 'table',
		marginBottom: '.5em',
	},
	detailsWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		lineHeight: '1.2em',
		paddingTop: '.5em',
	},
	dateWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		lineHeight: '1.2em',
		paddingTop: '.5em',
		width: '1%',
		whiteSpace: 'nowrap',
		fontSize: '0.9em',
		paddingLeft: '1em',
		color: '#777',
	},
	smallImage: {
		width: '30px',
		borderRadius: '2px',
	},
	largeImage: {
		width: '50px',
		borderRadius: '2px',
	},
	link: {
		fontWeight: 'bold',
	},
	attachmentWrapper: {
		margin: '.75em 0em 0em',
	},
	objectTitle: {
		margin: 0,
	},
	hidden: {
		opacity: '0',
		pointerEvents: 'none',
	}
};
