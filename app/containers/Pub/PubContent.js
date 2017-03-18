import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import { Rendering } from 'marklib';
import * as textQuote from 'dom-anchor-text-quote';
import { NonIdealState, Spinner } from '@blueprintjs/core';

import PubBreadcrumbs from './PubBreadcrumbs';
import PubContentOld from './PubContentOld';
import PubDiscussion from './PubDiscussion';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubSidePanel from './PubSidePanel';

import { getPubData } from './actions';

let styles;

export const PubContent = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		highlightData: PropTypes.object,
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			canGoBack: false,
			showAllDiscussions: false,
			highlightsMade: {},
			// showClosedDiscussions: false,
		};
	},

	componentWillMount() {
		const params = this.props.params || {};
		// this.props.dispatch(getPubData(params.slug));
		setTimeout(()=> {
			this.setState({});
			// This is a bad hack for PDFs to trigger their rebuild. What should we do instead? Send highlights into RenderFile?
		}, 20000);
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
		// if (params.slug !== nextParams.slug) {
		// 	this.props.dispatch(getPubData(nextParams.slug));
		// }
		if (lastPathname !== nextPathname) {
			this.setState({ highlightsMade: {} });
			setTimeout(()=> {
				this.setState({});
				// This is a bad hack for PDFs to trigger their rebuild. What should we do instead? Send highlights into RenderFile?
			}, 20000);
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
				query: { ...query, panel: undefined, discussion: undefined, useHighlight: undefined, }
			});
		}
	},

	toggleShowAllDiscussions: function() {
		this.setState({ showAllDiscussions: !this.state.showAllDiscussions });
	},
	// toggleShowClosedDiscussions: function() {
	// 	this.setState({ showClosedDiscussions: !this.state.showClosedDiscussions });
	// },


	extractHighlights: function(object, array) {
		// console.log(object);
		const tempArray = array || [];
		if (object.type === 'embed' && object.attrs && object.attrs.data && object.attrs.data.type === 'highlight') {
			tempArray.push(object.attrs.data.content);
		}
		if (object.content) {
			const newContent = Array.isArray(object.content) ? object.content : [object.content];
			newContent.forEach((content)=> {
				this.extractHighlights(content, tempArray);
			});
		}

		return tempArray;
	},

	openDiscussion: function(threadNumber) {
		browserHistory.push({
			pathname: this.props.location.pathname,
			query: { ...this.props.location.query, panel: undefined, discussion: threadNumber }
		});
	},

	highlightBubbleEnter: function(highlightId) {
		// console.log('enter ', highlightId);
		const elements = document.getElementsByClassName(`highlight-${highlightId}`);
		// console.log(elements);
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			element.className += ' highlight-hover';
		}
	},

	highlightBubbleLeave: function(highlightId) {
		const elements = document.getElementsByClassName(`highlight-${highlightId}`);
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			element.className = element.className.replace(' highlight-hover', '');
		}
	},

	render() {
		const pub = this.props.pubData.pub || {};
		if (this.props.pubData.loading && !this.props.pubData.error) {
			return <div style={{ margin: '5em auto', width: '50px' }}><Spinner /></div>;
		}
		if (!this.props.pubData.loading && (this.props.pubData.error || !pub.title)) {
			return (
				<div style={{ margin: '2em' }}>
					<NonIdealState
						title={this.props.pubData.error === 'Pub Deleted' ? 'Pub Deleted' : 'Pub Not Found'}
						visual={this.props.pubData.error === 'Pub Deleted' ? 'delete' : 'error'} />
				</div>
			);
		}

		const currentFile = this.props.params.filename;
		// const meta = currentFile ? 'files' : this.props.params.meta;
		const meta = !this.props.params.meta ? 'files' : this.props.params.meta;
		const query = this.props.location.query;
		
		const pathname = this.props.location.pathname;

		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;

		const panel = query.panel;
		const queryDiscussion = query.discussion;
		const discussions = pub.discussions || [];
		const contributors = pub.contributors || [];
		const invitedReviewers = pub.invitedReviewers || [];
		const currentInvitedReviewer = invitedReviewers.reduce((previous, current)=> {
			if (!current.invitationRejected && current.invitedUserId === accountUser.id) { return current; }
			return previous;
		}, undefined);

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

		// const pubDOI = versions.reduce((previous, current)=> {
		// 	if (current.doi) { return current.doi; }
		// 	return previous;
		// }, undefined);

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


		/*---------*/
		// All of this should be done outside of discussions - perhaps in it's own component.
		// This is re-rendering on every scroll because of fixed position.

		const allHighlights = discussions.reduce((previous, current)=> {
			if (!current.versions.length) { return previous; }
			const currentFileVersion = current.versions.reduce((previousVersionItem, currentVersionItem)=> {
				return (!previousVersionItem.createdAt || currentVersionItem.createdAt > previousVersionItem.createdAt) ? currentVersionItem : previousVersionItem;
			}, {}); // Get the last version
			const files = currentFileVersion.files || [];

			const highlightFileArray = files.reduce((previousFileItem, currentFileItem)=> {
				if (currentFileItem.name === 'highlights.json') { return JSON.parse(currentFileItem.content); }
				return previousFileItem;
			}, []);

			const addedThreadNumber = highlightFileArray.map((item) => {
				return {
					...item,
					threadNumber: current.threadNumber
				};
			});
			return [...previous, ...addedThreadNumber];

		}, []);

		// console.log('allHighlights', allHighlights);
		if (pub.slug === 'mindstorms') {
			setTimeout(()=> {
				const container = document.getElementById('highlighter-wrapper');
				if (container) {
					const newHighlightsMade = {};
					allHighlights.forEach((highlight)=> {
						const highlightObject = {
							exact: highlight.exact,
							prefix: highlight.prefix,
							suffix: highlight.suffix,
						};
						const t0 = performance.now();
						// const textQuoteRange = textQuote.toRange(container, highlightObject);
						// const t1 = performance.now();
						// console.log('-----------');
						
						// if (textQuoteRange && document.getElementsByClassName(`highlight-${highlight.id}`).length === 0) {
						if (!this.state.highlightsMade[highlight.id]) {
							
							const t1 = performance.now();
							const textQuoteRange = textQuote.toRange(container, highlightObject);
							// console.log('t01: ', t1 - t0);
							if (textQuoteRange) {

								const t2 = performance.now();
								const renderer = new Rendering(document, { hoverClass: 'highlight-hover', className: `highlight highlight-${highlight.id} discussion-${highlight.threadNumber}` });
								const t3 = performance.now();
								renderer.renderWithRange(textQuoteRange);
								const t4 = performance.now();
								// const element = document.getElementsByClassName(`highlight-${highlight.id}`)[0];
								const elements = document.getElementsByClassName(`highlight-${highlight.id}`);
								const elementBox = elements[0].getBoundingClientRect();
								const wrapperBox = document.getElementById('content-wrapper').getBoundingClientRect();
								newHighlightsMade[highlight.id] = [highlight.threadNumber, elementBox.top + ((elementBox.bottom - elementBox.top) / 2) + (Math.floor(Math.random() * 20) - 10) - wrapperBox.top];
								const t5 = performance.now();
								for (let index = 0; index < elements.length; index++) {
									const element = elements[index];
									element.addEventListener('click', ()=> {
										this.openDiscussion(highlight.threadNumber);
									});

									element.addEventListener('mouseenter', ()=> {
										this.highlightBubbleEnter(highlight.id);
										// element.className += ' highlight-hover';
									});

									element.addEventListener('mouseleave', ()=> {
										this.highlightBubbleLeave(highlight.id);
										// element.className = element.className.replace(' highlight-hover', '');
									});

									// const marker = document.createElement('div');
									// marker.className = 'highlight-marker';
									// marker.setAttribute('style', `transform: translateY(${Math.floor(Math.random() * 20) - 10}px)`);
									// element.appendChild(marker);
									
								}
								const t6 = performance.now();
								const t7 = performance.now();
								
								// console.log('t12: ', t2 - t1);
								// console.log('t23: ', t3 - t2);
								// console.log('t34: ', t4 - t3);
								// console.log('t45: ', t5 - t4);
								// console.log('t56: ', t6 - t5);
								// console.log('t67: ', t7 - t6);
							}
						}
		
					});
					if (Object.keys(newHighlightsMade).length) {
						this.setState({ highlightsMade: { ...this.state.highlightsMade, ...newHighlightsMade } });
					}
				}
			}, 1000);
		}
		// console.log('highlightsMade', this.state.highlightsMade);

		/*---------*/
		
		const userName = (this.props.accountData && this.props.accountData.user) ? this.props.accountData.user.username : null;
		const userAccessToken = (this.props.accountData && this.props.accountData.user) ? this.props.accountData.user.accessToken : null;

		return (
			<div>
				<PubBreadcrumbs
					pub={pub}
					version={currentVersion}
					params={this.props.params}
					query={query} />

				<div id={'content-wrapper'} style={{ position: 'relative', width: '100%' }}>

					<div style={currentVersion.files && (meta !== 'files' || this.props.params.filename) ? styles.left : {}}>
						<PubContentOld
							version={currentVersion}
							pub={pub}
							params={this.props.params}
							query={query}
							userAccessToken={userAccessToken}
							userName={userName}
							isLoading={this.props.pubData.versionsLoading}
							error={this.props.pubData.versionsError}
							dispatch={this.props.dispatch} />
						{Object.keys(this.state.highlightsMade).map((highlightKey)=> {
							return <div key={`highlightBubble-${highlightKey}`} className={'highlight-marker'} onMouseEnter={this.highlightBubbleEnter.bind(this, highlightKey)} onMouseLeave={this.highlightBubbleLeave.bind(this, highlightKey)} onClick={this.openDiscussion.bind(this, this.state.highlightsMade[highlightKey][0])} style={{ right: 18, top: this.state.highlightsMade[highlightKey][1] }} />;
						})}
					</div>
					{currentVersion.files && (this.props.params.meta !== 'files' || this.props.params.filename) &&
						<div style={styles.rightPanel}>
							<PubSidePanel parentId={'content-wrapper'}>
								<div style={styles.discussionListVisible(!panel && !queryDiscussion)}>
									<PubDiscussionsList
										discussionsData={discussionsData}
										highlightData={this.props.highlightData}
										pub={pub}
										showAllDiscussions={this.state.showAllDiscussions}
										toggleShowAllDiscussions={this.toggleShowAllDiscussions}
										// showClosedDiscussions={this.state.showClosedDiscussions}
										// toggleShowClosedDiscussions={this.toggleShowClosedDiscussions}
										pathname={pathname}
										isVisible={!panel && !queryDiscussion}
										query={query}
										dispatch={this.props.dispatch} />
								</div>
								{panel === 'new' &&
									<PubDiscussionsNew
										discussionsData={discussionsData}
										highlightData={this.props.highlightData}
										pub={pub}
										goBack={this.goBack}
										accountId={accountId}
										isLoading={this.props.pubData.discussionsLoading}
										error={this.props.pubData.discussionsError}
										pathname={pathname}
										query={query}
										dispatch={this.props.dispatch} />
								}
								{!!queryDiscussion &&
									<PubDiscussion
										discussion={activeDiscussion}
										highlightData={this.props.highlightData}
										pub={pub}
										goBack={this.goBack}
										accountId={accountId}
										isLoading={this.props.pubData.discussionsLoading}
										error={this.props.pubData.discussionsError}
										pathname={pathname}
										query={query}
										dispatch={this.props.dispatch} />
								}

							</PubSidePanel>
						</div>
					}

				</div>
			</div>

		);
	}
});

