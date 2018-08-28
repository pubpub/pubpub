import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from '@firebase/app';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import PubHeader from 'components/PubHeader/PubHeader';
import PubDraftHeader from 'components/PubDraftHeader/PubDraftHeader';
import PubBody from 'components/PubBodyNew/PubBody';
import PubOptions from 'components/PubOptions/PubOptions';
import PubSideToc from 'components/PubSideToc/PubSideToc';
import PubSideCollaborators from 'components/PubSideCollaborators/PubSideCollaborators';
import PubSideOptions from 'components/PubSideOptions/PubSideOptions';
import PubSideDiscussions from 'components/PubSideDiscussions/PubSideDiscussions';
import PubLicense from 'components/PubLicense/PubLicense';
import PubInlineMenu from 'components/PubInlineMenu/PubInlineMenu';
import PubLinkMenu from 'components/PubLinkMenu/PubLinkMenu';
import PubSideControls from 'components/PubSideControls/PubSideControls';
import PubSectionNav from 'components/PubSectionNav/PubSectionNav';
import DiscussionList from 'components/DiscussionListNew/DiscussionList';
// import DiscussionViewer from 'components/DiscussionViewer/DiscussionViewer';
// import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import queryString from 'query-string';
import { apiFetch, hydrateWrapper, getFirebaseConfig, nestDiscussionsToThreads, getRandomColor, generateHash } from 'utilities';

