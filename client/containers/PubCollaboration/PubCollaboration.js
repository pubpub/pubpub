import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import uuidv4 from 'uuid/v4';
import Overlay from 'components/Overlay/Overlay';
import PubCollabEditor from 'components/PubCollabEditor/PubCollabEditor';
import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import PubCollabPublish from 'components/PubCollabPublish/PubCollabPublish';
import PubCollabSubmit from 'components/PubCollabSubmit/PubCollabSubmit';
import PubCollabDetails from 'components/PubCollabDetails/PubCollabDetails';
import PubCollabCollections from 'components/PubCollabCollections/PubCollabCollections';
import PubCollabChapters from 'components/PubCollabChapters/PubCollabChapters';
import DiscussionList from 'components/DiscussionList/DiscussionList';
import DiscussionViewer from 'components/DiscussionViewer/DiscussionViewer';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { apiFetch, hydrateWrapper, getFirebaseConfig, nestDiscussionsToThreads, getRandomColor, generateHash } from 'utilities';

require('./pubCollaboration.scss');
require('components/PubBody/pubBody.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubCollaboration extends Component {
	constructor(props) {
		super(props);
		const loginData = props.loginData;
		const loginId = loginData.id || `anon-${Math.floor(Math.random() * 9999)}`;
		const userColor = getRandomColor(loginId);
		this.localUser = {
			id: loginId,
			backgroundColor: `rgba(${userColor}, 0.2)`,
			cursorColor: `rgba(${userColor}, 1.0)`,
			image: loginData.avatar || null,
			name: loginData.fullName || 'Anonymous',
			initials: loginData.initials || '?',
			canEdit: props.pubData.localPermissions === 'edit' || props.pubData.localPermissions === 'manage',
			firebaseToken: props.pubData.firebaseToken,
		};

		this.state = {
			isPublishOpen: false,
			isSubmitOpen: false,
			isShareOpen: false,
			isDetailsOpen: false,
			isCollaboratorsOpen: false,
			isCollectionsOpen: false,
			isArchivedVisible: false,
			isChaptersOpen: false,
			activeCollaborators: [this.localUser],
			// initNewDoc: undefined,
			collabStatus: 'connecting',

			// thread: undefined,
			pubData: props.pubData,
			putPubIsLoading: false,
			deletePubIsLoading: false,
			postDiscussionIsLoading: false,
			postVersionIsLoading: false,
			docReadyForHighlights: false,

			activeThreadNumber: undefined,
			initialContent: undefined,
			fixIt: true,
			scrolledToPermanent: false,

			chaptersData: [{ id: '', order: 0, title: 'Introduction' }],
			compositeEditorKey: props.pubData.editorKey,
			activeChapterIndex: 0,
		};
		this.editorRef = undefined;
		this.setActiveThread = this.setActiveThread.bind(this);
		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.togglePublish = this.togglePublish.bind(this);
		this.toggleSubmit = this.toggleSubmit.bind(this);
		this.toggleShare = this.toggleShare.bind(this);
		this.toggleDetails = this.toggleDetails.bind(this);
		this.toggleCollaborators = this.toggleCollaborators.bind(this);
		this.toggleCollections = this.toggleCollections.bind(this);
		this.toggleChapters = this.toggleChapters.bind(this);
		this.toggleArchivedVisible = this.toggleArchivedVisible.bind(this);
		this.handleDetailsSave = this.handleDetailsSave.bind(this);
		this.handlePutLabels = this.handlePutLabels.bind(this);
		this.handlePubDelete = this.handlePubDelete.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
		this.handleCollaboratorAdd = this.handleCollaboratorAdd.bind(this);
		this.handleCollaboratorUpdate = this.handleCollaboratorUpdate.bind(this);
		this.handleCollaboratorDelete = this.handleCollaboratorDelete.bind(this);
		this.onOpenShare = this.onOpenShare.bind(this);
		this.onOpenDetails = this.onOpenDetails.bind(this);
		this.onOpenCollaborators = this.onOpenCollaborators.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
		this.handleClientChange = this.handleClientChange.bind(this);
		this.handleAddCollection = this.handleAddCollection.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
		// this.handleHighlightClick = this.handleHighlightClick.bind(this);
		this.getHighlightContent = this.getHighlightContent.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		// this.handleThreadClick = this.handleThreadClick.bind(this);
		this.handleEditorRef = this.handleEditorRef.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleChapterAdd = this.handleChapterAdd.bind(this);
		this.handleChaptersChange = this.handleChaptersChange.bind(this);
		this.handleChapterSet = this.handleChapterSet.bind(this);
		this.incrementChapter = this.incrementChapter.bind(this);
		this.decrementChapter = this.decrementChapter.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		this.discussions = document.getElementById('discussions');
		const chaptersFirebaseAppName = `chapters-${this.props.pubData.editorKey}`;
		const existingApp = firebase.apps.reduce((prev, curr)=> {
			if (curr.name === chaptersFirebaseAppName) { return curr; }
			return prev;
		}, undefined);
		this.firebaseApp = existingApp || firebase.initializeApp(getFirebaseConfig(), chaptersFirebaseAppName);
		const database = firebase.database(this.firebaseApp);
		firebase.auth(this.firebaseApp).signInWithCustomToken(this.props.pubData.firebaseToken)
		.then(()=> {
			this.firebaseChaptersRef = database.ref(`${this.props.pubData.editorKey}/chapters`);
			this.firebaseChaptersCallback = this.firebaseChaptersRef.on('value', (snapshot) => {
				const snapshotVal = snapshot.val() || this.state.chaptersData;
				const snapshotArray = Object.keys(snapshotVal).map((key)=> {
					return {
						...snapshotVal[key],
						firebaseId: key,
					};
				});
				const newChaptersData = snapshotArray.length
					? snapshotArray.sort((foo, bar)=> {
						if (foo.order < bar.order) { return -1; }
						if (foo.order > bar.order) { return 1; }
						return 0;
					})
					: [];
				this.setState({ chaptersData: newChaptersData });
			});
		});
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		this.firebaseChaptersRef.off('value', this.firebaseChaptersCallback);
	}
	handleScroll() {
		if (!this.state.activeThreadNumber) {
			if (!this.state.fixIt) {
				const isBeforeDiscussions = this.discussions.getBoundingClientRect().top > window.innerHeight;
				if (isBeforeDiscussions) {
					this.setState({ fixIt: true });
				}
			} else {
				const isAfterDiscussions = this.discussions.getBoundingClientRect().top < window.innerHeight;
				if (isAfterDiscussions) {
					this.setState({ fixIt: false });
				}
			}
		}
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
	onOpenShare() {
		this.setState({
			isShareOpen: true,
			isDetailsOpen: false,
			isCollaboratorsOpen: false,
			isPublishOpen: false,
		});
	}
	onOpenDetails() {
		this.setState({
			isShareOpen: false,
			isDetailsOpen: true,
			isCollaboratorsOpen: false,
			isPublishOpen: false,
		});
	}
	onOpenCollaborators() {
		this.setState({
			isShareOpen: false,
			isDetailsOpen: false,
			isCollaboratorsOpen: true,
			isPublishOpen: false,
		});
	}
	getHighlightContent(from, to) {
		const primaryEditorState = this.editorRef.state.editorState;
		if (primaryEditorState.doc.nodeSize < from || primaryEditorState.doc.nodeSize < to) { return {}; }
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
			id: `h${generateHash(8)}`, /* Has to start with letter since it's a classname */
		};
	}
	togglePublish() {
		this.setState({ isPublishOpen: !this.state.isPublishOpen });
	}
	toggleSubmit() {
		this.setState({ isSubmitOpen: !this.state.isSubmitOpen });
	}
	toggleShare() {
		this.setState({ isShareOpen: !this.state.isShareOpen });
	}
	toggleDetails() {
		this.setState({ isDetailsOpen: !this.state.isDetailsOpen });
	}
	toggleCollaborators() {
		this.setState({ isCollaboratorsOpen: !this.state.isCollaboratorsOpen });
	}
	toggleCollections() {
		this.setState({ isCollectionsOpen: !this.state.isCollectionsOpen });
	}
	toggleChapters() {
		this.setState({ isChaptersOpen: !this.state.isChaptersOpen });
	}
	toggleArchivedVisible() {
		this.setState({ isArchivedVisible: !this.state.isArchivedVisible });
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
	handleChapterAdd() {
		const newChaptersData = this.state.chaptersData;
		newChaptersData.push({
			order: this.state.chaptersData.length,
			title: 'New Chapter',
			id: uuidv4(),
		});
		this.firebaseChaptersRef.set(newChaptersData);
	}
	handleChaptersChange(newChaptersArray) {
		const newChaptersData = {};
		newChaptersArray.forEach((chapter)=> {
			newChaptersData[chapter.firebaseId] = {
				...chapter,
				firebaseId: null,
			};
		});
		this.firebaseChaptersRef.set(newChaptersData);
	}
	handleChapterSet(chapterId) {
		this.setState({
			compositeEditorKey: `${this.props.pubData.editorKey}/${chapterId}`,
			isChaptersOpen: false,
			activeChapterIndex: this.state.chaptersData.reduce((prev, curr, index)=> {
				if (curr.id === chapterId) { return index; }
				return prev;
			}, 0)
		});
	}
	incrementChapter() {
		const newActiveIndex = this.state.activeChapterIndex + 1;
		const newActiveChapter = this.state.chaptersData[newActiveIndex];
		this.setState({
			compositeEditorKey: `${this.props.pubData.editorKey}/${newActiveChapter.id}`,
			activeChapterIndex: newActiveIndex
		});
	}
	decrementChapter() {
		const newActiveIndex = this.state.activeChapterIndex - 1;
		const newActiveChapter = this.state.chaptersData[newActiveIndex];
		this.setState({
			compositeEditorKey: `${this.props.pubData.editorKey}/${newActiveChapter.id}`,
			activeChapterIndex: newActiveIndex
		});
	}

	// handleHighlightClick(threadNumber) {
	// 	this.setState({ thread: threadNumber });
	// }
	handleDetailsSave(detailsObject) {
		this.setState({ putPubIsLoading: true });
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...detailsObject,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			/* Load new URL if slug changes */
			if (detailsObject.slug && detailsObject.slug !== this.props.locationData.params.slug) {
				window.location.href = `/pub/${detailsObject.slug}/collaborate`;
			} else {
				this.setState({
					isDetailsOpen: false,
					putPubIsLoading: false,
					pubData: { ...this.state.pubData, ...result },
				});
			}
		})
		.catch(()=> {
			this.setState({ putPubIsLoading: false });
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
	handlePubDelete(pubId) {
		this.setState({ deletePubIsLoading: true });
		return apiFetch('/api/pubs', {
			method: 'DELETE',
			body: JSON.stringify({
				pubId: pubId,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			window.location.href = '/';
		})
		.catch(()=> {
			this.setState({ deletePubIsLoading: false });
		});
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
				isSubmitOpen: false,
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
	handleCollaboratorAdd(collaboratorObject) {
		return apiFetch('/api/collaborators', {
			method: 'POST',
			body: JSON.stringify({
				...collaboratorObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					collaborators: [
						...this.state.pubData.collaborators,
						result,
					]
				},
			});
		});
	}
	handleCollaboratorUpdate(collaboratorObject) {
		return apiFetch('/api/collaborators', {
			method: 'PUT',
			body: JSON.stringify({
				...collaboratorObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					collaborators: this.state.pubData.collaborators.map((item)=> {
						if (item.Collaborator.id === result.Collaborator.id) {
							return {
								...item,
								fullName: result.fullName || item.fullName,
								Collaborator: {
									...item.Collaborator,
									...result.Collaborator,
								}
							};
						}
						return item;
					})
				},
			});
		});
	}
	handleCollaboratorDelete(collaboratorObject) {
		return apiFetch('/api/collaborators', {
			method: 'DELETE',
			body: JSON.stringify({
				...collaboratorObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					collaborators: this.state.pubData.collaborators.filter((item)=> {
						return item.Collaborator.id !== result;
					})
				},
			});
		});
	}
	handleAddCollection(addCollectionObject) {
		return apiFetch('/api/collectionPubs', {
			method: 'POST',
			body: JSON.stringify({
				...addCollectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					collections: [
						...this.state.pubData.collections,
						result,
					]
				},
			});
		});
	}
	handleRemoveCollection(removeCollectionObject) {
		return apiFetch('/api/collectionPubs', {
			method: 'DELETE',
			body: JSON.stringify({
				...removeCollectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.setState({
				pubData: {
					...this.state.pubData,
					collections: this.state.pubData.collections.filter((item)=> {
						return item.id !== result;
					})
				},
			});
		});
	}
	handleStatusChange(status) {
		clearTimeout(this.setSavingTimeout);

		/* If loading, wait until 'connected' */
		if (this.state.collabStatus === 'connecting' && status === 'connected') {
			this.setState({ collabStatus: status });
		}
		if (this.state.collabStatus !== 'connecting' && this.state.collabStatus !== 'disconnected') {
			if (status === 'saving') {
				this.setSavingTimeout = setTimeout(()=> {
					this.setState({ collabStatus: status });
				}, 250);
			} else {
				this.setState({ collabStatus: status });
			}
		}
		/* If disconnected, only set state if the new status is 'connected' */
		if (this.state.collabStatus === 'disconnected' && status === 'connected') {
			this.setState({ collabStatus: status });
		}
	}
	handlePublish(submitHash) {
		// We need to keep track of chapter metadata in the firebase
		// We also need to store the chapter metadata on the version object
		// So we have to manage firebase credentials from pubpub also it seems.
		this.setState({ postVersionIsLoading: true });
		const editorRefs = this.state.chaptersData.map((item)=> {
			return `${this.props.pubData.editorKey}/${item.id}`;
		});
		this.editorRef.getCollabJSONs(editorRefs)
		.then((content)=> {
			const newContent = content.length === 1
				? content[0]
				: content.map((item, index)=> {
					return {
						title: this.state.chaptersData[index].title,
						id: this.state.chaptersData[index].id,
						content: item,
					};
				});
			return apiFetch('/api/versions', {
				method: 'POST',
				body: JSON.stringify({
					pubId: this.props.pubData.id,
					communityId: this.props.communityData.id,
					// content: this.editorRef.view.state.doc.toJSON(),
					// content: content.length > 1 ? content : content[0],
					content: newContent,
					submitHash: submitHash,
				})
			});
		})
		.then(()=> {
			window.location.href = `/pub/${this.props.locationData.params.slug}`;
		})
		.catch((err)=> {
			console.log('Error Publishing', err);
			this.setState({ postVersionIsLoading: false });
		});
	}
	handleClientChange(clients) {
		this.setState({
			activeCollaborators: [this.localUser, ...clients]
		});
	}
	// handleThreadClick(threadNumber) {
	// 	document.getElementsByClassName('side-panel-content')[0].scrollTop = 0;
	// 	this.setState({
	// 		thread: threadNumber,
	// 	});
	// }
	handleEditorRef(ref) {
		this.editorRef = ref;
		/* This timeout is how long we think */
		/* it will take the firebase server to */
		/* initalize the most recent doc and steps. */
		/* It doesn't hurt to be a bit conservative here */
		setTimeout(()=> {
			this.setState({ docReadyForHighlights: true });
		}, 2500);
	}
	render() {
		const queryObject = this.props.locationData.query;

		const pubData = this.state.pubData;
		const loginData = this.props.loginData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const submissionThreadNumber = threads.reduce((prev, curr)=> {
			if (curr[0].submitHash && !curr[0].isArchived) { return curr[0].threadNumber; }
			return prev;
		}, undefined);
		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === Number(this.state.activeThreadNumber)) { return curr; }
			return prev;
		}, undefined);

		// const activeThreads = threads.filter((items)=> {
		// 	return items.reduce((prev, curr)=> {
		// 		if (curr.isArchived) { return false; }
		// 		return prev;
		// 	}, true);
		// }).sort((foo, bar)=> {
		// 	if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
		// 	if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
		// 	return 0;
		// });

		// const archivedThreads = threads.filter((items)=> {
		// 	return items.reduce((prev, curr)=> {
		// 		if (curr.isArchived) { return true; }
		// 		return prev;
		// 	}, false);
		// }).sort((foo, bar)=> {
		// 	if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
		// 	if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
		// 	return 0;
		// });

		let canManage = false;
		if (pubData.localPermissions === 'manage') { canManage = true; }
		if (pubData.adminPermissions === 'manage' && loginData.isAdmin) { canManage = true; }

		let canDelete = false;
		if (canManage && !pubData.firstPublishedAt) { canDelete = true; }
		if (canManage && loginData.isAdmin) { canDelete = true; }

		const highlights = discussions.filter((item)=> {
			return !item.isArchived && item.highlights;
		}).reduce((prev, curr)=> {
			const highlightsWithThread = curr.highlights.map((item)=> {
				return { ...item, threadNumber: curr.threadNumber };
			});
			return [...prev, ...highlightsWithThread];
		}, []);
		if (this.editorRef && queryObject.from && queryObject.to) {
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

		return (
			<div id="pub-collaboration-container">
				<AccentStyle
					accentColor={this.props.communityData.accentColor}
					accentTextColor={this.props.communityData.accentTextColor}
					accentActionColor={this.props.communityData.accentActionColor}
					accentHoverColor={this.props.communityData.accentHoverColor}
					accentMinimalColor={this.props.communityData.accentMinimalColor}
				/>
				<PubCollabHeader
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					pubData={pubData}
					collaborators={pubData.collaborators}
					canManage={canManage}
					isAdmin={loginData.isAdmin}
					activeCollaborators={this.state.activeCollaborators}
					submissionThreadNumber={submissionThreadNumber}
					activeThread={activeThread}
					collabStatus={this.state.collabStatus}
					onPublishClick={this.togglePublish}
					onSubmitClick={this.toggleSubmit}
					onShareClick={this.toggleShare}
					onDetailsClick={this.toggleDetails}
					onCollaboratorsClick={this.toggleCollaborators}
					onCollectionsClick={this.toggleCollections}
					onThreadClick={this.setActiveThread}
					onChaptersClick={this.toggleChapters}
				/>
				<div className="page-content">
					<div className="container pub">
						<div className="row">
							<div className="col-12">
								<div className="pub-side-content">
									{!this.state.activeThreadNumber &&
										<div className={`side-block fix-it ${this.state.fixIt ? 'fixed' : ''}`}>
											{this.state.chaptersData.length > 1 &&
												<div>
													<span className="title">Chapters</span>
													<button onClick={this.toggleChapters} className="pt-button pt-minimal pt-small">
														Manage
													</button>
													<button onClick={this.decrementChapter} className={`pt-button pt-minimal pt-small arrow pt-icon-arrow-left ${this.state.activeChapterIndex !== 0 ? '' : ' hidden'}`} />
													<button onClick={this.incrementChapter} className={`pt-button pt-minimal pt-small arrow pt-icon-arrow-right ${this.state.activeChapterIndex !== this.state.chaptersData.length - 1 ? '' : ' hidden'}`} />
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
										</div>
									}
								</div>
								<div
									className="pub-main-content"
									tabIndex={-1}
									role="textbox"
								>
									<div className="pub-body-component">
										<PubCollabEditor
											onRef={this.handleEditorRef}
											editorKey={this.state.compositeEditorKey}
											isReadOnly={!canManage && pubData.localPermissions !== 'edit'}
											clientData={this.state.activeCollaborators[0]}
											onClientChange={this.handleClientChange}
											onNewHighlightDiscussion={this.handleNewHighlightDiscussion}
											onHighlightClick={this.setActiveThread}
											hoverBackgroundColor={this.props.communityData.accentMinimalColor}
											highlights={this.state.docReadyForHighlights ? highlights : []}
											threads={threads}
											slug={pubData.slug}
											onStatusChange={this.handleStatusChange}
										/>
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
					onPublish={this.handlePublish}
					postDiscussionIsLoading={this.state.postDiscussionIsLoading}
					initialContent={this.state.initialContent}
					postVersionIsLoading={this.state.postVersionIsLoading}
				/>

				<Overlay isOpen={this.state.isPublishOpen} onClose={this.togglePublish}>
					<PubCollabPublish
						pubData={pubData}
						onPublish={this.handlePublish}
						onPutPub={this.handleDetailsSave}
						isLoading={this.state.postVersionIsLoading}
						onOpenDetails={this.onOpenDetails}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isSubmitOpen} onClose={this.toggleSubmit}>
					<PubCollabSubmit
						communityData={this.props.communityData}
						pubData={pubData}
						loginData={this.props.loginData}
						pubId={pubData.id}
						onSubmit={this.handlePostDiscussion}
						onPutPub={this.handleDetailsSave}
						isLoading={this.state.postDiscussionIsLoading}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isCollectionsOpen} onClose={this.toggleCollections}>
					<PubCollabCollections
						pubData={pubData}
						collections={this.props.communityData.collections}
						onAddCollection={this.handleAddCollection}
						onRemoveCollection={this.handleRemoveCollection}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isShareOpen} onClose={this.toggleShare}>
					<PubCollabShare
						communityData={this.props.communityData}
						pubData={pubData}
						canManage={canManage}
						onPutPub={this.handleDetailsSave}
						onOpenCollaborators={this.onOpenCollaborators}
						onCollaboratorAdd={this.handleCollaboratorAdd}
						onCollaboratorUpdate={this.handleCollaboratorUpdate}
						onCollaboratorDelete={this.handleCollaboratorDelete}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isCollaboratorsOpen} onClose={this.toggleCollaborators}>
					<PubCollabShare
						communityData={this.props.communityData}
						pubData={pubData}
						canManage={canManage}
						onPutPub={this.handleDetailsSave}
						onOpenCollaborators={this.onOpenCollaborators}
						onOpenShare={this.onOpenShare}
						onCollaboratorAdd={this.handleCollaboratorAdd}
						onCollaboratorUpdate={this.handleCollaboratorUpdate}
						onCollaboratorDelete={this.handleCollaboratorDelete}
						collaboratorsOnly={true}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isDetailsOpen} onClose={this.toggleDetails}>
					<PubCollabDetails
						pubData={pubData}
						canDelete={canDelete}
						onSave={this.handleDetailsSave}
						onDelete={this.handlePubDelete}
						putIsLoading={this.state.putPubIsLoading}
						deleteIsLoading={this.state.deletePubIsLoading}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isChaptersOpen} onClose={this.toggleChapters}>
					<PubCollabChapters
						chaptersData={this.state.chaptersData}
						onChapterAdd={this.handleChapterAdd}
						onChaptersChange={this.handleChaptersChange}
						onChapterSet={this.handleChapterSet}
						activeChapterIndex={this.state.activeChapterIndex}
					/>
				</Overlay>
			</div>
		);
	}
}

PubCollaboration.propTypes = propTypes;
export default PubCollaboration;

hydrateWrapper(PubCollaboration);
