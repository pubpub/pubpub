import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Overlay from 'components/Overlay/Overlay';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';
import { nestDiscussionsToThreads } from 'utilities';

require('./discussionViewer.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	activeThreadNumber: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	getHighlightContent: PropTypes.func.isRequired,
	onPostDiscussion: PropTypes.func.isRequired,
	onPutDiscussion: PropTypes.func.isRequired,
	onPublish: PropTypes.func.isRequired,
	postDiscussionIsLoading: PropTypes.bool.isRequired,
	postVersionIsLoading: PropTypes.bool.isRequired,
	initialContent: PropTypes.object,
};

const defaultProps = {
	initialContent: undefined,
};

class DiscussionViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPinned: false,
		};
		this.handleNewDiscussionSubmit = this.handleNewDiscussionSubmit.bind(this);
		this.togglePin = this.togglePin.bind(this);
		this.handleQuotePermalink = this.handleQuotePermalink.bind(this);
	}

	handleQuotePermalink(quoteObject) {
		const hasChapters = !!quoteObject.chapter;
		const chapterString = hasChapters ? `/chapter/${quoteObject.chapter}` : '';
		const toFromString = `?to=${quoteObject.to}&from=${quoteObject.from}`;
		const versionString = `&version=${quoteObject.version}`;
		const permalinkPath = `/pub/${this.props.pubData.slug}${chapterString}${toFromString}${versionString}`;
		window.open(permalinkPath);
	}
	handleNewDiscussionSubmit(replyObject) {
		this.props.onPostDiscussion({
			userId: this.props.loginData.id,
			pubId: this.props.pubData.id,
			title: replyObject.title,
			content: replyObject.content,
			text: replyObject.text,
			isPublic: replyObject.isPublic,
			highlights: replyObject.highlights,
		});
	}

	togglePin() {
		this.setState({ isPinned: !this.state.isPinned });
	}

	render() {
		const pubData = this.props.pubData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === this.props.activeThreadNumber) {
				return curr;
			}
			return prev;
		}, []);

		const isActive = !!this.props.activeThreadNumber;
		const isNew = this.props.activeThreadNumber === 'new';
		const isPinned = this.state.isPinned || isNew;
		const isEditor = this.props.locationData.path.indexOf(`${this.props.pubData.slug}/collaborate`) > -1;
		const quotePermalinkFunc = isEditor ? undefined : this.handleQuotePermalink;
		return (
			<div className="discussion-viewer-component">
				{isActive && isPinned &&
					<div className="pinned-wrapper">
						<div className="pt-button-group pt-minimal discussion-pinned-overlay-buttons">
							{!isNew &&
								<button className="pt-button" onClick={this.togglePin}>Unpin</button>
							}
							{!isNew && !!pubData.versions.length &&
								<a
									href={`/pub/${this.props.locationData.params.slug}/discussions/${activeThread[0] ? activeThread[0].threadNumber : ''}`}
									className="pt-button"
								>
									Permalink
								</a>
							}
							<button className="pt-button" onClick={this.props.onClose}>Close</button>
						</div>
						<div className="pinned-thread pt-elevation-4">
							{!isNew &&
								<DiscussionThread
									pubData={this.props.pubData}
									discussions={activeThread}
									canManage={pubData.localPermissions === 'manage' || (this.props.loginData.isAdmin && pubData.adminPermissions === 'manage')}
									slug={pubData.slug}
									loginData={this.props.loginData}
									pathname={`${this.props.locationData.path}${this.props.locationData.queryString}`}
									handleReplySubmit={this.props.onPostDiscussion}
									handleReplyEdit={this.props.onPutDiscussion}
									submitIsLoading={this.props.postDiscussionIsLoading}
									getHighlightContent={this.props.getHighlightContent}
									handleQuotePermalink={quotePermalinkFunc}
									hoverBackgroundColor={this.props.communityData.accentMinimalColor}
									onPublish={this.props.onPublish}
									publishIsLoading={this.props.postVersionIsLoading}
								/>
							}
							{isNew &&
								<div>
									{!this.props.loginData.id &&
										<div className="login-wrapper">
											<a href={`/login?redirect=${this.props.locationData.path}`} className="pt-button pt-fill">
												Login to Add Discussion
											</a>
										</div>
									}

									<div className={this.props.loginData.id ? '' : 'disabled'}>
										<DiscussionInput
											initialContent={this.props.initialContent}
											handleSubmit={this.handleNewDiscussionSubmit}
											showTitle={true}
											submitIsLoading={this.props.postDiscussionIsLoading}
											getHighlightContent={this.props.getHighlightContent}
										/>
									</div>
								</div>
							}
						</div>
					</div>
				}
				<Overlay isOpen={isActive && !isPinned} onClose={this.props.onClose} maxWidth={728}>
					<div className="pt-button-group pt-minimal discussion-viewer-overlay-buttons">
						<button className="pt-button" onClick={this.togglePin}>Pin to Side</button>
						{!!pubData.versions.length &&
							<a
								href={`/pub/${this.props.locationData.params.slug}/discussions/${activeThread[0] ? activeThread[0].threadNumber : ''}`}
								className="pt-button"
							>
								Permalink
							</a>
						}
						<button className="pt-button" onClick={this.props.onClose}>Close</button>
					</div>
					<DiscussionThread
						pubData={this.props.pubData}
						discussions={activeThread}
						canManage={pubData.localPermissions === 'manage' || (this.props.loginData.isAdmin && pubData.adminPermissions === 'manage')}
						slug={pubData.slug}
						loginData={this.props.loginData}
						pathname={`${this.props.locationData.path}${this.props.locationData.queryString}`}
						handleReplySubmit={this.props.onPostDiscussion}
						handleReplyEdit={this.props.onPutDiscussion}
						submitIsLoading={this.props.postDiscussionIsLoading}
						getHighlightContent={this.props.getHighlightContent}
						handleQuotePermalink={quotePermalinkFunc}
						hoverBackgroundColor={this.props.communityData.accentMinimalColor}
						onPublish={this.props.onPublish}
						publishIsLoading={this.props.postVersionIsLoading}
					/>
				</Overlay>
			</div>
		);
	}
}

DiscussionViewer.propTypes = propTypes;
DiscussionViewer.defaultProps = defaultProps;
export default DiscussionViewer;
