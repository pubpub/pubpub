import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { NonIdealState, Spinner } from '@blueprintjs/core';

import PubBreadcrumbs from './PubBreadcrumbs';
import PubContentFiles from './PubContentFiles';
import PubDiscussion from './PubDiscussion';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubSidePanel from './PubSidePanel';
import PubHighlights from './PubHighlights';

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
			// showClosedDiscussions: false,
		};
	},


	componentWillReceiveProps(nextProps) {
		const lastPanel = this.props.location.query.panel;
		const nextPanel = nextProps.location.query.panel;
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

		const meta = !this.props.params.meta ? 'files' : this.props.params.meta;
		const query = this.props.location.query;
		
		const pathname = this.props.location.pathname;

		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;

		const panel = query.panel;
		const queryDiscussion = query.discussion;
		const discussions = pub.discussions || [];
		
		const versions = pub.versions || [];
		
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
	

		return (
			<div>
				<PubBreadcrumbs
					pub={pub}
					version={currentVersion}
					params={this.props.params}
					query={query} />

				<div id={'content-wrapper'} style={{ position: 'relative', width: '100%' }}>

					<div style={currentVersion.files && (this.props.params.meta !== 'files' || this.props.params.filename) ? styles.left : {}}>
						<PubContentFiles
							version={currentVersion}
							pub={pub}
							params={this.props.params}
							query={query}
							isLoading={this.props.pubData.versionsLoading}
							error={this.props.pubData.versionsError}
							dispatch={this.props.dispatch} />

						<PubHighlights discussions={discussions} location={this.props.location} />
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

export default Radium(PubContent);

styles = {
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
	
	discussionListVisible: (isVisible)=> {
		return {
			display: isVisible ? 'block' : 'none',
		};
	},

};
