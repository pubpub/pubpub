import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { NonIdealState, Spinner } from '@blueprintjs/core';

import PubContent from './PubContent';
import PubContributors from './PubContributors';
import PubDiffVersions from './PubDiffVersions';
import PubFollowers from './PubFollowers';
import PubHeader from './PubHeader';
import PubInvitedReviewerMessage from './PubInvitedReviewerMessage';
import PubJournals from './PubJournals';
import PubReviewers from './PubReviewers';
import PubSettings from './PubSettings';
import PubEditor from './PubEditor';
import PubVersions from './PubVersions';
import { getPubData } from './actions';

let styles;

export const Pub = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		highlightData: PropTypes.object,
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		route: PropTypes.object,
		router: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		const params = this.props.params || {};
		this.props.dispatch(getPubData(params.slug));
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

		// const currentFile = this.props.params.filename;
		// const meta = currentFile ? 'files' : this.props.params.meta;
		const meta = !this.props.params.meta ? 'files' : this.props.params.meta;
		const query = this.props.location.query;
		const preservedQuery = {
			version: query.version,
			context: query.context,
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

		const discussions = pub.discussions || [];
		const contributors = pub.contributors || [];
		const invitedReviewers = pub.invitedReviewers || [];
		const currentInvitedReviewer = invitedReviewers.reduce((previous, current)=> {
			if (!current.invitationRejected && current.invitedUserId === accountUser.id) { return current; }
			return previous;
		}, undefined);

		const versions = pub.versions || [];
		const followers = pub.followers || [];


		const discussionsData = discussions.filter((discussion)=> {
			return discussion.replyParentPubId === pub.id;
		}).sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const metaData = {
			title: (pub.title || this.props.params.slug) + ' · PubPub',
			meta: [
				{ name: 'description', content: pub.description },
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

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<PubHeader
					pub={pub}
					accountId={accountId}
					preservedQuery={preservedQuery}
					meta={meta}
					pathname={pathname}
					query={query}
					dispatch={this.props.dispatch} />

				{/* ------- */}
				{/* Message */}
				{/* ------- */}
				{currentInvitedReviewer && !currentInvitedReviewer.invitationAccepted && !currentInvitedReviewer.invitationRejected &&
					<div style={styles.messageSection}>
						<PubInvitedReviewerMessage pub={pub} isLoading={this.props.pubData.updateReviewerLoading} currentInvitedReviewer={currentInvitedReviewer} dispatch={this.props.dispatch} />
					</div>
				}

				{/* ------- */}
				{/* Content */}
				{/* ------- */}
				<div style={styles.content(meta)}>
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
					{meta === 'reviewers' &&
						<PubReviewers
							pub={pub}
							invitedReviewers={invitedReviewers}
							accountUser={accountUser}
							discussionsData={discussionsData}
							isLoading={this.props.pubData.inviteReviewerLoading}
							pathname={pathname}
							query={query}
							dispatch={this.props.dispatch} />
					}
					{meta === 'files' &&
						<PubContent 
							accountData={this.props.accountData}
							highlightData={this.props.highlightData}
							pubData={this.props.pubData}
							params={this.props.params}
							location={this.props.location}
							dispatch={this.props.dispatch} />
					}
					{meta === 'edit' &&
						<PubEditor 
							accountData={this.props.accountData}
							highlightData={this.props.highlightData}
							pubData={this.props.pubData}
							params={this.props.params}
							location={this.props.location}
							dispatch={this.props.dispatch} />
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
				</div>

			</div>

		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
		highlightData: state.highlight.toJS(),
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(Pub);

styles = {
	container: {
		position: 'relative',
		minHeight: '100vh',
		padding: '0em',
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
			padding: (meta === 'files' || meta === 'edit') ? '0em 2em' : '3em 2em',
		};
	},
};