// function mapStateToProps(state) {
// 	return {
// 		accountData: state.account.toJS(),
// 		highlightData: state.highlight.toJS(),
// 		pubData: state.pub.toJS(),
// 	};
// }

export default Radium(PubContent);

styles = {
	container: {
		position: 'relative',
		minHeight: '100vh',
		// maxWidth: '1400px',
		padding: '0em',
		// margin: '0 auto',
	},
	messageSection: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '1em 2em',
	},
	content: (meta)=> {
		return {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: meta === 'files' || meta === undefined ? '0em 2em' : '3em 2em',
		};
	},
	left: {
		position: 'relative',
		marginRight: '35%',
		paddingRight: '4em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginRight: 0,
			paddingRight: 0,
		}
	},
	rightPanel: {
		position: 'absolute',
		right: 0,
		top: 0,
		width: '35%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
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
	// panelButtons: {
	// 	textAlign: 'right',
	// 	padding: '0em 0em 1em',
	// },
	// panelButtonGroup: {
	// 	padding: '0em .25em',
	// 	verticalAlign: 'top',
	// },

	// pubTitle: {
	// 	padding: '1em 0.5em 0em',
	// 	fontSize: '2em',
	// 	fontWeight: 'bold',
	// },
	pubAuthors: {
		padding: '.5em 1.5em 1em',
	},
	discussionListVisible: (isVisible)=> {
		return {
			display: isVisible ? 'block' : 'none',
		};
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
