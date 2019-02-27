import React, { Component } from 'react';
import { dispatchEmptyTransaction, docIsEmpty, marksAtSelection } from '@pubpub/editor';
import { apiFetch, hydrateWrapper } from 'utilities';

import PubCollabManager from './PubCollabManager';
import PubDiscussionsManager from './PubDiscussionsMananger';
import PubPresentational from './PubPresentational';
import { getHighlights, hasPermanentHighlight } from './highlights';
import sharedPropTypes from './sharedPropTypes';

require('./pub.scss');

const propTypes = {
	communityData: sharedPropTypes.communityData.isRequired,
	loginData: sharedPropTypes.loginData.isRequired,
	locationData: sharedPropTypes.locationData.isRequired,
	pubData: sharedPropTypes.pubData.isRequired,
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
		this.setOptionsMode = this.setOptionsMode.bind(this);
		this.setPubData = this.setPubData.bind(this);
		this.handleSectionsChange = this.handleSectionsChange.bind(this);
		this.handlePutLabels = this.handlePutLabels.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleEditorSingleClick = this.handleEditorSingleClick.bind(this);
		this.calculateLinkPopupState = this.calculateLinkPopupState.bind(this);
		this.handleKeyPressEvents = this.handleKeyPressEvents.bind(this);
	}

	componentDidMount() {
		if (this.state.pubData.isDraft) {
			window.addEventListener('keydown', this.handleKeyPressEvents);
		}
	}

	componentDidUpdate() {
		if (
			hasPermanentHighlight(
				this.state.pubData,
				this.state.editorChangeObject,
				this.props.locationData.query,
			) &&
			!this.state.scrolledToPermanent
		) {
			setTimeout(() => {
				const thing = document.getElementsByClassName('permanent')[0];
				if (thing) {
					window.scrollTo(0, thing.getBoundingClientRect().top - 135);
					this.setState({ scrolledToPermanent: true });
				}
			}, 100);
		}
	}

	componentWillUnmount() {
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
		const isEmptyDoc = !!(
			this.state.editorChangeObject.view &&
			docIsEmpty(this.state.editorChangeObject.view.state.doc)
		);
		const presentationalHandlers = {
			onEditorChange: this.handleEditorChange,
			onSetOptionsMode: this.setOptionsMode,
			onSetPubData: this.setPubData,
			onSingleClick: this.handleEditorSingleClick,
		};

		return (
			<PubCollabManager
				editorChangeObject={this.state.editorChangeObject}
				loginData={this.props.loginData}
				pubData={this.state.pubData}
				onSectionsChange={this.handleSectionsChange}
			>
				{({
					handleCollabStatusChange,
					handleClientChange,
					collabStatus,
					activeCollaborators,
					isCollabLoading,
					firebaseRef,
				}) => (
					<PubDiscussionsManager
						communityData={this.props.communityData}
						editorChangeObject={this.state.editorChangeObject}
						initialLocationData={this.props.locationData}
						loginData={this.props.loginData}
						pubData={this.state.pubData}
					>
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
								activeCollaborators={activeCollaborators}
								activeContent={this.getActiveContent()}
								activeDiscussionChannel={activeDiscussionChannel}
								activeThreadNumber={activeThreadNumber}
								collabStatus={collabStatus}
								communityData={this.props.communityData}
								discussionHandlers={discussionHandlers}
								discussionNodeOptions={{
									...discussionNodeOptionsPartial,
									getLocationData: () => this.props.locationData,
									getLoginData: () => this.props.loginData,
									getPubData: () => this.state.pubData,
								}}
								firebaseRef={firebaseRef}
								editorChangeObject={this.state.editorChangeObject}
								highlights={getHighlights(
									this.state.pubData,
									locationData,
									activeDiscussionChannel,
									this.state.editorChangeObject,
								)}
								initialDiscussionContent={initialDiscussionContent}
								isCollabLoading={isCollabLoading}
								isEmptyDoc={isEmptyDoc}
								linkPopupIsOpen={this.state.linkPopupIsOpen}
								locationData={locationData}
								loginData={this.props.loginData}
								onClientChange={handleClientChange}
								onOpenLinkMenu={() => {
									this.setState({ linkPopupIsOpen: true });
								}}
								onPutLabels={this.handlePutLabels}
								onStatusChange={handleCollabStatusChange}
								optionsMode={this.state.optionsMode}
								pubData={this.state.pubData}
								threads={threads}
								sectionId={locationData.params.sectionId || ''}
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
