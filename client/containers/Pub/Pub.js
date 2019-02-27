import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* Firebase has some issues with their auth packages and importing */
/* conflicting dependencies. https://github.com/firebase/firebase-js-sdk/issues/752 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import firebase from '@firebase/app';
import { dispatchEmptyTransaction, docIsEmpty, marksAtSelection } from '@pubpub/editor';
import { apiFetch, hydrateWrapper, getFirebaseConfig } from 'utilities';

import PubCollabManager from './PubCollabManager';
import PubDiscussionsManager from './PubDiscussionsMananger';
import PubPresentational from './PubPresentational';

/* eslint-disable-next-line import/no-extraneous-dependencies */
require('@firebase/auth');
/* eslint-disable-next-line import/no-extraneous-dependencies */
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

		this.state = {
			pubData: {
				...this.props.pubData,
				sectionsData: this.props.pubData.isDraft
					? [{ id: '', order: 0, title: 'Introduction' }]
					: undefined,
			},
			optionsMode: undefined,
			scrolledToPermanent: false,
			// sectionsData: [{ id: '', order: 0, title: 'Introduction' }],
			editorChangeObject: {},
			// TODO(ian): I'm pretty sure this state is being propagated into
			// the UI, but indirectly by way of a setState callback that
			// uses this value to compute another state value. Refactor this
			// code so it's not confusing to static analysis tools.
			// eslint-disable-next-line react/no-unused-state
			clickedMarks: [],
			linkPopupIsOpen: false,
		};
		this.firebaseRef = null;
		this.setActiveThread = this.setActiveThread.bind(this);
		this.setOptionsMode = this.setOptionsMode.bind(this);
		this.setPubData = this.setPubData.bind(this);
		this.handleSectionsChange = this.handleSectionsChange.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleClientChange = this.handleClientChange.bind(this);
		this.handlePutLabels = this.handlePutLabels.bind(this);
		this.closeThreadOverlay = this.closeThreadOverlay.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleEditorSingleClick = this.handleEditorSingleClick.bind(this);
		this.handleQuotePermalink = this.handleQuotePermalink.bind(this);
		this.calculateLinkPopupState = this.calculateLinkPopupState.bind(this);
		this.handleKeyPressEvents = this.handleKeyPressEvents.bind(this);
		this.getThreads = this.getThreads.bind(this);
	}

	componentDidMount() {
		if (this.state.pubData.isDraft) {
			/* Setup Firebase App */
			const firebaseAppName = `Pub-${this.props.pubData.editorKey}`;
			const existingApp = firebase.apps.reduce((prev, curr) => {
				if (curr.name === firebaseAppName) {
					return curr;
				}
				return prev;
			}, undefined);
			const firebaseApp =
				existingApp || firebase.initializeApp(getFirebaseConfig(), firebaseAppName);
			const database = firebase.database(firebaseApp);
			firebase
				.auth(firebaseApp)
				.signInWithCustomToken(this.props.pubData.firebaseToken)
				.then(() => {
					this.firebaseRef = database.ref(`${this.props.pubData.editorKey}`);
					/* Add listener event to update sectionsData when it changes in Firebase */
					this.firebaseRef.child('/sections').on('value', this.handleSectionsChange);
				});
			window.addEventListener('keydown', this.handleKeyPressEvents);
		}
	}

	componentWillUnmount() {
		if (this.firebaseRef) {
			this.firebaseRef.child('/sections').off('value', this.handleSectionsChange);
		}
		if (this.state.pubData.isDraft) {
			window.removeEventListener('keydown', this.handleKeyPressEvents);
		}
	}

	setOptionsMode(mode) {
		this.setState({ optionsMode: mode });
	}

	setPubData(newPubData) {
		this.setState({ pubData: newPubData });
		if (typeof document !== 'undefined') {
			document.title = this.state.pubData.title;
		}
	}

	getActiveContent() {
		const { locationData } = this.props;
		const { pubData } = this.state;
		const { activeVersion, sectionsData, isDraft } = pubData;
		const hasSections = isDraft
			? sectionsData.length > 1
			: activeVersion && Array.isArray(activeVersion.content);
		const sectionId = locationData.params.sectionId || '';
		let activeContent;
		if (!isDraft) {
			activeContent = !hasSections
				? activeVersion && activeVersion.content
				: activeVersion.content.reduce((prev, curr) => {
						if (curr.id === sectionId) {
							return curr.content;
						}
						return prev;
				  }, activeVersion.content[0].content);
		}
		return activeContent;
	}

	handleKeyPressEvents(evt) {
		if (this.state.linkPopupIsOpen && (evt.key === 'Escape' || evt.key === 'Enter')) {
			evt.preventDefault();
			this.setState({ linkPopupIsOpen: false }, () => {
				this.state.editorChangeObject.view.focus();
			});
		}
		if (evt.key === 'k' && evt.metaKey) {
			this.setState({ linkPopupIsOpen: true }, () => {
				this.calculateLinkPopupState();
			});
		}
	}

	handleSectionsChange(snapshot) {
		const snapshotVal = snapshot.val() || this.state.pubData.sectionsData;
		const snapshotArray = Object.keys(snapshotVal).map((key) => {
			return {
				...snapshotVal[key],
				firebaseId: key,
			};
		});
		const newSectionsData = snapshotArray.length
			? snapshotArray.sort((foo, bar) => {
					if (foo.order < bar.order) {
						return -1;
					}
					if (foo.order > bar.order) {
						return 1;
					}
					return 0;
			  })
			: [];
		this.setPubData({
			...this.state.pubData,
			sectionsData: newSectionsData,
		});
	}

	handlePutLabels(newLabels) {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				labels: newLabels,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			}),
		})
			.then((result) => {
				this.setPubData({
					...this.state.pubData,
					...result,
				});
			})
			.catch((err) => {
				console.error('Error saving labels', err);
			});
	}

	handleEditorChange(changeObject) {
		if (!this.state.editorChangeObject.view) {
			/* Sometimes the bounding boxes need updating */
			/* after initial load. */
			setTimeout(() => {
				dispatchEmptyTransaction(this.state.editorChangeObject.view);
			}, 1000);

			/* Uncomment the follwing line and the import at the top */
			/* if you need to debug a pub document. */
			// applyDevTools(changeObject.view);
		}
		this.setState(
			{
				editorChangeObject: {
					...changeObject,
					currentScroll: window.scrollY,
				},
				// eslint-disable-next-line react/no-unused-state
				clickedMarks: [],
			},
			this.calculateLinkPopupState,
		);
	}

	handleEditorSingleClick(view) {
		this.setState(
			{
				// eslint-disable-next-line react/no-unused-state
				clickedMarks: marksAtSelection(view),
			},
			this.calculateLinkPopupState,
		);
	}

	calculateLinkPopupState() {
		this.setState((prevState) => {
			const activeLink = prevState.editorChangeObject.activeLink || {};
			const selectionIsLink = !!activeLink.attrs;
			const clickedOnLink = prevState.clickedMarks.indexOf('link') > -1;
			// const linkPopupIsOpen = clickedOnLink || (prevState.linkPopupIsOpen && selectionIsLink) || (selectionIsLink && !activeLink.attrs.href);
			const linkPopupIsOpen = clickedOnLink || (prevState.linkPopupIsOpen && selectionIsLink);
			return {
				linkPopupIsOpen: linkPopupIsOpen,
			};
		});
	}

	render() {
		const isEmptyDoc =
			this.state.editorChangeObject.view &&
			docIsEmpty(this.state.editorChangeObject.view.state.doc);
		const presentationalHandlers = {
			onEditorChange: this.handleEditorChange,
			onSetOptionsMode: this.setOptionsMode,
			onSetPubData: this.setPubData,
			onSingleClick: this.handleEditorSingleClick,
		};
		return (
			<PubCollabManager>
				{({
					handleCollabStatusChange,
					handleClientChange,
					collabStatus,
					activeCollaborators,
					isCollabLoading,
				}) => (
					<PubDiscussionsManager>
						{({
							activeDiscussionChannel,
							activeThreadNumber,
							discussionHandlers,
							discussionNodeOptionsPartial,
							initialDiscussionContent,
							locationData,
							threads,
						}) => (
							<PubPresentational
								{...presentationalHandlers}
								activeContent={this.getActiveContent()}
								activeCollaborators={activeCollaborators}
								activeDiscussionChannel={activeDiscussionChannel}
								activeThreadNumber={activeThreadNumber}
								collabStatus={collabStatus}
								communityData={this.props.communityData}
								discussionHandlers={discussionHandlers}
								discussionNodeOptions={{
									...discussionNodeOptionsPartial,
									getLocationData: () => this.props.locationData,
									getLoginData: () => this.props.loginData,
								}}
								editorChangeObject={this.state.editorChangeObject}
								initialDiscussionContent={initialDiscussionContent}
								isCollabLoading={isCollabLoading}
								isEmptyDoc={isEmptyDoc}
								linkPopupIsOpen={this.state.linkPopupIsOpen}
								loginData={this.props.loginData}
								locationData={locationData}
								onStatusChange={handleCollabStatusChange}
								onClientChange={handleClientChange}
								optionsMode={this.state.optionsMode}
								threads={threads}
							/>
						)}
					</PubDiscussionsManager>
				)}
			</PubCollabManager>
		);
	}
}

Pub.propTypes = propTypes;
export default Pub;

hydrateWrapper(Pub);
