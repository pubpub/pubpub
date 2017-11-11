import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { NonIdealState } from '@blueprintjs/core';
import queryString from 'query-string';

import Overlay from 'components/Overlay/Overlay';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import NoMatch from 'containers/NoMatch/NoMatch';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubPresFooter from 'components/PubPresFooter/PubPresFooter';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import PubBody from 'components/PubBody/PubBody';
import License from 'components/License/License';
import Footer from 'components/Footer/Footer';
import { getPubData, postDiscussion, putDiscussion } from 'actions/pub';
import { nestDiscussionsToThreads, generateHash } from 'utilities';

import PubPresentationLoading from './PubPresentationLoading';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorRef: undefined,
		};
		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.closeDiscussionOverlay = this.closeDiscussionOverlay.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
		this.getHighlightContent = this.getHighlightContent.bind(this);
		this.handleEditorRef = this.handleEditorRef.bind(this);
	}
	componentWillMount() {
		this.props.dispatch(getPubData(this.props.match.params.slug, this.props.appData.data.id));
	}
	closeThreadOverlay() {
		const queryObject = queryString.parse(this.props.location.search);
		queryObject.thread = undefined;
		const newSearch = queryString.stringify(queryObject);
		this.props.history.push(`/pub/${this.props.match.params.slug}${newSearch}`);
	}

	closeDiscussionOverlay() {
		const queryObject = queryString.parse(this.props.location.search);
		queryObject.panel = undefined;
		const newSearch = queryString.stringify(queryObject);
		this.props.history.push(`/pub/${this.props.match.params.slug}${newSearch}`);
	}

	handlePostDiscussion(discussionObject) {
		this.props.dispatch(postDiscussion({
			...discussionObject,
			communityId: this.props.pubData.data.communityId,
		}));
	}
	handlePutDiscussion(discussionObject) {
		this.props.dispatch(putDiscussion({
			...discussionObject,
			communityId: this.props.pubData.data.communityId,
		}));
	}
	getHighlightContent(from, to) {
		const primaryEditorState = this.state.editorRef.state.editorState;
		if (!primaryEditorState || primaryEditorState.doc.nodeSize < from || primaryEditorState.doc.nodeSize < to) { return {}; }
		const exact = primaryEditorState.doc.textBetween(from, to);
		const prefix = primaryEditorState.doc.textBetween(Math.max(0, from - 10), Math.max(0, from));
		const suffix = primaryEditorState.doc.textBetween(Math.min(primaryEditorState.doc.nodeSize - 2, to), Math.min(primaryEditorState.doc.nodeSize - 2, to + 10));
		return {
			exact: exact,
			prefix: prefix,
			suffix: suffix,
			from: from,
			to: to,
			version: undefined,
			id: `h${generateHash(8)}`, // Has to start with letter since it's a classname
		};
	}
	handleEditorRef(ref) {
		if (!this.state.editorRef) {
			/* Need to set timeout so DOM can render */
			setTimeout(()=> {
				this.setState({ editorRef: ref });
			}, 0);
		}
	}
	render() {
		const pubData = this.props.pubData.data || { versions: [] };
		if (this.props.pubData.isLoading) { return <PubPresentationLoading />; }
		if (!pubData.id) { return <NoMatch />; }
		if (!pubData.versions.length) {
			return (
				<div className={'no-snapshots-wrapper'}>
					<NonIdealState
						title={'No Published Snapshots'}
						visual={'pt-icon-issue'}
						description={'This URL presents published snapshots. Go to Collaborate mode to continue.'}
						action={<Link to={`/pub/${this.props.match.params.slug}/collaborate`} className={'pt-button pt-intent-primary'}>Go to Collaboration Mode</Link>}
					/>
				</div>
			);
		}

		const queryObject = queryString.parse(this.props.location.search);
		const versionQuery = queryObject.version;
		const activeVersion = pubData.versions.sort((foo, bar)=> {
			if (foo.createdAt < bar.createdAt) { return 1; }
			if (foo.createdAt > bar.createdAt) { return -1; }
			return 0;
		}).reduce((prev, curr, index)=> {
			if (!versionQuery && index === 0) { curr.isActive = true; return curr; }
			if (versionQuery && versionQuery === curr.id) { curr.isActive = true; return curr; }
			curr.isActive = false;
			return prev;
		}, undefined);

		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const activeThread = threads.reduce((prev, curr)=> {
			if (String(curr[0].threadNumber) === queryObject.thread) {
				return curr;
			}
			return prev;
		}, undefined);
		const highlights = [];
		if (this.state.editorRef && queryObject.from && queryObject.to && queryObject.version) {
			highlights.push({
				...this.getHighlightContent(Number(queryObject.from), Number(queryObject.to)),
				permanent: true,
			});
			setTimeout(()=> {
				const thing = document.getElementsByClassName('permanent')[0];
				if (thing) {
					window.scrollTo(0, thing.getBoundingClientRect().top - 135);
				}
			}, 100);
		}
		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>{pubData.title}</title>
					<meta name={'description'} content={pubData.description} />
					<meta name={'og:title'} content={pubData.title} />
					<meta property={'og:type'} content={'article'} />
					<meta property={'og:description'} content={pubData.description} />
					<meta property={'og:url'} content={`${window.location.origin}/pub/${pubData.slug}`} />
					<meta property={'og:image'} content={pubData.avatar} />
					<meta property={'og:image:url'} content={pubData.avatar} />
					<meta property={'og:image:width'} content={'500'} />
					<meta property={'article:published_time'} content={pubData.firstPublishedAt} />
					<meta property={'article:modified_time'} content={pubData.lastPublishedAt} />
					<meta property={'fb:app_id'} content={'924988584221879'} />
					<meta name={'twitter:card'} content={'summary'} />
					<meta name={'twitter:site'} content={'@pubpub'} />
					<meta name={'twitter:title'} content={pubData.title} />
					<meta name={'twitter:description'} content={pubData.description} />
					<meta name={'twitter:image'} content={pubData.avatar} />
					<meta name={'twitter:image:alt'} content={`Avatar for ${pubData.title}`} />
				</Helmet>

				<PubPresHeader
					title={pubData.title}
					description={pubData.description}
					backgroundImage={pubData.useHeaderImage ? pubData.avatar : undefined}
				/>


				<PubPresDetails
					slug={pubData.slug}
					numDiscussions={pubData.discussions.length}
					numSuggestions={pubData.discussions.reduce((prev, curr)=> {
						if (curr.suggestions) { return prev + 1; }
						return prev;
					}, 0)}
					collaborators={pubData.collaborators}
					versions={pubData.versions}
					localPermissions={pubData.localPermissions}
					hasHeaderImage={pubData.useHeaderImage && !!pubData.avatar}
				/>

				<PubBody
					onRef={this.handleEditorRef}
					versionId={activeVersion.id}
					content={activeVersion.content}
					threads={threads}
					slug={pubData.slug}
					highlights={highlights}
					hoverBackgroundColor={this.props.appData.data.accentMinimalColor}
				/>

				<PubPresFooter
					slug={pubData.slug}
					collections={pubData.collections}
					numDiscussions={pubData.discussions.length}
					localPermissions={pubData.localPermissions}
				/>

				<div className={'license-wrapper'}>
					<License />
				</div>

				<Footer />

				<Overlay isOpen={!!activeThread} onClose={this.closeThreadOverlay} maxWidth={728}>
					<DiscussionThread
						discussions={activeThread || []}
						canManage={pubData.localPermissions === 'manage' || (this.props.loginData.data.isAdmin && pubData.adminPermissions === 'manage')}
						slug={pubData.slug}
						loginData={this.props.loginData.data}
						pathname={`${this.props.location.pathname}${this.props.location.search}`}
						handleReplySubmit={this.handlePostDiscussion}
						handleReplyEdit={this.handlePutDiscussion}
						submitIsLoading={this.props.pubData.postDiscussionIsLoading}
						isPresentation={true}
						getHighlightContent={this.getHighlightContent}
						hoverBackgroundColor={this.props.appData.data.accentMinimalColor}
					/>
				</Overlay>

				<Overlay isOpen={queryObject.panel === 'collaborators'} onClose={this.closeDiscussionOverlay} maxWidth={728}>
					<PubCollabShare
						appData={this.props.appData.data}
						pubData={pubData}
						canManage={false}
						collaboratorsOnly={true}
					/>
				</Overlay>
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({
	pubData: state.pub,
	loginData: state.login,
	appData: state.app
}))(PubPresentation));
