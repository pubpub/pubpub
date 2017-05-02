import React, { PropTypes } from 'react';
import Radium from 'radium';
// import { Link } from 'react-router';
import Link from 'components/Link/Link';
import { FormattedRelative } from 'react-intl';
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

	renderAttachment: function(avatar, link, string, details, id, customDomain) {
		return (
			<div style={styles.objectWrapper} key={'attachment-' + id}>
				<div style={styles.imageWrapper} className={'opacity-on-hover-child'}>
					<Link to={link} customDomain={customDomain}>
						<img src={'https://jake.pubpub.org/unsafe/50x50/' + avatar} style={styles.largeImage} alt={string} />
					</Link>
				</div>
				
				<div style={styles.detailsWrapper}>
					<h5 style={styles.objectTitle}><Link to={link} style={styles.link} customDomain={customDomain}>{string}</Link></h5>
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

		const actorAvatar = actor.avatar || 'https://assets.pubpub.org/_site/label.png';
		const targetAvatar = target.avatar || 'https://assets.pubpub.org/_site/label.png';
		const objectAvatar = object.avatar || 'https://assets.pubpub.org/_site/label.png';

		const makeString = function(item) { 
			return item.title || item.firstName + ' ' + item.lastName; 
		};
		const actorString = makeString(actor);
		const targetString = makeString(target);
		const objectString = makeString(object);

		const makeLink = function(item) { 
			return ('username' in item && '/user/' + item.username)
				|| ('about' in item && '/' + item.slug)
				|| ('isPublished' in item && '/pub/' + item.slug)
				|| '/label/' + item.slug;
				// have to handle discussion links
		};
		const actorLink = makeLink(actor);
		const targetLink = makeLink(target);
		const objectLink = makeLink(object);

		const actorDetails = actor.description || actor.bio;
		const targetDetails = target.description || target.bio;
		const objectDetails = object.description || object.bio;

		// const verbsWithObjects = ['publishedPub', 'newDiscussion', 'newReply', 'newPubLabel', 'createdJournal', 'featuredPub'];
		const verbsWithObjects = ['publishedPub', 'newPubLabel', 'createdJournal', 'featuredPub']; // Removing discussions until we decide how to render/truncate (also how to poulate version data efficiently)
		const showObject = verbsWithObjects.includes(verb);

		const buildLink = function(link, string) { return <Link to={link} style={styles.link}>{string}</Link>; };
		const actorNode = <Link to={actorLink} style={styles.link} customDomain={actor.customDomain}>{actorString}</Link>;
		const targetNode = <Link to={targetLink} style={styles.link} customDomain={target.customDomain}>{targetString}</Link>;
		const objectNode = <Link to={objectLink} style={styles.link} customDomain={object.customDomain}>{objectString}</Link>;

		return (
			<div style={styles.container} className={'opacity-on-hover-parent'}>
				<div style={styles.tableWrapper}>
					<div style={styles.imageWrapper} className={'opacity-on-hover-child'}>
						<Link to={actorLink}>
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + actorAvatar} style={styles.smallImage} alt={actorString} />
						</Link>
					</div>
					
					<div style={styles.detailsWrapper}>
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
								return <div>{actorNode} added a new {buildLink(targetLink + '?discussion=' + object.threadNumber, 'discussion')} to {targetNode}</div>;
							case 'newReply': 
								return <div>{actorNode} {buildLink(targetLink + '?discussion=' + object.threadNumber, 'replied')} to a discussion on {targetNode}</div>;
							case 'newPubLabel': 
								return <div>{actorNode} added a pub to {targetNode}</div>;
							case 'invitedReviewer': 
								return <div>{actorNode} invited {objectNode} to review {targetNode}</div>;
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
								return <div>{actorNode} created a new page, {buildLink(actorLink + '/page/' + target.slug, targetString)}</div>;
							default: 
								return <div />;
							}
						})()}

					</div>
					<div style={styles.dateWrapper}>
						<FormattedRelative value={activity.createdAt} />
					</div>
				</div>

				{showObject &&
					<div style={styles.attachmentWrapper}>
						<div style={styles.tableWrapper}>
							<div style={styles.imageWrapper}>
								<div style={styles.smallImage} />
							</div>
							<div style={styles.tableCell}>
								{(() => {
									switch (verb) {
									case 'publishedPub':
										return this.renderAttachment(targetAvatar, targetLink, targetString, targetDetails, activity.id);
									case 'newDiscussion': 
										return this.renderAttachment(targetAvatar, objectLink, objectString, objectDetails, activity.id);
									case 'newReply': 
										return this.renderAttachment(targetAvatar, objectLink, '', objectDetails, activity.id);
									case 'newPubLabel': 
										return this.renderAttachment(objectAvatar, objectLink, objectString, objectDetails, activity.id);
									case 'createdJournal': 
										return this.renderAttachment(targetAvatar, targetLink, targetString, targetDetails, activity.id, target.customDomain);
									case 'featuredPub': 
										return this.renderAttachment(targetAvatar, targetLink, targetString, targetDetails, activity.id);
									default: 
										return <div />;
									}
								})()}
							</div>
							<div style={[styles.dateWrapper, styles.hidden]}>
								<FormattedRelative value={activity.createdAt} />
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
