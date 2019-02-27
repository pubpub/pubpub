import PropTypes from 'prop-types';
import React from 'react';

import PageWrapper from 'components/PageWrapper/PageWrapper';
import PubHeader from 'components/PubHeader/PubHeader';
import PubDraftHeader from 'components/PubDraftHeader/PubDraftHeader';
import PubBody from 'components/PubBody/PubBody';
import PubOptions from 'components/PubOptions/PubOptions';
import PubSideToc from 'components/PubSideToc/PubSideToc';
import PubSideCollaborators from 'components/PubSideCollaborators/PubSideCollaborators';
import PubSideDiscussions from 'components/PubSideDiscussions/PubSideDiscussions';
import PubInlineImport from 'components/PubInlineImport/PubInlineImport';
import PubLicense from 'components/PubLicense/PubLicense';
import PubLoadingBars from 'components/PubLoadingBars/PubLoadingBars';
import PubInlineMenu from 'components/PubInlineMenu/PubInlineMenu';
import PubLinkMenu from 'components/PubLinkMenu/PubLinkMenu';
import PubSectionNav from 'components/PubSectionNav/PubSectionNav';
import DiscussionList from 'components/DiscussionList/DiscussionList';

import checkIfMobile from 'is-mobile';
import sharedPropTypes from './propTypes';

const handlerTypes = {
	onEditorChange: PropTypes.func.isRequired,
	onClientChange: PropTypes.func.isRequired,
	onSetOptionsMode: PropTypes.func.isRequired,
	onSingleClick: PropTypes.func.isRequired,
	onSetPubData: PropTypes.func.isRequired,
	onStatusChange: PropTypes.func.isRequired,
};

