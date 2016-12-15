import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link, browserHistory } from 'react-router';
import { StickyContainer, Sticky } from 'react-sticky';
import dateFormat from 'dateformat';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import PubDocument from './PubDocument';
import PubContributors from './PubContributors';
import PubFiles from './PubFiles';
import PubJournals from './PubJournals';
import PubSettings from './PubSettings';
import PubVersions from './PubVersions';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussion from './PubDiscussion';
import PubReviewers from './PubReviewers';
import PubLabelList from './PubLabelList';

import { getPubData } from './actions';

let styles;

export const Pub = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	// statics: {
	// 	readyOnActions: function(dispatch, params) {
	// 		return Promise.all([
	// 			dispatch(getPubData(params.slug))
	// 		]);
	// 	}
	// },

	getInitialState() {
		return {
			canGoBack: false,
		};
	},

	componentWillMount() {
		// Need to check here so that getUser doesn't make a fetch twice
		const pub = this.props.pubData.pub || {};
		const params = this.props.params || {};
		if (this.props.pubData.pub !== null && pub.slug !== params.slug) {
			this.props.dispatch(getPubData(params.slug));
		}
	},
	
	componentWillReceiveProps(nextProps) {
		const lastPanel = this.props.location.query.panel;
		const nextPanel = nextProps.location.query.panel;
		// const lastDiscussion = this.props.location.query.discussion;
		// const nextDiscussion = nextProps.location.query.discussion;
		const lastPathname = this.props.location.pathname;
		const nextPathname = nextProps.location.pathname;

		if (!lastPanel && nextPanel && lastPathname === nextPathname) {
			this.setState({ canGoBack: true });
		} else {
			this.setState({ canGoBack: false });
		}
	},

	

	goBack: function() {
		// Note, this breaks if a user directly navigates to a discussion, clicks 'back' (rendering canGoBack = true), and then navigates back twice.
		// We need a way to turn canGoBack off again, but that feels a bit cumbersome at the moment.
		// Seems to be an open bug on react-router: https://github.com/ReactTraining/react-router/issues/408
		if (this.state.canGoBack) {
			browserHistory.goBack();
		} else {
			const query = this.props.location.query;
			const pathname = this.props.location.pathname;
			browserHistory.push({
				pathname: pathname,
				query: { ...query, panel: undefined, discussion: undefined } 
			});
		}
	},

	render() {
		const pubData = this.props.pubData.pub || {};
		if (!pubData.title && !this.props.pubData.error) {
			return <div>Loading</div>;
		}
		if (!pubData.title && this.props.pubData.error) {
			return <div>Error</div>;
		}

		const currentFile = this.props.params.filename;
		const meta = currentFile ? 'files' : this.props.params.meta;
		const query = this.props.location.query;
		const pathname = this.props.location.pathname;
		const panel = query.panel;
		const queryDiscussion = query.discussion;
		const discussions = pubData.discussions || [];
		const contributors = pubData.contributors || [];
		const invitedReviewers = pubData.invitedReviewers || [];
		const versions = pubData.versions || [];
		const pubSubmits = pubData.pubSubmits || [];
		const pubFeatures = pubData.pubFeatures || [];
		const labelsData = pubData.pubLabels || [];

		// Might have to sort these if it isn't in chronological order
		const currentVersion = versions.reduce((previous, current)=> {
			if (query.version === String(current.id)) { return current; }
			return previous;
		}, versions[versions.length - 1] || {});

		const currentFiles = currentVersion.files || [];
		const hasDocument = currentFiles.reduce((previous, current)=> {
			if (current.name === 'main.md') { return true; }
			return previous;
		}, false);

		// Populate parent discussions with their children
		const tempArray = [...discussions];
		tempArray.forEach((discussion)=> {
			discussion.children = tempArray.filter((child)=> {
				return (child.replyParentPubId === discussion.id);
			});
			return discussion;
		});

		// Add a discussionsIndex value that we'll use to number discussions.
		const discussionsData = discussions.filter((discussion)=> {
			return discussion.replyParentPubId === pubData.id;
		}).map((discussion, index)=>{
			return { ...discussion, discussionIndex: index + 1 };
		});
		
		const activeDiscussion = discussionsData.reduce((previous, current)=> {
			if (queryDiscussion === String(current.discussionIndex)) { return current; }
			return previous;
		}, {});

		const metaData = {
			title: (pubData.title || this.props.params.slug) + ' · PubPub',
			meta: [
				{ property: 'og:title', content: pubData.title },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: pubData.description },
				{ property: 'og:url', content: 'https://www.pubpub.org/pub/' + pubData.slug },
				{ property: 'og:image', content: pubData.previewImage },
				{ property: 'og:image:url', content: pubData.previewImage },
				{ property: 'og:image:width', content: '500' },
				{ property: 'article:published_time', content: pubData.lastUpdated || pubData.createDate },
				{ property: 'article:modified_time', content: pubData.lastUpdated },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: pubData.title },
				{ name: 'twitter:description', content: pubData.description || pubData.title },
				{ name: 'twitter:image', content: pubData.previewImage },
				{ name: 'twitter:image:alt', content: 'Preview image for ' + pubData.title }
			]
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{/* ---------- */}
				{/* Left Panel */}
				{/* ---------- */}
				<div style={styles.left}>

					<h1 style={styles.pubTitle}>{pubData.title}</h1>
					
					<div style={{ paddingLeft: '1em' }}>
						<PubLabelList selectedLabels={pubData.labels} pubId={pubData.id} rootPubId={pubData.id} globalLabels={true} canEdit={true} pathname={pathname} query={query} dispatch={this.props.dispatch} />	
					</div>
					
					<div style={styles.pubAuthors}>
						{contributors.filter((contributor)=>{
							return contributor.isAuthor === true;
						}).map((contributor, index, array)=> {
							const user = contributor.user || {};
							return <Link to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
						})}
					</div>

					<div style={styles.pubAuthors}>
						{dateFormat(currentVersion.createdAt, 'mmmm dd, yyyy')}
					</div>

					{/* ------- */}
					{/* Nav Bar */}
					{/* ------- */}
					<div style={styles.nav}>
						<Link to={{ pathname: '/pub/' + this.props.params.slug, query: query }}><div style={[styles.navItem, (!meta || meta === 'files') && styles.navItemActive]} className={'bottomShadowOnHover'}>Content</div></Link>
						{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/versions', query: query }}><div style={[styles.navItem, meta === 'versions' && styles.navItemActive]} className={'bottomShadowOnHover'}>Versions ({versions.length})</div></Link> }
						<Link to={{ pathname: '/pub/' + this.props.params.slug + '/contributors', query: query }}><div style={[styles.navItem, meta === 'contributors' && styles.navItemActive]} className={'bottomShadowOnHover'}>Contributors ({contributors.length})</div></Link>
						{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/journals', query: query }}><div style={[styles.navItem, meta === 'journals' && styles.navItemActive]} className={'bottomShadowOnHover'}>Journals</div></Link> }
						<Link to={{ pathname: '/pub/' + this.props.params.slug + '/settings', query: query }}><div style={[styles.navItem, meta === 'settings' && styles.navItemActive]} className={'bottomShadowOnHover'}>Settings</div></Link>
					</div>

					{/* ------- */}
					{/* Content */}
					{/* ------- */}
					{!meta && hasDocument && 
						<PubDocument
							versionData={currentVersion}
							pubId={pubData.id}
							pubSlug={pubData.slug} />
					}
					{meta === 'versions' && 
						<PubVersions
							versionsData={versions}
							location={this.props.location} />
					}
					{meta === 'contributors' && 
						<PubContributors
							contributors={contributors}
							pubId={pubData.id}
							dispatch={this.props.dispatch} />
					}
					{((!meta && !hasDocument) || meta === 'files') && 
						<PubFiles
							versionData={currentVersion}
							pubId={pubData.id}
							pubSlug={pubData.slug}
							routeFilename={this.props.params.filename}
							dispatch={this.props.dispatch} />
					}
					{meta === 'settings' && 
						<PubSettings
							pubData={pubData}
							pubId={pubData.id}
							isLoading={this.props.pubData.settingsLoading}
							error={this.props.pubData.settingsError}
							dispatch={this.props.dispatch} />
					}
					{meta === 'journals' && 
						<PubJournals
							pubSubmits={pubSubmits}
							pubFeatures={pubFeatures}
							pubId={pubData.id}
							dispatch={this.props.dispatch} />
					}

				</div>

				{/* ----------- */}
				{/* Right Panel */}
				{/* ----------- */}
				<StickyContainer style={styles.right}>
					<Sticky style={styles.rightSticky}>

						<div style={styles.panelButtons}>
							{!panel && !queryDiscussion &&
								<div>
									<div className="pt-button-group" style={styles.panelButtonGroup}>
										<Link to={{ pathname: pathname, query: { ...query, panel: 'reviewers' } }} className="pt-button">Invite Reviewer</Link>
										<Link to={{ pathname: pathname, query: { ...query, panel: 'reviewers' } }} className="pt-button">{invitedReviewers.length}</Link>
									</div>

									<Link to={{ pathname: pathname, query: { ...query, panel: 'new' } }} className="pt-button pt-intent-primary">New Discussion</Link>
								</div>
							}

							{(!!panel || !!queryDiscussion) &&
								<button type="button" className="pt-button pt-intent-primary" onClick={this.goBack}>
									<span className="pt-icon-standard pt-icon-chevron-left" />
									Back
								</button>
							}
						</div>
						
						{panel === 'reviewers' && 
							<PubReviewers 
								invitedReviewers={invitedReviewers}
								discussionsData={discussionsData}
								pubId={pubData.id}
								pathname={pathname}
								query={query}
								dispatch={this.props.dispatch} />
						}
						{panel === 'new' && 
							<PubDiscussionsNew 
								discussionsData={discussionsData}
								labelsData={labelsData}
								pubId={pubData.id}
								isLoading={this.props.pubData.discussionsLoading}
								error={this.props.pubData.discussionsError}
								pathname={pathname}
								query={query}
								dispatch={this.props.dispatch} />
						}
						{!panel && !queryDiscussion && 
							<PubDiscussionsList 
								discussionsData={discussionsData} 
								labelsData={labelsData} 
								pathname={pathname} 
								query={query} 
								dispatch={this.props.dispatch} />
						}
						{!!queryDiscussion && 
							<PubDiscussion
								discussion={activeDiscussion}
								labelsData={labelsData}
								pubId={pubData.id}
								isLoading={this.props.pubData.discussionsLoading}
								error={this.props.pubData.discussionsError}
								pathname={pathname}
								query={query}
								dispatch={this.props.dispatch} />
						}

					</Sticky>
				</StickyContainer>
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Pub));

