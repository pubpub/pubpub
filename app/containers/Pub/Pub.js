import { Link, browserHistory } from 'react-router';
import React, { PropTypes } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';

// import { FollowButton } from 'containers';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { NonIdealState } from '@blueprintjs/core';
import PubContent from './PubContent';
// import PubDocument from './PubDocument';
import PubHeader from './PubHeader';
import PubBreadcrumbs from './PubBreadcrumbs';
import PubContributors from './PubContributors';
import PubDiffVersions from './PubDiffVersions';
import PubDiscussion from './PubDiscussion';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubFollowers from './PubFollowers';
import PubJournals from './PubJournals';
// import PubLabelList from './PubLabelList';
import PubReviewers from './PubReviewers';
import PubSettings from './PubSettings';
import PubVersions from './PubVersions';
import PubSidePanel from './PubSidePanel';
import Radium from 'radium';
import { Tag } from 'components';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { getPubData } from './actions';
import { globalMessages } from 'utils/globalMessages';
import { globalStyles } from 'utils/globalStyles';
import { putReviewer } from './actionsReviewers';

let styles;

export const Pub = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			canGoBack: false,
		};
	},

	componentWillMount() {
		const params = this.props.params || {};
		this.props.dispatch(getPubData(params.slug));
	},

	componentWillReceiveProps(nextProps) {
		// const nextLocation = nextProps.location;
		const lastPanel = this.props.location.query.panel;
		const nextPanel = nextProps.location.query.panel;
		// const lastDiscussion = this.props.location.query.discussion;
		// const nextDiscussion = nextProps.location.query.discussion;
		const lastPathname = this.props.location.pathname;
		const nextPathname = nextProps.location.pathname;
		// const nextQuery = nextLocation.query || {};

		if (!lastPanel && nextPanel && lastPathname === nextPathname) {
			this.setState({ canGoBack: true });
		} else {
			this.setState({ canGoBack: false });
		}

		const params = this.props.params || {};
		const nextParams = nextProps.params || {};
		if (params.slug !== nextParams.slug) {
			this.props.dispatch(getPubData(nextParams.slug));
		}
		// Handle case when discussionId is present
		// const nextPubData = nextProps.pubData || {};
		// const pub = nextPubData.pub || {};
		// const pubId = pub.id;
		// const discussions = pub.discussions || [];
		// if (nextQuery.discussionId && discussions.length) {
		// 	this.replaceDiscussionIdQuery(pubId, discussions, nextPathname, nextQuery);
		// }
	},

	// replaceDiscussionIdQuery: function(pubId, discussions, pathname, query) {
	// 	// When routing to a url with ?discussionId=12,
	// 	// we need to find in which top-level discussion, discussionId=12 exists, and then
	// 	// add the query discussion=parentIndex
	// 	const discussionsData = this.addDiscussionIndex(discussions, pubId);
	// 	const discussionParentId = discussions.reduce((previous, current)=> {
	// 		if (current.id === Number(query.discussionId)) {
	// 			return current.replyParentPubId === pubId ? current.id : current.replyParentPubId;
	// 		}
	// 		return previous;
	// 	}, undefined);
	// 	const discussionIndex = discussionsData.reduce((previous, current)=> {
	// 		if (current.id === discussionParentId) { return current.discussionIndex; }
	// 		return previous;
	// 	}, undefined);

	// 	browserHistory.replace({ pathname: pathname, query: { ...query, discussionId: undefined, discussion: discussionIndex } });
	// },

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

	// addDiscussionIndex: function(discussions, pubId) {
	// 	return discussions.filter((discussion)=> {
	// 		return discussion.replyParentPubId === pubId;
	// 	}).sort((foo, bar)=> {
	// 		if (foo.createdAt > bar.createdAt) { return 1; }
	// 		if (foo.createdAt < bar.createdAt) { return -1; }
	// 		return 0;
	// 	}).map((discussion, index)=>{
	// 		return { ...discussion, discussionIndex: index + 1 };
	// 	});
	// },

	updateReviewer: function() {
		this.props.dispatch(putReviewer(this.props.pubData.pub.id, false, true, 'I have no idea what this is'));
	},

	render() {
		const pub = this.props.pubData.pub || {};
		if (this.props.pubData.loading && !this.props.pubData.error) {
			return <div>Loading</div>;
		}
		if (!this.props.pubData.loading && (this.props.pubData.error || !pub.title)) {
			return (
				<div style={{ margin: '2em' }}>
					<NonIdealState
						title={'Pub Not Found'}
						visual={'error'} />
				</div>
			);
		}

		const currentFile = this.props.params.filename;
		const meta = currentFile ? 'files' : this.props.params.meta;
		const query = this.props.location.query;
		const preservedQuery = {
			version: query.version,
			content: query.context,
			// panel: query.panel,
			// discussion: query.discussion,
			// label: query.label,
			// author: query.author,
			// sort: query.sort,
			// filter: query.filter,
		};
		const pathname = this.props.location.pathname;

		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;

		const panel = query.panel;
		const queryDiscussion = query.discussion;
		const discussions = pub.discussions || [];
		const contributors = pub.contributors || [];
		const invitedReviewers = pub.invitedReviewers || [];
		const isInvitedReviewer = invitedReviewers.reduce((previous, current)=> {
			if (!current.invitationRejected && current.invitedUserId === accountUser.id) { return true; }
			return previous;
		}, false);

		const versions = pub.versions || [];
		const pubFeatures = pub.pubFeatures || [];
		const followers = pub.followers || [];


		// const followData = followers.reduce((previous, current)=> {
		// 	if (current.id === accountId) { return current.FollowsPub; }
		// 	return previous;
		// }, undefined);

		// Might have to sort these if it isn't in chronological order
		const currentVersion = versions.sort((foo, bar)=> {
			// Sort so that most recent is first in array
			if (foo.createdAt > bar.createdAt) { return -1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			return 0;
		}).reduce((previous, current, index, array)=> {
			const previousDate = new Date(previous.createdAt).getTime();
			const currentDate = new Date(current.createdAt).getTime();

			if (!previous.id) { return current; } // If this is the first loop
			if (query.version === current.hash) { return current; } // If the query version matches current
			if (!query.version && currentDate > previousDate) { return current; }
			return previous;

		}, {});

		const pubDOI = versions.reduce((previous, current)=> {
			if (current.doi) { return current.doi; }
			return previous;
		}, undefined);

		const sortedVersions = versions.sort((foo, bar)=> {
			// Sort so that least recent is first in array
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const firstPublishedVersion = sortedVersions.reduce((previous, current, index, array)=> {
			if (previous) { return previous; }
			if (current.isPublished) { return current; }
		}, undefined) || {};

		const firstVersion = sortedVersions[0] || {};
		const lastVersion = sortedVersions[sortedVersions.length - 1] || {};

		// Populate parent discussions with their children
		const tempArray = [...discussions];
		tempArray.forEach((discussion)=> {
			discussion.children = tempArray.filter((child)=> {
				return (child.replyParentPubId === discussion.id);
			});
			return discussion;
		});


		const discussionsData = discussions.filter((discussion)=> {
			return discussion.replyParentPubId === pub.id;
		}).sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const activeDiscussion = discussionsData.reduce((previous, current)=> {
			if (queryDiscussion === String(current.threadNumber)) { return current; }
			return previous;
		}, {});

		// const contextJournal = pubFeatures.reduce((previous, current)=> {
		// 	if (!query.context && current.journalId === pub.defaultContext) { return current.journal; }
		// 	if (current.journal.title === query.context) { return current.journal; }
		// 	return previous;
		// }, undefined);

		// const displayedFeatures = pubFeatures.filter((feature)=> {
		// 	return feature.isDisplayed && (!contextJournal || feature.journalId !== contextJournal.id);
		// });

		const globalLabels = pub.labels.filter((label)=> {
			return !label.userId && !label.journalId && !label.pubId;
		});

		const metaData = {
			title: (pub.title || this.props.params.slug) + ' · PubPub',
			meta: [
				{ property: 'og:title', content: pub.title },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: pub.description },
				{ property: 'og:url', content: 'https://www.pubpub.org/pub/' + pub.slug },
				{ property: 'og:image', content: pub.avatar },
				{ property: 'og:image:url', content: pub.avatar },
				{ property: 'og:image:width', content: '500' },
				{ property: 'article:published_time', content: pub.updatedAt || pub.createdAt },
				{ property: 'article:modified_time', content: pub.updatedAt },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: pub.title },
				{ name: 'twitter:description', content: pub.description || pub.title },
				{ name: 'twitter:image', content: pub.avatar },
				{ name: 'twitter:image:alt', content: 'Avatar for ' + pub.title }
			]
		};

		const userName = (this.props.accountData && this.props.accountData.user) ? this.props.accountData.user.username : null;
		const userAccessToken = (this.props.accountData && this.props.accountData.user) ? this.props.accountData.user.accessToken : null;

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<PubHeader 
					pub={pub}
					accountId={accountId}
					preservedQuery={preservedQuery}
					currentVersion={currentVersion}
					meta={meta}
					pathname={pathname}
					query={query}
					dispatch={this.props.dispatch} />

				{/*<PubNav
					pub={pub}
					accountId={accountId}
					preservedQuery={preservedQuery}
					currentVersion={currentVersion}
					meta={meta}
					pathname={pathname}
					query={query}
					dispatch={this.props.dispatch} />*/}

				{/* false && isInvitedReviewer &&
					<div className={'pt-callout'}>
						INVITED!!!!!
						<button type="button" onClick={this.updateReviewer}>CLICK ME TO UPDATE</button>
					</div>
				*/}

				{/* ---------- */}
				{/*   Header   */}
				{/* ---------- */}

				<div style={styles.header}>
					{/*!!displayedFeatures.length &&
						<div style={styles.journalHeader}>
							{!!contextJournal &&
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
					*/}
					{/*<div style={styles.followButtonWrapper}>
						<FollowButton
							pubId={pub.id}
							followData={followData}
							followerCount={followers.length}
							followersLink={{ pathname: '/pub/' + pub.slug + '/followers', query: query }}
							dispatch={this.props.dispatch} />
					</div>*/}

					{/*<h1 style={styles.pubTitle}>{pub.title}</h1>*/}

					{/*<div style={{ paddingLeft: '1em' }}>
						<PubLabelList selectedLabels={globalLabels} pubId={pub.id} rootPubId={pub.id} globalLabels={true} canEdit={pub.canEdit} pathname={pathname} query={query} dispatch={this.props.dispatch} />
					</div>*/}

					{/*<div style={styles.pubAuthors}>
						{contributors.filter((contributor)=>{
							return contributor.isAuthor === true;
						}).map((contributor, index, array)=> {
							const user = contributor.user || {};
							return <Link to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
						})}
					</div>*/}

					{/*pubDOI &&
						<div style={styles.pubAuthors}>
							DOI: <a href={'https://doi.org/' + pubDOI} target={'_blank'}>{pubDOI}</a>
						</div>
					*/}

					{/*(!meta || meta === 'files' || true) &&
						<div style={styles.versionDates}>
							<div style={styles.versionDate}>First Version: {dateFormat(firstVersion.createdAt, 'mmmm dd, yy HH:MM')}</div>
							{firstPublishedVersion.id &&
								<Link to={{ pathname: pathname, query: { ...query, version: firstPublishedVersion.hash } }} style={styles.versionDate}>Originally Published<br />{dateFormat(firstPublishedVersion.createdAt, 'mmmm dd, yy HH:MM')}</Link>
							}

							<Link to={{ pathname: pathname, query: { ...query, version: currentVersion.hash } }} style={styles.versionDate}>Current Version<br />{dateFormat(currentVersion.createdAt, 'mmm dd, yy HH:MM')}</Link>
							
							{currentVersion.id !== lastVersion.id &&
								<Link to={{ pathname: pathname, query: { ...query, version: undefined } }} style={styles.versionDate}>Most Recent Version<br />{dateFormat(lastVersion.createdAt, 'mmm dd, yy HH:MM')}</Link>
							}
						</div>
					*/}
					

					{/* ------- */}
					{/* Nav Bar */}
					{/* ------- */}
					{/*<div style={styles.nav}>
						<Link to={{ pathname: '/pub/' + this.props.params.slug, query: preservedQuery }}><div style={[styles.navItem, (!meta || meta === 'files') && styles.navItemActive]} className={'bottomShadowOnHover'}>Content</div></Link>
						{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/versions', query: preservedQuery }}><div style={[styles.navItem, meta === 'versions' && styles.navItemActive]} className={'bottomShadowOnHover'}>Versions ({versions.length})</div></Link> }
						<Link to={{ pathname: '/pub/' + this.props.params.slug + '/contributors', query: preservedQuery }}><div style={[styles.navItem, meta === 'contributors' && styles.navItemActive]} className={'bottomShadowOnHover'}>Contributors ({contributors.length})</div></Link>
						{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/journals', query: preservedQuery }}><div style={[styles.navItem, meta === 'journals' && styles.navItemActive]} className={'bottomShadowOnHover'}>Journals {pubFeatures.length ? '(' + pubFeatures.length + ')' : ''}</div></Link> }
						{pub.canEdit && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/settings', query: preservedQuery }}><div style={[styles.navItem, meta === 'settings' && styles.navItemActive]} className={'bottomShadowOnHover'}>Settings</div></Link>}
					</div>*/}

				</div>



				{/* ------- */}
				{/* Content */}
				{/* ------- */}
				<div style={styles.content}>
					{meta === 'versions' &&
						<PubVersions
							versionsData={versions}
							pub={pub}
							location={this.props.location}
							isLoading={this.props.pubData.versionsLoading}
							error={this.props.pubData.versionsError}
							dispatch={this.props.dispatch} />
					}
					{meta === 'contributors' &&
						<PubContributors
							contributors={contributors}
							pub={pub}
							dispatch={this.props.dispatch} />
					}
					{(!meta || meta === 'files') &&
						/*<div style={{ position: 'relative', width: '100%' }}>*/

						<div>
							<PubBreadcrumbs 
								pub={pub}
								version={currentVersion}
								params={this.props.params}
								query={query} />

							<div id={'content-wrapper'} style={{ position: 'relative', width: '100%' }}>
								
								<div style={(meta !== 'files' || this.props.params.filename) ? styles.left : {}}>
									<PubContent
										version={currentVersion}
										pub={pub}
										params={this.props.params}
										query={query}
										userAccessToken={userAccessToken}
										userName={userName}
										isLoading={this.props.pubData.versionsLoading}
										error={this.props.pubData.versionsError}
										dispatch={this.props.dispatch} />
								</div>
								{(meta !== 'files' || this.props.params.filename) &&
									<div style={styles.rightPanel}>
										<PubSidePanel parentId={'content-wrapper'}>
											{/*<div style={{height: '100%', width: '100%', backgroundColor: 'blue', position: 'relative'}}>*/}
											<div style={{height: '100%', width: '100%', position: 'relative'}}>
												{/*<div style={{padding: '10px 0px', height: '50px', width: '100%', backgroundColor: 'green'}}>*/}
												<div style={{padding: '10px 0px', height: '50px', width: '100%'}}>
													<div style={styles.panelButtons}>
														{!panel && !queryDiscussion &&
															<div>
																{false &&
																	<div className="pt-button-group" style={styles.panelButtonGroup}>
																		<Link to={{ pathname: pathname, query: { ...query, panel: 'reviewers' } }} className="pt-button">Invite Reviewer</Link>
																		<Link to={{ pathname: pathname, query: { ...query, panel: 'reviewers' } }} className="pt-button">{invitedReviewers.length}</Link>
																	</div>
																}
					
																<Link to={{ pathname: pathname, query: { ...query, panel: 'new' } }} className="pt-button pt-intent-primary pt-minimal pt-icon-add">New Discussion</Link>
																<button role={'button'} className={'pt-button pt-minimal pt-icon-filter-list'}>Filter</button>
															</div>
														}
					
														{(!!panel || !!queryDiscussion) &&
															<button type="button" className="pt-button pt-intent-primary pt-minimal" onClick={this.goBack}>
																<span className="pt-icon-standard pt-icon-chevron-left" />
																Back
															</button>
														}
													</div>
												</div>

												{panel === 'new' &&
													<PubDiscussionsNew
														discussionsData={discussionsData}
														pub={pub}
														isLoading={this.props.pubData.discussionsLoading}
														error={this.props.pubData.discussionsError}
														pathname={pathname}
														query={query}
														dispatch={this.props.dispatch} />
												}
												{!panel && !queryDiscussion &&
													<PubDiscussionsList
														discussionsData={discussionsData}
														pub={pub}
														pathname={pathname}
														query={query}
														dispatch={this.props.dispatch} />
												}
												{!!queryDiscussion &&
													<PubDiscussion
														discussion={activeDiscussion}
														pub={pub}
														accountId={accountId}
														isLoading={this.props.pubData.discussionsLoading}
														error={this.props.pubData.discussionsError}
														pathname={pathname}
														query={query}
														dispatch={this.props.dispatch} />
												}

												{/*<div style={{height: 'calc(100% - 150px)', width: '100%', backgroundColor: 'orange', overflow: 'hidden', overflowY: 'scroll', position: 'relative'}}>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													<p>Hey so this is a thing about cats and dogs.</p>
													<p>The thing about cats is that they're not fish - but something they do make sounds.</p>
													
												</div>

												<div style={{height: '100px', width: '100%', backgroundColor: 'red', position: 'relative'}}>
													<div style={styles.bottomFade}></div>
												</div>*/}
											</div>
										</PubSidePanel>
										
										
												
									
										
									</div>
								}
								
							</div>
						</div>
						
					}
					{meta === 'settings' &&
						<PubSettings
							pub={pub}
							isLoading={this.props.pubData.settingsLoading}
							error={this.props.pubData.settingsError}
							dispatch={this.props.dispatch} />
					}
					{meta === 'journals' &&
						<PubJournals
							pub={pub}
							dispatch={this.props.dispatch} />
					}
					{meta === 'followers' &&
						<PubFollowers
							followers={followers}
							pathname={pathname}
							query={query} />
					}
					{meta === 'diff' &&
						<PubDiffVersions
							versions={versions}
							pathname={pathname}
							query={query} />
					}
					{meta === 'reviewers' &&
						<PubReviewers
							invitedReviewers={invitedReviewers}
							accountUser={accountUser}
							discussionsData={discussionsData}
							pubId={pub.id}
							pathname={pathname}
							query={query}
							dispatch={this.props.dispatch} />
					}
				</div>

			</div>

		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Pub));

