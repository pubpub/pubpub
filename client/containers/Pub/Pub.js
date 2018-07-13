import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from '@firebase/app';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Overlay from 'components/Overlay/Overlay';
import PubHeader from 'components/PubHeader/PubHeader';
import PubDraftHeader from 'components/PubDraftHeader/PubDraftHeader';
import PubPresSideUser from 'components/PubPresSideUser/PubPresSideUser';
import PubBody from 'components/PubBodyNew/PubBody';
import PubOptions from 'components/PubOptions/PubOptions';
import License from 'components/License/License';
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
			canEdit: props.pubData.localPermissions === 'edit' || props.pubData.localPermissions === 'manage',
			firebaseToken: props.pubData.firebaseToken,
		};

		this.state = {
			pubData: {
				...this.props.pubData,
				sectionsData: this.props.pubData.isDraft ? [{ id: '', order: 0, title: 'Introduction' }] : undefined
			},
			activeCollaborators: [this.localUser],
			optionsMode: undefined,
			collabStatus: 'connecting',
			docReadyForHighlights: false,
			activeThreadNumber: undefined,
			initialDiscussionContent: undefined,
			fixIt: true,
			scrolledToPermanent: false,
			// sectionsData: [{ id: '', order: 0, title: 'Introduction' }],
			editorRefNode: undefined,
			menuWrapperRefNode: undefined,
		};
		this.firebaseRef = null;
		this.setSavingTimeout = null;
		this.getHighlightContent = this.getHighlightContent.bind(this);
		this.setActiveThread = this.setActiveThread.bind(this);
		this.setOptionsMode = this.setOptionsMode.bind(this);
		this.setPubData = this.setPubData.bind(this);
		this.handleSectionsChange = this.handleSectionsChange.bind(this);
		this.handleEditorRef = this.handleEditorRef.bind(this);
		this.handleMenuWrapperRef = this.handleMenuWrapperRef.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleClientChange = this.handleClientChange.bind(this);
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

	setActiveThread(threadNumber) {
		this.setState({ activeThreadNumber: threadNumber });
	}

	setOptionsMode(mode) {
		this.setState({ optionsMode: mode });
	}

	setPubData(newPubData) {
		this.setState({ pubData: newPubData });
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
		if (!this.state.editorRefNode) {
			/* Need to set timeout so DOM can render */
			/* When in draft, this timeout is how long we think */
			/* it will take the firebase server to */
			/* initalize the most recent doc and steps. */
			/* It doesn't hurt to be a bit conservative here */
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

	render() {
		const pubData = this.state.pubData;
		const loginData = this.props.loginData;
		const queryObject = this.props.locationData.query;
		const mode = this.props.locationData.params.mode;
		const subMode = this.props.locationData.params.subMode;

		const activeVersion = pubData.activeVersion;
		const authors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isAuthor;
		});
		const contributors = pubData.collaborators.filter((collaborator)=> {
			return collaborator.Collaborator.isContributor;
		});

		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

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
		const sectionsData = pubData.isDraft ? this.state.pubData.sectionsData : activeVersion.content;

		const sectionIds = hasSections
			? sectionsData.map((section)=> {
				return section.id || '';
			})
			: [];
		const currentSectionIndex = sectionIds.reduce((prev, curr, index)=> {
			if (sectionId === curr) { return index; }
			return prev;
		}, undefined);
		const nextSectionId = sectionIds.length > currentSectionIndex + 1
			? sectionIds[currentSectionIndex + 1]
			: '';
		const prevSectionId = currentSectionIndex - 1 > 0
			? sectionIds[currentSectionIndex - 1]
			: '';


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
			: typeof window !== 'undefined' && this.state.editorRefNode && queryObject.from && queryObject.to && queryObject.version
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

		/* Calculate Permissions for UI elements */
		let canManage = false;
		if (pubData.localPermissions === 'manage') { canManage = true; }
		if (pubData.adminPermissions === 'manage' && loginData.isAdmin) { canManage = true; }

		let canDelete = false;
		if (canManage && !pubData.firstPublishedAt) { canDelete = true; }
		if (canManage && loginData.isAdmin) { canDelete = true; }


		return (
			<div id="pub-container">
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
										// onNewHighlightDiscussion={()=>{}}

										// Props from CollabEditor
										editorKey={`${this.props.pubData.editorKey}${sectionId ? '/' : ''}${sectionId || ''}`}
										isReadOnly={!pubData.isDraft || (!canManage && pubData.localPermissions !== 'edit')}
										clientData={this.state.activeCollaborators[0]}
										onClientChange={this.handleClientChange}
										onStatusChange={this.handleStatusChange}
										menuWrapperRefNode={this.state.menuWrapperRefNode}
									/>

									{/* License */}
									{!pubData.isDraft &&
										<div className="license-wrapper">
											<License />
										</div>
									}
								</div>
								<div className="side-content">
									{/* TOC */}
									{/* Collaborators */}
									{/* */}
									<div className="header-title">Table of Contents</div>
									<div className="toc">
										<a>Series Foreword </a>
										<a>Foreword by Colleen Macklin </a>
										<a>1 Our Game Could Be Your Life </a>
										<a>2 Resonant Learning </a>
										<a><b>3 In a Game, You Can Be Whoever You Wan…</b></a>
										<a className="section">Introduction</a>
										<a className="section">Analysis</a>
										<a className="section">Opinions</a>
										<a className="section">Further Exploration</a>
										<a>4 “I Wish I Could Go On Here Forever” </a>
										<a>5 Discovering the Secret World of Ysola </a>
										<a>6 Beetles, Beasties, and Bunnies in Your Ba…</a>
										<a>7 Doorway to Games </a>
										<a>8 Measuring Resonant Success </a>
										<a>9 Games not Gamification</a>
									</div>

									{!!authors.length &&
										<div>
											<div className="header-title">Authors</div>

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
										<div>
											<div className="header-title">Contributors</div>
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
								</div>
							</div>
						</div>
					</div>
					<div id="discussions" className="discussions">
						<div className="container pub">
							<div className="row">
								<div className="col-12">
									<h2>Discussions</h2>
								</div>
							</div>
						</div>
					</div>
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
				</PageWrapper>
			</div>
		);
	}
}

Pub.propTypes = propTypes;
export default Pub;

hydrateWrapper(Pub);
