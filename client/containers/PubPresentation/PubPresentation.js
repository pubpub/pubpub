import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Overlay from 'components/Overlay/Overlay';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresSideUser from 'components/PubPresSideUser/PubPresSideUser';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import PubPresVersions from 'components/PubPresVersions/PubPresVersions';
import PubPresInvite from 'components/PubPresInvite/PubPresInvite';
import PubPresShare from 'components/PubPresShare/PubPresShare';
import PubPresCite from 'components/PubPresCite/PubPresCite';
import PubPresChapters from 'components/PubPresChapters/PubPresChapters';
import PubPresDoi from 'components/PubPresDoi/PubPresDoi';
import DiscussionList from 'components/DiscussionList/DiscussionList';
import DiscussionViewer from 'components/DiscussionViewer/DiscussionViewer';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import PubBody from 'components/PubBody/PubBody';
import License from 'components/License/License';
// import dateFormat from 'dateformat';
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
			postDoiIsLoading: false,
			isArchivedVisible: false,
			docReadyForHighlights: false,
			initialContent: undefined,
			fixIt: false,
			scrolledToPermanent: false,
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
		this.handlePostDoi = this.handlePostDoi.bind(this);
		this.handlePutLabels = this.handlePutLabels.bind(this);
	}
	componentDidMount() {
		this.pubSideContent = document.getElementsByClassName('pub-side-content')[0];
		this.discussions = document.getElementById('discussions');
		if (this.pubSideContent && this.discussions) {
			window.addEventListener('scroll', this.handleScroll);
		}
	}
	componentWillUnmount() {
		if (this.pubSideContent && this.discussions) {
			window.removeEventListener('scroll', this.handleScroll);
		}
	}

	getHighlightContent(from, to) {
		const primaryEditorState = this.state.editorRef.state.editorState;
		if (!primaryEditorState || primaryEditorState.doc.nodeSize < from || primaryEditorState.doc.nodeSize < to) { return {}; }
		const exact = primaryEditorState.doc.textBetween(from, to);
		const prefix = primaryEditorState.doc.textBetween(Math.max(0, from - 10), Math.max(0, from));
		const suffix = primaryEditorState.doc.textBetween(Math.min(primaryEditorState.doc.nodeSize - 2, to), Math.min(primaryEditorState.doc.nodeSize - 2, to + 10));
		const hasChapters = Array.isArray(this.state.pubData.versions[0].content);
		const chapterIndex = this.props.locationData.params.chapterId
			? Number(this.props.locationData.params.chapterId) - 1
			: 0;
		const thing = {
			exact: exact,
			prefix: prefix,
			suffix: suffix,
			from: from,
			to: to,
			version: this.props.pubData.versions[0].id,
			chapter: hasChapters ? String(chapterIndex + 1) : undefined,
			id: `h${generateHash(8)}`, // Has to start with letter since it's a classname
		};
		return thing;
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
	handlePutLabels(newLabels) {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				labels: newLabels,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: { ...this.state.pubData, ...result },
			});
		})
		.catch((err)=> {
			console.error('Error saving labels', err);
		});
	}
	handlePostDoi() {
		this.setState({ postDoiIsLoading: true });
		return apiFetch('/api/doi', {
			method: 'POST',
			body: JSON.stringify({
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
				versionId: this.props.pubData.versions[0].id,
				slug: this.props.pubData.slug,
			})
		})
		.then((updatedPubData)=> {
			this.setState({
				postDoiIsLoading: false,
				pubData: {
					...this.state.pubData,
					...updatedPubData,
				},
			});
		})
		.catch(()=> {
			this.setState({ postDoiIsLoading: false });
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
		// const versionsList = pubData.versionsList.map((item)=> {
		// 	if (item.id === activeVersion.id) {
		// 		return { ...item, isActive: true };
		// 	}
		// 	return item;
		// });
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === Number(this.props.locationData.params.subMode)) {
				return curr;
			}
			return prev;
		}, []);
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
			if (!this.state.scrolledToPermanent) {
				setTimeout(()=> {
					const thing = document.getElementsByClassName('permanent')[0];
					if (thing) {
						window.scrollTo(0, thing.getBoundingClientRect().top - 135);
						this.setState({ scrolledToPermanent: true });
					}
				}, 100);
			}
		}

		const hasChapters = activeVersion && Array.isArray(activeVersion.content);
		const chapterIndex = this.props.locationData.params.chapterId
			? Number(this.props.locationData.params.chapterId) - 1
			: 0;
		// If we have an array, set the chapter index


		let activeContent;
		if (hasChapters) {
			activeContent = activeVersion.content[chapterIndex].content;
		}
		if (activeVersion && !hasChapters) {
			activeContent = activeVersion.content;
		}

		const authors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isAuthor;
		});
		const contributors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isContributor;
		});

		const mode = this.props.locationData.params.mode;
		const subMode = this.props.locationData.params.subMode;
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
								action={<a href={`/pub/${this.props.locationData.params.slug}/collaborate`} className="pt-button pt-intent-primary">View the Working Draft</a>}
							/>
						</div>
					}
					{!!pubData.versions.length && !mode &&
						<div>
							<PubPresHeader
								pubData={pubData}
								locationData={this.props.locationData}
								setOverlayPanel={this.setOverlayPanel}
								loginData={this.props.loginData}
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
													{Array.isArray(activeVersion.content) &&
														<div>
															<span className="title">Chapters</span>
															<button onClick={()=> { this.setOverlayPanel('chapters'); }} className="pt-button pt-minimal pt-small pt-icon-properties">
																All
															</button>
															<a href={`/pub/${pubData.slug}/chapter/${chapterIndex}${queryObject.version ? `?version=${queryObject.version}` : ''}`} className={`pt-button pt-minimal pt-small arrow pt-icon-arrow-left ${chapterIndex !== 0 ? '' : ' hidden'}`} />
															<a href={`/pub/${pubData.slug}/chapter/${chapterIndex + 2}${queryObject.version ? `?version=${queryObject.version}` : ''}`} className={`pt-button pt-minimal pt-small arrow pt-icon-arrow-right ${chapterIndex !== activeVersion.content.length - 1 ? '' : ' hidden'}`} />
														</div>
													}
													<span className="title">Discussions</span>
													{!!discussions.length &&
														<a href="#discussions" className="pt-button pt-minimal pt-small pt-icon-chat">
															{discussions.length}
														</a>
													}
													<button onClick={()=> { this.setActiveThread('new'); }} className="pt-button pt-minimal pt-small pt-icon-add">
														Add
													</button>

													<span className="title">Share</span>
													<button onClick={()=> { this.setOverlayPanel('share'); }} className="pt-button pt-minimal pt-small share-button">
														<span className="pt-icon-standard pt-icon-twitter" />
														<span className="pt-icon-standard pt-icon-facebook" />
														<span className="pt-icon-standard pt-icon-envelope" />
													</button>
												</div>
											}
										</div>
										<div className="pub-main-content">
											<PubBody
												onRef={this.handleEditorRef}
												versionId={activeVersion.id}
												chapterNumber={hasChapters ? String(chapterIndex + 1) : undefined}
												content={activeContent}
												threads={threads}
												slug={pubData.slug}
												highlights={this.state.docReadyForHighlights ? highlights : []}
												hoverBackgroundColor={this.props.communityData.accentMinimalColor}
												setActiveThread={this.setActiveThread}
												onNewHighlightDiscussion={this.handleNewHighlightDiscussion}
											/>
											{Array.isArray(activeVersion.content) &&
												<div className="bottom-chapter-buttons pt-button-group pt-fill pt-minimal pt-large">
													<a
														href={`/pub/${pubData.slug}/chapter/${chapterIndex}${queryObject.version ? `?version=${queryObject.version}` : ''}`}
														className={`pt-button pt-icon-arrow-left ${chapterIndex !== 0 ? '' : ' disabled'}`}
													>
														Previous
													</a>
													<button
														onClick={()=> { this.setOverlayPanel('chapters'); }}
														className="pt-button pt-icon-properties"
													>
														Chapters
													</button>
													<a
														href={`/pub/${pubData.slug}/chapter/${chapterIndex + 2}${queryObject.version ? `?version=${queryObject.version}` : ''}`}
														className={`pt-button ${chapterIndex !== activeVersion.content.length - 1 ? '' : ' disabled'}`}
													>
														Next
														<span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
													</a>
												</div>
											}
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
											<DiscussionList
												pubData={pubData}
												onPreviewClick={this.setActiveThread}
												onLabelsSave={this.handlePutLabels}
											/>
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
									communityData={this.props.communityData}
									pubData={pubData}
									canManage={false}
									collaboratorsOnly={true}
								/>
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'invite'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubPresInvite pubData={pubData} />
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'versions'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubPresVersions pubData={pubData} />
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'cite'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubPresCite pubData={pubData} />
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'chapters'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubPresChapters
									pubData={pubData}
									locationData={this.props.locationData}
								/>
							</Overlay>
							<Overlay isOpen={this.state.activePanel === 'share'} onClose={this.closePanelOverlay} maxWidth={728}>
								<PubPresShare
									pubData={pubData}
									communityData={this.props.communityData}
								/>
							</Overlay>
							{this.props.loginData.isAdmin &&
								<Overlay isOpen={this.state.activePanel === 'doi'} onClose={this.closePanelOverlay} maxWidth={728}>
									<PubPresDoi
										pubData={pubData}
										postDoiIsLoading={this.state.postDoiIsLoading}
										onAssignDoi={this.handlePostDoi}
									/>
								</Overlay>
							}
						</div>
					}
					{!!pubData.versions.length && mode &&
						<div>
							<PubPresHeader
								pubData={pubData}
								setOverlayPanel={this.setOverlayPanel}
								locationData={this.props.locationData}
								loginData={this.props.loginData}
							/>
							<div className="container pub mode-content">
								<div className="row">
									<div className="col-12">
										{mode === 'versions' &&
											<PubPresVersions pubData={pubData} mode={mode} />
										}
										{mode === 'invite' &&
											<PubPresInvite pubData={pubData} mode={mode} />
										}
										{mode === 'chapters' &&
											<PubPresChapters
												pubData={pubData}
												locationData={this.props.locationData}
												mode={mode}
											/>
										}
										{mode === 'collaborators' &&
											<PubCollabShare
												communityData={this.props.communityData}
												pubData={pubData}
												canManage={false}
												collaboratorsOnly={true}
												mode={mode}
											/>
										}
										{mode === 'discussions' && !subMode &&
											<DiscussionList
												pubData={pubData}
												mode={mode}
												onLabelsSave={this.handlePutLabels}
											/>
										}
										{mode === 'discussions' && subMode &&
											<DiscussionThread
												pubData={pubData}
												discussions={activeThread}
												canManage={pubData.localPermissions === 'manage' || (this.props.loginData.isAdmin && pubData.adminPermissions === 'manage')}
												slug={pubData.slug}
												loginData={this.props.loginData}
												pathname={`${this.props.locationData.path}${this.props.locationData.queryString}`}
												handleReplySubmit={this.handlePostDiscussion}
												handleReplyEdit={this.handlePutDiscussion}
												submitIsLoading={this.state.postDiscussionIsLoading}
												hideScrollButton={true}
												getHighlightContent={()=>{}}
												hoverBackgroundColor={this.props.communityData.accentMinimalColor}
											/>
										}
									</div>
								</div>
							</div>
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