const propTypes = {
	...handlerTypes,
	activeCollaborators: PropTypes.array.isRequired,
	activeContent: PropTypes.shape({}).isRequired,
	activeThreadNumber: PropTypes.number.isRequired,
	collabStatus: PropTypes.string.isRequired,
	discussionHandlers: PropTypes.shape({
		onNewHighlightDiscussion: PropTypes.func.isRequired,
		onPostDiscussion: PropTypes.func.isRequired,
		onPutDiscussion: PropTypes.func.isRequired,
		onSetActiveThread: PropTypes.func.isRequired,
		onSetDiscussionChannel: PropTypes.func.isRequired,
	}).isRequired,
	discussionNodeOptions: PropTypes.shape({
		getThreads: PropTypes.func.isRequired,
		getPubData: PropTypes.func.isRequired,
		getLocationData: PropTypes.func.isRequired,
		getLoginData: PropTypes.func.isRequired,
		getOnPostDiscussion: PropTypes.func.isRequired,
		getOnPutDiscussion: PropTypes.func.isRequired,
		getGetHighlightContent: PropTypes.func.isRequired,
		getHandleQuotePermalink: PropTypes.func.isRequired,
	}).isRequired,
	editorChangeObject: PropTypes.shape({
		view: PropTypes.shape({}).isRequired,
	}).isRequired,
	highlights: PropTypes.arrayOf(PropTypes.shape({}.isRequired)).isRequired,
	isEmptyDoc: PropTypes.bool.isRequired,
	isCollabLoading: PropTypes.bool.isRequired,
	initialDiscussionContent: PropTypes.shape({}).isRequired,
	linkPopupIsOpen: PropTypes.bool.isRequired,
	loginData: sharedPropTypes.loginData.isRequired,
	optionsMode: PropTypes.string.isRequired,
	pubData: sharedPropTypes.pubData.isRequired,
	sectionId: PropTypes.string.isRequired,
	threads: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

export default class PubPresentational extends React.Component {
	constructor(props) {
		super(props);
		this.sideMarginRef = React.createRef();
	}

	getAbsolutePosition(top, left, placeInSideMargin) {
		const { editorChangeObject } = this.props;
		const sideContainer = this.sideMarginRef.current;
		/* The editorObject does not refresh on scroll - so we need to calculate the */
		/* y offset as 'the location of the highlight and the moment of update */
		return {
			top: top + editorChangeObject.currentScroll,
			left: placeInSideMargin ? sideContainer.getBoundingClientRect().left : left,
			width: placeInSideMargin ? sideContainer.getBoundingClientRect().width : undefined,
		};
	}

	renderPubMain() {
		const {
			activeContent,
			activeCollaborators,
			activeDiscussionChannel,
			activeThreadNumber,
			communityData,
			discussionHandlers,
			discussionNodeOptions,
			highlights,
			editorChangeObject,
			getAbsolutePosition,
			isCollabLoading,
			isEmptyDoc,
			initialDiscussionContent,
			loginData,
			locationData,
			onClientChange,
			onEditorChange,
			onSingleClick,
			onSetOptionsMode,
			onStatusChange,
			pubData,
			sectionId,
			threads,
		} = this.props;
		const { activeVersion } = pubData;
		const { query: queryObject } = locationData;
		const hasSections = pubData.isDraft
			? pubData.sectionsData.length > 1
			: activeVersion && Array.isArray(activeVersion.content);
		return (
			<div className="container pub">
				<div className="row">
					<div className="col-12 pub-columns">
						<div className="main-content">
							{isCollabLoading && <PubLoadingBars />}

							{/* Prev/Content/Next Buttons */}
							{!isCollabLoading && hasSections && (
								<PubSectionNav
									pubData={pubData}
									queryObject={queryObject}
									hasSections={hasSections}
									sectionId={sectionId}
									setOptionsMode={onSetOptionsMode}
								/>
							)}

							<div style={isCollabLoading ? { opacity: 0 } : {}}>
								<PubBody
									showWorkingDraftButton={
										!pubData.isDraft && (pubData.isEditor || pubData.isManager)
									}
									isDraft={pubData.isDraft}
									versionId={activeVersion && activeVersion.id}
									sectionId={sectionId}
									content={activeContent}
									threads={threads}
									slug={pubData.slug}
									highlights={highlights}
									hoverBackgroundColor={communityData.accentMinimalColor}
									setActiveThread={discussionHandlers.onSetActiveThread}
									onChange={onEditorChange}
									onSingleClick={onSingleClick}
									// Props from CollabEditor
									editorKey={`${pubData.editorKey}${
										sectionId ? '/' : ''
									}${sectionId || ''}`}
									isReadOnly={
										!pubData.isDraft ||
										(!pubData.isManager && !pubData.isDraftEditor)
									}
									clientData={activeCollaborators[0]}
									onClientChange={onClientChange}
									onStatusChange={onStatusChange}
									discussionNodeOptions={discussionNodeOptions}
								/>
							</div>

							{!isCollabLoading &&
								isEmptyDoc &&
								pubData.isDraft &&
								(pubData.isEditor || pubData.isManager) && (
									<PubInlineImport editorView={editorChangeObject.view} />
								)}

							{/* Prev/Content/Next Buttons */}
							{!isCollabLoading && hasSections && (
								<PubSectionNav
									pubData={pubData}
									queryObject={queryObject}
									hasSections={hasSections}
									sectionId={sectionId}
									setOptionsMode={onSetOptionsMode}
								/>
							)}

							{/* License */}
							{!pubData.isDraft && <PubLicense />}
						</div>
						<div className="side-content" ref={this.sideMarginRef}>
							<PubSideToc
								pubData={pubData}
								activeContent={activeContent}
								editorChangeObject={editorChangeObject}
							/>
							<PubSideCollaborators
								pubData={pubData}
								setOptionsMode={onSetOptionsMode}
							/>
							{pubData.publicDiscussions && (
								<PubSideDiscussions
									key={
										activeDiscussionChannel
											? activeDiscussionChannel.id
											: 'public-channel'
									}
									threads={threads}
									pubData={pubData}
									locationData={locationData}
									editorChangeObject={editorChangeObject}
									loginData={loginData}
									onPostDiscussion={discussionHandlers.onPostDiscussion}
									onPutDiscussion={discussionHandlers.onPutDiscussion}
									getHighlightContent={discussionHandlers.onGetHighlightContent}
									activeThread={activeThreadNumber}
									setActiveThread={discussionHandlers.onSetActiveThread}
									activeDiscussionChannel={activeDiscussionChannel}
									initialContent={initialDiscussionContent}
									getAbsolutePosition={getAbsolutePosition}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderPubDiscussions(threads, activeDiscussionChannel) {
		const { locationData, discussionHandlers, pubData } = this.props;
		const {
			onPutLabels,
			onPostDiscussion,
			onPutDiscussion,
			onGetHighlightContent,
			onSetDiscussionChannel,
			onQuotePermalink,
		} = discussionHandlers;
		return (
			pubData.publicDiscussions && (
				<div id="discussions" className="discussions">
					<div className="container pub">
						<div className="row">
							<div className="col-12">
								<DiscussionList
									pubData={pubData}
									loginData={this.props.loginData}
									threads={threads}
									locationData={locationData}
									onLabelsSave={onPutLabels}
									onPostDiscussion={onPostDiscussion}
									onPutDiscussion={onPutDiscussion}
									getHighlightContent={onGetHighlightContent}
									activeDiscussionChannel={activeDiscussionChannel}
									setDiscussionChannel={onSetDiscussionChannel}
									handleQuotePermalink={onQuotePermalink}
								/>
							</div>
						</div>
					</div>
				</div>
			)
		);
	}

	renderOverlays(isMobile, sectionId) {
		const {
			pubData,
			discussionHandlers,
			editorChangeObject,
			linkPopupIsOpen,
			onOpenLinkMenu,
		} = this.props;
		return (
			<React.Fragment>
				{!linkPopupIsOpen && !isMobile && (
					<PubInlineMenu
						pubData={pubData}
						editorChangeObject={editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
						onNewHighlightDiscussion={discussionHandlers.onNewHighlightDiscussion}
						sectionId={sectionId}
						openLinkMenu={onOpenLinkMenu}
					/>
				)}
				{linkPopupIsOpen && !isMobile && (
					<PubLinkMenu
						pubData={pubData}
						editorChangeObject={editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
					/>
				)}
			</React.Fragment>
		);
	}

	renderPubOptions() {
		const {
			communityData,
			locationData,
			loginData,
			editorChangeObject,
			onSetOptionsMode,
			onSetPubData,
			optionsMode,
			pubData,
		} = this.props;
		return (
			<PubOptions
				communityData={communityData}
				pubData={pubData}
				loginData={loginData}
				locationData={locationData}
				firebaseRef={this.firebaseRef}
				editorView={editorChangeObject.view}
				optionsMode={optionsMode}
				setOptionsMode={onSetOptionsMode}
				setPubData={onSetPubData}
			/>
		);
	}

	render() {
		const {
			activeCollaborators,
			activeDiscussionChannel,
			collabStatus,
			discussionHandlers,
			editorChangeObject,
			locationData,
			loginData,
			onSetOptionsMode,
			onSetPubData,
			pubData,
			threads,
		} = this.props;
		const sectionId = locationData.params.sectionId || '';
		const isMobile = checkIfMobile();
		return (
			<div id="pub-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<PubHeader
						pubData={pubData}
						communityData={this.props.communityData}
						locationData={this.props.locationData}
						setOptionsMode={onSetOptionsMode}
						setPubData={onSetPubData}
						activeDiscussionChannel={activeDiscussionChannel}
						setDiscussionChannel={discussionHandlers.setDiscussionChannel}
					/>

					<div>
						{pubData.isDraft && (
							<PubDraftHeader
								pubData={pubData}
								loginData={loginData}
								editorChangeObject={editorChangeObject}
								setOptionsMode={onSetOptionsMode}
								bottomCutoffId="discussions"
								collabStatus={collabStatus}
								activeCollaborators={activeCollaborators}
								threads={threads}
							/>
						)}

						{this.renderPubMain()}
					</div>
					{this.renderPubDiscussions(pubData, activeDiscussionChannel)}
					{this.renderOverlays(pubData, isMobile, sectionId)}
					{this.renderPubOptions()}
				</PageWrapper>
			</div>
		);
	}
}

PubPresentational.propTypes = propTypes;
