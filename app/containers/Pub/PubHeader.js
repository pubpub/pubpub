import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
// import dateFormat from 'dateformat';
import { FollowButton } from 'containers';
import { Tag } from 'components';

import PubLabelList from './PubLabelList';


let styles;

export const PubHeader = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		accountId: PropTypes.number,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	render: function() {
		const pub = this.props.pub || {};
		const query = this.props.query;
		const pathname = this.props.pathname;

		const contributors = pub.contributors || [];
		const followers = pub.followers || [];
		const pubFeatures = pub.pubFeatures || [];
		
		const contextJournal = pubFeatures.reduce((previous, current)=> {
			if (!query.context && current.journalId === pub.defaultContext) { return current.journal; }
			if (current.journal.title === query.context) { return current.journal; }
			return previous;
		}, undefined);

		const displayedFeatures = pubFeatures.filter((feature)=> {
			return feature.isDisplayed && (!contextJournal || feature.journalId !== contextJournal.id);
		});

		const followData = followers.reduce((previous, current)=> {
			if (current.id === this.props.accountId) { return current.FollowsPub; }
			return previous;
		}, undefined);

		const globalLabels = pub.labels.filter((label)=> {
			return !label.userId && !label.journalId && !label.pubId;
		});


		return (
			<div style={styles.container}>
				<div style={styles.backgroundContainer} />
				
				<div style={styles.content}>
					{/* ---------- */}
					{/*  Features  */}
					{/* ---------- */}
					<div style={styles.featuresWrapper}>
						{!!displayedFeatures.length &&
							<div style={styles.journalHeader}>
								{false && !!contextJournal &&
									<div>also featured in:</div>
								}
								{displayedFeatures.sort((foo, bar)=> {
									// Sort so that least recent is first in array
									if (foo.createdAt > bar.createdAt) { return 1; }
									if (foo.createdAt < bar.createdAt) { return -1; }
									return 0;
								}).map((feature)=> {
									const journal = feature.journal || {};
									return (
										<Link to={'/' + journal.slug} key={'header-feature-' + feature.journalId} style={styles.journalHeaderTag}>
											<Tag backgroundColor={journal.headerColor} isLarge={true}>{journal.title}</Tag>
										</Link>
									);
								})}
							</div>
						}
					</div>

					{/* ------------ */}
					{/*  Button Box  */}
					{/* ------------ */}
					<div style={styles.buttonsWrapper}>
						<div style={styles.buttonWrapper}>
							<FollowButton
								pubId={pub.id}
								followData={followData}
								followerCount={followers.length}
								followersLink={{ pathname: '/pub/' + pub.slug + '/followers', query: query }}
								dispatch={this.props.dispatch} />
							</div>

							{/*pubDOI &&
								<div style={styles.pubAuthors}>
									DOI: <a href={'https://doi.org/' + pubDOI} target={'_blank'}>{pubDOI}</a>
								</div>
							*/}
					</div>

					{/* ------------ */}
					{/*  Labels  */}
					{/* ------------ */}
					<div style={styles.labelsWrapper}>
						<PubLabelList selectedLabels={globalLabels} pubId={pub.id} rootPubId={pub.id} globalLabels={true} canEdit={pub.canEdit} pathname={pathname} query={query} dispatch={this.props.dispatch} />
					</div>
					
					{/* ------------ */}
					{/*    Title     */}
					{/* ------------ */}
					<div style={styles.title}>
						{pub.title}
					</div>

					{/* ------------ */}
					{/*   Authors    */}
					{/* ------------ */}
					<div style={styles.authorsWrapper}>
							{contributors.filter((contributor)=>{
								return contributor.isAuthor === true;
							}).map((contributor, index, array)=> {
								const user = contributor.user || {};
								return <Link style={styles.authorLink} to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
							})}
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(PubHeader);

styles = {
	container: {
		borderBottom: '1px solid rgba(16, 22, 26, 0.15)',
		position: 'relative',
		overflow: 'auto',
	},
	backgroundContainer: {
		backgroundColor: 'rgba(218, 218, 218, 0.35)',
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: 1,
	},
	content: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '0em 2em',
		position: 'relative',
		zIndex: 2,
	},
	featuresWrapper: {
		margin: '20px 0px',
		minHeight: '1px',
		// backgroundColor: 'rgba(255, 0, 0, 0.25)',
	},
	buttonsWrapper: {
		margin: '20px 0px',
		// backgroundColor: 'rgba(0, 255, 0, 0.25)',
		float: 'right',
		textAlign: 'right',
		paddingLeft: '1em'
	},
	labelsWrapper: {
		margin: '20px 0px 20px',
		// backgroundColor: 'rgba(125, 255, 0, 0.25)',
	},
	title: {
		// backgroundColor: 'rgba(25, 25, 120, 0.25)',
		
		fontSize: '2.25em',
		color: '#10161A',
		letterSpacing: '-1px',
		fontWeight: 'bold',
		margin: '20px 0px'
	},
	authorsWrapper: {
		// backgroundColor: 'rgba(125, 125, 50, 0.25)',	
		margin: '20px 0px 50px',
		fontStyle: 'italic',
		fontSize: '0.9em',
		color: '#5C7080',
		letterSpacing: '0px',
		lineHeight: '27px',
	},
	authorLink: {
		color: 'inherit',
	},
};
