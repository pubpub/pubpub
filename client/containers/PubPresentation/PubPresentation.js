import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Overlay from 'components/Overlay/Overlay';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubPresFooter from 'components/PubPresFooter/PubPresFooter';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import PubBody from 'components/PubBody/PubBody';
import License from 'components/License/License';

import { hydrateWrapper, nestDiscussionsToThreads } from 'utilities';

require('./pubPresentation.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeThreadNumber: undefined,
			activePanel: undefined,
		};

		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.closeDiscussionOverlay = this.closeDiscussionOverlay.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
	}

	closeThreadOverlay() {
		this.setState({ activeThreadNumber: undefined });
		// const queryObject = queryString.parse(this.props.location.search);
		// queryObject.thread = undefined;
		// const newSearch = queryString.stringify(queryObject);
		// this.props.history.push(`/pub/${this.props.match.params.slug}${newSearch}`);
	}

	closeDiscussionOverlay() {
		this.setState({ activePanel: undefined });
		// const queryObject = queryString.parse(this.props.location.search);
		// queryObject.panel = undefined;
		// const newSearch = queryString.stringify(queryObject);
		// this.props.history.push(`/pub/${this.props.match.params.slug}${newSearch}`);
	}

	handlePostDiscussion(discussionObject) {
		// TODO
		console.log('Gotta post discussion!')
		// this.props.dispatch(postDiscussion({
		// 	...discussionObject,
		// 	communityId: this.props.pubData.data.communityId,
		// }));
	}
	handlePutDiscussion(discussionObject) {
		// TODO
		console.log('Gotta put discussion!')
		// this.props.dispatch(putDiscussion({
		// 	...discussionObject,
		// 	communityId: this.props.pubData.data.communityId,
		// }));
	}

	render() {
		const pubData = this.props.pubData;
		const activeVersion = pubData.versions[0];
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const activeThread = threads.reduce((prev, curr)=> {
			if (String(curr[0].threadNumber) === this.state.activeThreadNumber) {
				return curr;
			}
			return prev;
		}, undefined);
		return (
			<div id="pub-presentation-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					{!pubData.versions.length &&
						<div className="no-snapshots-wrapper">
							<NonIdealState
								title="No Published Snapshots"
								visual="pt-icon-issue"
								description="This URL presents published snapshots. Go to Collaborate mode to continue."
								action={<a href={`/pub/${this.props.locationData.params.slug}/collaborate`} className="pt-button pt-intent-primary">Go to Collaboration Mode</a>}
							/>
						</div>
					}
					{pubData.versions.length &&
						<div>
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
								// TODO onRef={this.handleEditorRef}
								versionId={activeVersion.id}
								content={activeVersion.content}
								threads={threads}
								slug={pubData.slug}
								// TODO highlights={highlights}
								hoverBackgroundColor={this.props.communityData.accentMinimalColor}
							/>

							<PubPresFooter
								slug={pubData.slug}
								collections={pubData.collections}
								numDiscussions={pubData.discussions.length}
								localPermissions={pubData.localPermissions}
							/>

							<div className="license-wrapper">
								<License />
							</div>

							<Overlay isOpen={!!activeThread} onClose={this.closeThreadOverlay} maxWidth={728}>
								<DiscussionThread
									discussions={activeThread || []}
									canManage={pubData.localPermissions === 'manage' || (this.props.loginData.isAdmin && pubData.adminPermissions === 'manage')}
									slug={pubData.slug}
									loginData={this.props.loginData}
									pathname={`${this.props.locationData.path}${this.props.locationData.queryString}`}
									handleReplySubmit={this.handlePostDiscussion}
									handleReplyEdit={this.handlePutDiscussion}
									submitIsLoading={this.props.pubData.postDiscussionIsLoading}
									isPresentation={true}
									// TODO getHighlightContent={this.getHighlightContent}
									hoverBackgroundColor={this.props.communityData.accentMinimalColor}
								/>
							</Overlay>

							<Overlay isOpen={this.state.activePanel === 'collaborators'} onClose={this.closeDiscussionOverlay} maxWidth={728}>
								<PubCollabShare
									appData={this.props.communityData}
									pubData={pubData}
									canManage={false}
									collaboratorsOnly={true}
								/>
							</Overlay>
						</div>
					}
				</PageWrapper>
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default PubPresentation;

hydrateWrapper(PubPresentation);