require('@firebase/auth');
require('@firebase/database');
require('./pub.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class Pub extends Component {
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
			canEdit: props.pubData.isDraftEditor || props.pubData.isManager,
			firebaseToken: props.pubData.firebaseToken,
		};

		this.state = {
			pubData: {
				...this.props.pubData,
				sectionsData: this.props.pubData.isDraft ? [{ id: '', order: 0, title: 'Introduction' }] : undefined
			},
			locationData: this.props.locationData,
			activeCollaborators: [this.localUser],
			optionsMode: undefined,
			collabStatus: 'connecting',
			docReadyForHighlights: false,
			activeThreadNumber: undefined,
			activeThreadNode: undefined,
			initialDiscussionContent: undefined,
			fixIt: true,
			scrolledToPermanent: false,
			// sectionsData: [{ id: '', order: 0, title: 'Introduction' }],
			editorRefNode: undefined,
			menuWrapperRefNode: undefined,
			editorChangeObject: {},
		};
		this.firebaseRef = null;
		this.pageRef = React.createRef();
		this.sideMarginRef = React.createRef();
		this.setSavingTimeout = null;
		this.getHighlightContent = this.getHighlightContent.bind(this);
		this.getActiveDiscussionChannel = this.getActiveDiscussionChannel.bind(this);
		this.setActiveThread = this.setActiveThread.bind(this);
		this.setOptionsMode = this.setOptionsMode.bind(this);
		this.setPubData = this.setPubData.bind(this);
		this.setDiscussionChannel = this.setDiscussionChannel.bind(this);
		this.getAbsolutePosition = this.getAbsolutePosition.bind(this);
		this.handleSectionsChange = this.handleSectionsChange.bind(this);
		this.handleEditorRef = this.handleEditorRef.bind(this);
		this.handleMenuWrapperRef = this.handleMenuWrapperRef.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleClientChange = this.handleClientChange.bind(this);
		this.handlePutLabels = this.handlePutLabels.bind(this);
		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
	}

	componentDidMount() {
		if (this.state.pubData.isDraft) {
			/* Setup Firebase App */
			const firebaseAppName = `Pub-${this.props.pubData.editorKey}`;
			const existingApp = firebase.apps.reduce((prev, curr)=> {
				if (curr.name === firebaseAppName) { return curr; }
				return prev;
			}, undefined);
			const firebaseApp = existingApp || firebase.initializeApp(getFirebaseConfig(), firebaseAppName);
			const database = firebase.database(firebaseApp);
			firebase.auth(firebaseApp).signInWithCustomToken(this.props.pubData.firebaseToken)
			.then(()=> {
				this.firebaseRef = database.ref(`${this.props.pubData.editorKey}`);
				/* Add listener event to update sectionsData when it changes in Firebase */
				this.firebaseRef.child('/sections').on('value', this.handleSectionsChange);
			});
		}
	}

	componentWillUnmount() {
		if (this.firebaseRef) {
			this.firebaseRef.child('/sections').off('value', this.handleSectionsChange);
		}
	}

	getActiveDiscussionChannel() {
		return this.state.pubData.discussionChannels.reduce((prev, curr)=> {
			if (this.state.locationData.query.channel === curr.title) { return curr; }
			return prev;
		}, undefined);
	}

	getHighlightContent(from, to) {
		const primaryEditorState = this.state.editorRefNode.state.editorState;
		if (!primaryEditorState || primaryEditorState.doc.nodeSize < from || primaryEditorState.doc.nodeSize < to) { return {}; }
		const exact = primaryEditorState.doc.textBetween(from, to);
		const prefix = primaryEditorState.doc.textBetween(Math.max(0, from - 10), Math.max(0, from));
		const suffix = primaryEditorState.doc.textBetween(Math.min(primaryEditorState.doc.nodeSize - 2, to), Math.min(primaryEditorState.doc.nodeSize - 2, to + 10));
		const hasSections = this.state.pubData.isDraft
			? this.state.pubData.sectionsData.length > 1
			: Array.isArray(this.state.pubData.versions[0].content);
		const sectionId = hasSections ? this.props.locationData.params.sectionId || '' : undefined;
		const highlightObject = {
			exact: exact,
			prefix: prefix,
			suffix: suffix,
			from: from,
			to: to,
			version: this.state.pubData.isDraft ? undefined : this.props.pubData.versions[0].id,
			section: hasSections ? sectionId : undefined,
			id: `h${generateHash(8)}`, // Has to start with letter since it's a classname
		};
		return highlightObject;
	}

	setActiveThread(threadNumber, highlightNode) {
		// TODO: set highlight node
		this.setState({
			activeThreadNumber: threadNumber,
			activeThreadNode: highlightNode,
		});
	}

	setOptionsMode(mode) {
		this.setState({ optionsMode: mode });
	}

	setPubData(newPubData) {
		this.setState({ pubData: newPubData });
	}

	getAbsolutePosition(top, left, placeInSideMargin) {
		// const container = this.state.editorRefNode.editorRef.current;
		// const page = this.pageRef.current;
		const sideContainer = this.sideMarginRef.current;
		// debugger;
		return {
			top: top + window.scrollY,
			left: placeInSideMargin
				? sideContainer.getBoundingClientRect().left
				: left,
			width: placeInSideMargin
				? sideContainer.getBoundingClientRect().width
				: undefined,
		};
	}

	setDiscussionChannel(channelTitle) {
		const newQuery = {
			...this.state.locationData.query,
			channel: channelTitle === 'public' ? undefined : channelTitle,
		};
		const newQueryString = Object.values(newQuery).filter(item => !!item).length
			? `?${queryString.stringify(newQuery)}`
			: '';
		this.setState({
			locationData: {
				...this.state.locationData,
				query: newQuery,
				queryString: newQueryString
			}
		});
		window.history.replaceState({}, '', `${this.state.locationData.path}${newQueryString}`);
	}

	handleSectionsChange(snapshot) {
		const snapshotVal = snapshot.val() || this.state.pubData.sectionsData;
		const snapshotArray = Object.keys(snapshotVal).map((key)=> {
			return {
				...snapshotVal[key],
				firebaseId: key,
			};
		});
		const newSectionsData = snapshotArray.length
			? snapshotArray.sort((foo, bar)=> {
				if (foo.order < bar.order) { return -1; }
				if (foo.order > bar.order) { return 1; }
				return 0;
			})
			: [];
		this.setPubData({
			...this.state.pubData,
			sectionsData: newSectionsData,
		});
	}

	handleEditorRef(ref) {
		console.log(ref);
		this.setState({ editorRefNode: ref });
		/*if (!this.state.editorRefNode) {
			//Need to set timeout so DOM can render
			//When in draft, this timeout is how long we think
			//it will take the firebase server to
			//initalize the most recent doc and steps.
			//It doesn't hurt to be a bit conservative here
			const timeoutDelay = this.state.pubData.isDraft
				? 2500
				: 0;
			setTimeout(()=> {
				this.setState({
					docReadyForHighlights: true,
					editorRefNode: ref,
				});
			}, timeoutDelay);
		}
		*/
	}

	handleMenuWrapperRef(ref) {
		if (!this.state.menuWrapperRefNode) {
			this.setState({
				menuWrapperRefNode: ref,
			});
		}
	}

	handleNewHighlightDiscussion(highlightObject) {
		this.setState({
			activeThreadNumber: 'new',
			initialDiscussionContent: {
				type: 'doc',
				attrs: { meta: {} },
				content: [
					{ type: 'highlightQuote', attrs: { ...highlightObject, id: `h${generateHash(8)}` } },
					{ type: 'paragraph', content: [] },
				]
			}
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

	handleClientChange(clients) {
		this.setState({
			activeCollaborators: [this.localUser, ...clients]
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
			this.setPubData({
				...this.state.pubData,
				...result
			});
		})
		.catch((err)=> {
			console.error('Error saving labels', err);
		});
	}

	closeThreadOverlay() {
		this.setState({
			activeThreadNumber: undefined,
			initialDiscussionContent: undefined,
		});
	}

	handlePostDiscussion(discussionObject) {
		this.setState({ postDiscussionIsLoading: true });
		const activeDiscussionChannel = this.getActiveDiscussionChannel();
		return apiFetch('/api/discussions', {
			method: 'POST',
			body: JSON.stringify({
				...discussionObject,
				userId: this.props.loginData.id,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
				discussionChannelId: activeDiscussionChannel ? activeDiscussionChannel.id : null,
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

	handleEditorChange(changeObject) {
		console.log(changeObject);
		this.setState({ editorChangeObject: changeObject });
	}



	render() {
		const pubData = this.state.pubData;
		const loginData = this.props.loginData;
		const queryObject = this.props.locationData.query;
		// const mode = this.props.locationData.params.mode;
		// const subMode = this.props.locationData.params.subMode;
		const activeVersion = pubData.activeVersion;
		const discussions = pubData.discussions || [];
		const activeDiscussionChannel = this.getActiveDiscussionChannel();
		const threads = nestDiscussionsToThreads(discussions).filter((thread)=> {
			const activeDiscussionChannelId = activeDiscussionChannel ? activeDiscussionChannel.id : null;
			return activeDiscussionChannelId === thread[0].discussionChannelId;
		});

		/* The activeThread can either be the one selected in state, */
		/* or one hardcoded in the URL */
		const activeThread = threads.reduce((prev, curr)=> {
			if (
				curr[0].threadNumber === Number(this.props.locationData.params.subMode) ||
				curr[0].threadNumber === Number(this.state.activeThreadNumber)
			) {
				return curr;
			}
			return prev;
		}, undefined);

		/* Section variables */
		const hasSections = pubData.isDraft
			? this.state.pubData.sectionsData.length > 1
			: activeVersion && Array.isArray(activeVersion.content);
		const sectionId = this.props.locationData.params.sectionId || '';

		/* Active Content */
		let activeContent;
		if (!pubData.isDraft) {
			activeContent = !hasSections
				? (activeVersion && activeVersion.content)
				: activeVersion.content.reduce((prev, curr)=> {
					if (curr.id === sectionId) { return curr.content; }
					return prev;
				}, activeVersion.content[0].content);
		}

		/* Get Highlights from discussions. Filtering for */
		/* only highlights that are active in the current section */
		/* and not archived. */
		const highlights = discussions.filter((item)=> {
			return !item.isArchived && item.highlights;
		}).filter((item)=> {
			const activeDiscussionChannelId = activeDiscussionChannel ? activeDiscussionChannel.id : null;
			return activeDiscussionChannelId === item.discussionChannelId;
		}).reduce((prev, curr)=> {
			const highlightsWithThread = curr.highlights.map((item)=> {
				return { ...item, threadNumber: curr.threadNumber };
			});
			return [...prev, ...highlightsWithThread];
		}, [])
		.filter((highlight)=> {
			if (!hasSections) { return true; }
			return sectionId === highlight.section;
		});

		/* Add a permalink highlight if the URL mandates one */
		const hasPermanentHighlight = pubData.isDraft
			? typeof window !== 'undefined' && this.state.editorRefNode && queryObject.from && queryObject.to
			: typeof window !== 'undefined' && this.state.editorRefNode && queryObject.from && queryObject.to && queryObject.version;
		if (hasPermanentHighlight) {
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

		const shortcutValues = this.state.editorChangeObject.shortcutValues || {};
		return (
			<div id="pub-container" ref={this.pageRef}>
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<PubHeader
						pubData={pubData}
						locationData={this.props.locationData}
						setOptionsMode={this.setOptionsMode}
					/>

					{pubData.isDraft &&
						<PubDraftHeader
							pubData={pubData}
							loginData={loginData}
							editorChangeObject={this.state.editorChangeObject}
							setOptionsMode={this.setOptionsMode}
							bottomCutoffId="discussions"
							onRef={this.handleMenuWrapperRef}
							collabStatus={this.state.collabStatus}
							activeCollaborators={this.state.activeCollaborators}
						/>
					}

					<div className="container pub">
						<div className="row">
							<div className="col-12 pub-columns">
								<div className="main-content">
									<PubBody
										onRef={this.handleEditorRef}
										isDraft={pubData.isDraft}
										versionId={activeVersion && activeVersion.id}
										sectionId={sectionId}
										content={activeContent}
										threads={threads}
										slug={pubData.slug}
										highlights={this.state.docReadyForHighlights ? highlights : []}
										hoverBackgroundColor={this.props.communityData.accentMinimalColor}
										setActiveThread={this.setActiveThread}
										onNewHighlightDiscussion={this.handleNewHighlightDiscussion}
										onChange={this.handleEditorChange}

										// Props from CollabEditor
										editorKey={`${this.props.pubData.editorKey}${sectionId ? '/' : ''}${sectionId || ''}`}
										isReadOnly={!pubData.isDraft || (!pubData.isManager && !pubData.isDraftEditor)}
										clientData={this.state.activeCollaborators[0]}
										onClientChange={this.handleClientChange}
										onStatusChange={this.handleStatusChange}
										// menuWrapperRefNode={this.state.menuWrapperRefNode}
									/>

									{/* Prev/Content/Next Buttons */}
									{hasSections &&
										<PubSectionNav
											pubData={pubData}
											queryObject={queryObject}
											hasSections={hasSections}
											sectionId={sectionId}
											setOptionsMode={this.setOptionsMode}
										/>
									}

									{/* License */}
									{!pubData.isDraft &&
										<PubLicense />
									}
								</div>
								<div className="side-content" ref={this.sideMarginRef}>
									{/* Table of Contents */}
									<PubSideToc
										pubData={pubData}
										locationData={this.props.locationData}
										setOptionsMode={this.setOptionsMode}
										editorRefNode={this.state.editorRefNode}
										activeContent={activeContent}
									/>

									{/* Collaborators */}
									<PubSideCollaborators
										pubData={pubData}
										setOptionsMode={this.setOptionsMode}
									/>

									{/* Quick Options */}
									<PubSideOptions
										pubData={pubData}
										setOptionsMode={this.setOptionsMode}
										activeDiscussionChannel={activeDiscussionChannel}
										setDiscussionChannel={this.setDiscussionChannel}
									/>
									<PubSideDiscussions
										threads={threads}
										pubData={pubData}
										locationData={this.state.locationData}
										loginData={this.props.loginData}
										onPostDiscussion={this.handlePostDiscussion}
										onPutDiscussion={this.handlePutDiscussion}
										getHighlightContent={this.getHighlightContent}
									/>
								</div>
							</div>
						</div>
					</div>
					<div id="discussions" className="discussions">
						<div className="container pub">
							<div className="row">
								<div className="col-12">
									<DiscussionList
										pubData={pubData}
										loginData={this.props.loginData}
										threads={threads}
										locationData={this.state.locationData}
										onPreviewClick={this.setActiveThread}
										onLabelsSave={this.handlePutLabels}
										onPostDiscussion={this.handlePostDiscussion}
										onPutDiscussion={this.handlePutDiscussion}
										getHighlightContent={this.getHighlightContent}
										activeDiscussionChannel={activeDiscussionChannel}
										setDiscussionChannel={this.setDiscussionChannel}
										// showAll={queryObject.all}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Components that render overlays */}
					<PubInlineMenu
						pubData={pubData}
						editorChangeObject={this.state.editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
					/>
					<PubLinkMenu
						pubData={pubData}
						editorChangeObject={this.state.editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
					/>
					<PubSideControls
						pubData={pubData}
						editorChangeObject={this.state.editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
					/>
					{/* <DiscussionViewer
						pubData={pubData}
						loginData={this.props.loginData}
						locationData={this.props.locationData}
						communityData={this.props.communityData}
						activeThreadNumber={this.state.activeThreadNumber}
						activeThreadNode={this.state.activeThreadNode}
						onClose={this.closeThreadOverlay}
						getHighlightContent={this.getHighlightContent}
						onPostDiscussion={this.handlePostDiscussion}
						onPutDiscussion={this.handlePutDiscussion}
						postDiscussionIsLoading={this.state.postDiscussionIsLoading}
						initialContent={this.state.initialDiscussionContent}
					/>
					*/}
					<PubOptions
						communityData={this.props.communityData}
						pubData={pubData}
						loginData={loginData}
						locationData={this.props.locationData}
						firebaseRef={this.firebaseRef}
						editorRefNode={this.state.editorRefNode}
						optionsMode={this.state.optionsMode}
						setOptionsMode={this.setOptionsMode}
						setPubData={this.setPubData}
					/>

					{/* mode === 'discussions' &&
						<div className="container pub mode-content">
							<div className="row">
								<div className="col-12">
									{!subMode &&
										<DiscussionList
											pubData={pubData}
											mode={mode}
											onLabelsSave={this.handlePutLabels}
										/>
									}
									{subMode &&
										<DiscussionThread
											pubData={pubData}
											discussions={activeThread}
											canManage={pubData.isManager}
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
					*/}
				</PageWrapper>
			</div>
		);
	}
}

Pub.propTypes = propTypes;
export default Pub;

hydrateWrapper(Pub);