styles = {
	container: {
		position: 'relative',
		minHeight: '100vh',
		// maxWidth: '1400px',
		padding: '0em',
		// margin: '0 auto',
	},
	content: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '0em 2em'
	},
	left: {
		marginRight: '35%',
		paddingRight: '4em',
	},
	rightPanel: {
		position: 'absolute',
		right: 0,
		top: 0,
		width: '35%',
	},
	right: {
		height: '100%',
		// maxHeight: '100vh',
		// backgroundColor: '#f3f3f4',
		width: '35%',
		position: 'absolute',
		right: 0,
		top: 0,
		zIndex: 10,
		// boxShadow: 'inset 0px 0px 1px #777',
	},
	rightSticky: {
		maxHeight: '100vh',
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
	
	// pubTitle: {
	// 	padding: '1em 0.5em 0em',
	// 	fontSize: '2em',
	// 	fontWeight: 'bold',
	// },
	pubAuthors: {
		padding: '.5em 1.5em 1em',
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
	versionDates: {
		// padding: '0em 1.5em',
		// margin: '-1em 1.5em 1em',
		// backgroundColor: '#F3F3F4',
		padding: '0.5em 0em',
		borderTop: '1px solid #f3f3f4',
		borderBottom: '1px solid #f3f3f4',
		margin: '0em 1.5em',
	},
	versionDate: {
		fontSize: '0.85em',
		color: '#666',
		paddingRight: '2em',
		display: 'inline-block',
	},
	// followButtonWrapper: {
	// 	float: 'right',
	// 	margin: '2em 1em 0em 0em',
	// },
	journalHeader: {
		padding: '1em',
		borderBottom: '1px solid #EEE',
	},
	journalHeaderTag: {
		marginRight: '0.5em',
	},

	bottomFade: {
		position: 'absolute',
		top: '-30px',
		backgroundImage: ' linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
		width: '100%',
		height: '30px',
		zIndex: '2',
	},

};
