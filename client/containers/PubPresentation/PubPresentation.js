import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Overlay from 'components/Overlay/Overlay';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresSideUser from 'components/PubPresSideUser/PubPresSideUser';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import DiscussionList from 'components/DiscussionList/DiscussionList';
import DiscussionViewer from 'components/DiscussionViewer/DiscussionViewer';
import PubBody from 'components/PubBody/PubBody';
import License from 'components/License/License';
import dateFormat from 'dateformat';
import { apiFetch, hydrateWrapper, nestDiscussionsToThreads, generateHash } from 'utilities';

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
			editorRef: undefined,
			activeThreadNumber: undefined,
			activePanel: undefined,
			pubData: this.props.pubData,
			postDiscussionIsLoading: false,
			isArchivedVisible: false,
			docReadyForHighlights: false,
			initialContent: undefined,
			fixIt: false,
		};

		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.closePanelOverlay = this.closePanelOverlay.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
		this.setOverlayPanel = this.setOverlayPanel.bind(this);
		this.setActiveThread = this.setActiveThread.bind(this);
		this.getHighlightContent = this.getHighlightContent.bind(this);
		this.handleEditorRef = this.handleEditorRef.bind(this);
		this.toggleArchivedVisible = this.toggleArchivedVisible.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		this.pubSideContent = document.getElementsByClassName('pub-side-content')[0];
		this.discussions = document.getElementById('discussions');
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
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
			version: this.props.pubData.versions[0].id,
			id: `h${generateHash(8)}`, // Has to start with letter since it's a classname
		};
	}
	setOverlayPanel(panel) {
		this.setState({ activePanel: panel });
	}
	setActiveThread(threadNumber) {
		this.setState({ activeThreadNumber: threadNumber });
	}
	closeThreadOverlay() {
		this.setState({
			activeThreadNumber: undefined,
			initialContent: undefined,
		});
	}
	closePanelOverlay() {
		this.setState({ activePanel: undefined });
	}
	handleScroll() {
		if (!this.state.activeThreadNumber) {
			if (!this.state.fixIt) {
				const isPastTopSide = this.pubSideContent.getBoundingClientRect().bottom < -25;
				const isBeforeDiscussions = this.discussions.getBoundingClientRect().top > window.innerHeight;
				if (isPastTopSide && isBeforeDiscussions) {
					this.setState({ fixIt: true });
				}
			} else {
				const isBeforeTopSide = this.pubSideContent.getBoundingClientRect().bottom > -25;
				const isAfterDiscussions = this.discussions.getBoundingClientRect().top < window.innerHeight;
				if (isBeforeTopSide || isAfterDiscussions) {
					this.setState({ fixIt: false });
				}
			}
		}
	}
	handlePostDiscussion(discussionObject) {
		this.setState({ postDiscussionIsLoading: true });
		return apiFetch('/api/discussions', {
			method: 'POST',
			body: JSON.stringify({
				...discussionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				postDiscussionIsLoading: false,
				activeThreadNumber: result.threadNumber,
				pubData: {
					...this.state.pubData,
					discussions: [
						...this.state.pubData.discussions,
						result,
					],
				},
			});
		})
		.catch(()=> {
			this.setState({ postDiscussionIsLoading: false });
		});
	}
	handlePutDiscussion(discussionObject) {
		return apiFetch('/api/discussions', {
			method: 'PUT',
			body: JSON.stringify({
				...discussionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					discussions: this.state.pubData.discussions.map((item)=> {
						if (item.id !== result.id) { return item; }
						return {
							...item,
							...result,
						};
					}),
				},
			});
		});
	}
	handleEditorRef(ref) {
		if (!this.state.editorRef) {
			/* Need to set timeout so DOM can render */
			setTimeout(()=> {
				this.setState({
					editorRef: ref,
					docReadyForHighlights: true,
				});
			}, 0);
		}
	}
	handleNewHighlightDiscussion(highlightObject) {
		this.setState({
			activeThreadNumber: 'new',
			initialContent: {
				type: 'doc',
				attrs: { meta: {} },
				content: [
					{ type: 'highlightQuote', attrs: { ...highlightObject, id: `h${generateHash(8)}` } },
					{ type: 'paragraph', content: [] },
				]
			}
		});
	}
	toggleArchivedVisible() {
		this.setState({ isArchivedVisible: !this.state.isArchivedVisible });
	}

	render() {
		const pubData = this.state.pubData;
		const activeVersion = pubData.versions[0];
		const versionsList = pubData.versionsList.map((item)=> {
			if (item.id === activeVersion.id) {
				return { ...item, isActive: true };
			}
			return item;
		});
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const highlights = discussions.filter((item)=> {
			return !item.isArchived && item.highlights;
		}).reduce((prev, curr)=> {
			const highlightsWithThread = curr.highlights.map((item)=> {
				return { ...item, threadNumber: curr.threadNumber };
			});
			return [...prev, ...highlightsWithThread];
		}, []);
		const queryObject = this.props.locationData.query;
		if (typeof window !== 'undefined' && this.state.editorRef && queryObject.from && queryObject.to && queryObject.version) {
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

		const authors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isAuthor;
		});
		const contributors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isContributor;
		});

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
								pubData={pubData}
								setOverlayPanel={this.setOverlayPanel}
							/>

							<div className="container pub">
								<div className="row">
									<div className="col-12">
										<div className="pub-side-content">
											{!!authors.length &&
												<div className="side-block">
													<p>
														<a
															href={`/pub/${pubData.slug}/collaborators`}
															onClick={(evt)=> {
																evt.preventDefault();
																this.setOverlayPanel('collaborators');
															}}
														>
															Authors
														</a>
													</p>

													{authors.sort((foo, bar)=> {
														if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
														if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
														if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
														if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
														return 0;
													}).map((item)=> {
														return <PubPresSideUser user={item} key={item.id} />;
													})}
												</div>
											}
											{!!contributors.length &&
												<div className="side-block">
													<p>
														<a
															href={`/pub/${pubData.slug}/collaborators`}
															onClick={(evt)=> {
																evt.preventDefault();
																this.setOverlayPanel('collaborators');
															}}
														>
															Contributors
														</a>
													</p>
													{contributors.sort((foo, bar)=> {
														if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
														if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
														if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
														if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
														return 0;
													}).map((item)=> {
														return <PubPresSideUser user={item} key={item.id} />;
													})}
												</div>
											}
											{!this.state.activeThreadNumber &&
												<div className={`side-block fix-it ${this.state.fixIt ? 'fixed' : ''}`}>
													<span className="title">Discussions</span>
													{!!discussions.length &&
														<a href="#discussions" className="pt-button pt-minimal pt-small pt-icon-chat">
															{discussions.length}
														</a>
													}
													<button onClick={()=> { this.setActiveThread('new'); }} className="pt-button pt-minimal pt-small pt-icon-add">
														Add
													</button>
												</div>
											}
										</div>
										<div className="pub-main-content">
											<PubBody
												onRef={this.handleEditorRef}
												versionId={activeVersion.id}
												content={activeVersion.content}
												threads={threads}
												slug={pubData.slug}
												highlights={this.state.docReadyForHighlights ? highlights : []}
												hoverBackgroundColor={this.props.communityData.accentMinimalColor}
												setActiveThread={this.setActiveThread}
												onNewHighlightDiscussion={this.handleNewHighlightDiscussion}
											/>
											<div className="license-wrapper">
												<License />
											</div>
										</div>
									</div>
								</div>
							</div>

							<div id="discussions">
								<div className="container pub">
									<div className="row">
										<div className="col-12">
											<DiscussionList pubData={pubData} onPreviewClick={this.setActiveThread} />
										</div>
									</div>
								</div>
							</div>

							<DiscussionViewer
								pubData={pubData}
								loginData={this.props.loginData}
								locationData={this.props.locationData}
								communityData={this.props.communityData}
								activeThreadNumber={this.state.activeThreadNumber}
								onClose={this.closeThreadOverlay}
								getHighlightContent={this.getHighlightContent}
								onPostDiscussion={this.handlePostDiscussion}
								onPutDiscussion={this.handlePutDiscussion}
								postDiscussionIsLoading={this.state.postDiscussionIsLoading}
								initialContent={this.state.initialContent}
							/>
							<Overlay isOpen={this.state.activePanel === 'collaborators'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubCollabShare
									appData={this.props.communityData}
									pubData={pubData}
									canManage={false}
									collaboratorsOnly={true}
								/>
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'versions'} onClose={this.closePanelOverlay} maxWidth={728}>
								<div>
									<h6 style={{ paddingRight: '0px' }}>Published Snapshots</h6>
									<ul>
										{versionsList.sort((foo, bar)=>{
											if (foo.createdAt < bar.createdAt) { return 1; }
											if (foo.createdAt > bar.createdAt) { return -1; }
											return 0;
										}).map((version)=> {
											return (
												<li key={`version-${version.id}`}>
													<a href={`/pub/${pubData.slug}?version=${version.id}`} className="pt-menu-item pt-popover-dismiss">
														<span style={{ fontWeight: version.isActive ? '600' : 'normal' }}>
															{dateFormat(version.createdAt, 'mmm dd, yyyy · HH:MM')}
														</span>
													</a>
												</li>
											);
										})}
									</ul>
								</div>
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