styles = {
	container: {
		position: 'relative',
		minHeight: '100vh',
	},
	left: {
		marginRight: '35vw',
	},
	right: {
		height: '100%',
		// maxHeight: '100vh',
		backgroundColor: '#f3f3f4',
		width: '35vw',
		position: 'absolute',
		right: 0,
		top: 0,
		boxShadow: 'inset 0px 0px 1px #777',
	},
	rightSticky: {
		height: '100vh',
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '0.5em 1em 0.5em',
	},
	panelButtons: {
		textAlign: 'right',
		padding: '0em 0em 1em',
	},
	panelButtonGroup: {
		padding: '0em .25em', 
		verticalAlign: 'top',
	},
	forkHeader: {
		padding: '1em 0em',
		margin: '0em 1.5em',
		borderBottom: '1px solid #CCC',
	},
	forkTitle: {
		fontWeight: 'bold',
	},
	pubTitle: {
		padding: '1em 0.5em 0em',
		fontSize: '2em',
		fontWeight: 'bold',
	},
	pubAuthors: {
		padding: '.5em 1.5em 1em',
	},
	buttonsPR: {
		float: 'right',
		width: '200px',
		margin: '0em 0em 0em .5em',
	},
	buttons: {
		float: 'right',
		width: '200px',
		margin: '1.5em 1.5em 1.5em .5em',
	},
	buttonBig: {
		margin: '2px',
		border: '1px solid #777',
		textAlign: 'center',
		fontSize: '.85em',
		backgroundColor: '#232425',
		color: 'white',
		cursor: 'pointer',

		// display: 'inline-block',
		// width: 'calc(100% - 6)',
	},
	button: {
		margin: '2px',
		border: '1px solid #777',
		display: 'inline-block',
		width: 'calc(50% - 6px)',
		textAlign: 'center',
		fontSize: '.85em',
		cursor: 'pointer',
	},
	nav: {
		borderBottom: '1px solid #ccc',
		boxShadow: '0px 1px 1px 0px #DDD',
		padding: '3em .65em 0em',
		marginBottom: '2em',
	},
	navItem: {
		display: 'inline-block',
		// padding: '0em 1em',
		padding: '.25em 0em .5em',
		margin: '0em 1em',
		cursor: 'pointer',
		color: '#333',
	},
	navItemActive: {
		boxShadow: 'inset 0 -3px 0 #202b33',
	},
	discussionButtonWrapper: {
		textAlign: 'right',
		padding: '1em',
	},
	discussionButton: {
		display: 'inline-block',
		padding: '.25em .5em',
		margin: '0em .5em',
		textAlign: 'center',
		border: '1px solid #777',
		fontSize: '.85em',
	},
	discussionButtonBig: {
		display: 'inline-block',
		padding: '.25em .5em',
		margin: '0em 0em 0em 0.5em',
		textAlign: 'center',
		border: '1px solid #CCC',
		color: 'white',
		backgroundColor: '#232425',
		fontSize: '.85em',
	},
	filter: {
		display: 'inline-block',
		padding: '0em 1em',
		fontSize: '0.85em',
		userSelect: 'none',
	},
	filterInput: {
		margin: '1em 1em 0em',
		padding: '.5em',
		width: 'calc(100% - 2em - 1em)'
	},
	filterHoverBox: {
		backgroundColor: 'white',
		position: 'absolute',
		margin: '0.5em',
		border: '1px solid #777',
		boxShadow: '0px 1px 2px black',
		padding: '.5em',
		width: 'calc(100% - 2px - 1em - 1em)',
		zIndex: 2,
	},
	filterHoverClose: {
		float: 'right',
		cursor: 'pointer',
	},
	discussionStart: {
		margin: '2em',
	},
	discussionContainer: {
		padding: '1em 0em',
		margin: '0em 1em',
		borderTop: '1px solid #BBB',
	},
	discussionTitle: {
		fontWeight: 'bold',
	},
	discussionMeta: {
		color: '#555',
		fontSize: '0.85em',
	},
	discussionLink: {
		color: 'inherit',
		textDecoration: 'none',
	},
	conversationWrapper: {
		padding: '1em',
	},
	conversationItem: {
		marginBottom: '1em',
	},
	newDiscussionWrapper: {
		padding: '1em',
	},
	fullWidth: {
		width: '100%',
	},
	
};
