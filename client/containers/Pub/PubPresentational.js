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
import { getHighlights } from './highlights';
import sharedPropTypes from './propTypes';

const handlerTypes = {
	onEditorChange: PropTypes.func.isRequired,
	onSetOptionsMode: PropTypes.func.isRequired,
	onSingleClick: PropTypes.func.isRequired,
	onStatusChange: PropTypes.func.isRequired,
	onSetPubData: PropTypes.func.isRequired,
};

const propTypes = {
	...handlerTypes,
	activeContent: PropTypes.shape({}).isRequired,
	activeThreadNumber: PropTypes.number.isRequired,
	editorChangeObject: PropTypes.shape({
		view: PropTypes.shape({}).isRequired,
	}).isRequired,
	isEmptyDoc: PropTypes.bool.isRequired,
	isCollabLoading: PropTypes.bool.isRequired,
	linkPopupIsOpen: PropTypes.bool.isRequired,
	pubData: sharedPropTypes.pubData.isRequired,
	threads: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
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
};

class PubPresentational extends React.Component {
	renderPubMain() {
		const {
			activeContent,
			activeCollaborators,
			activeDiscussionChannel,
			activeThreadNumber,
			communityData,
			discussionNodeOptions,
			editorChangeObject,
			isCollabLoading,
			isEmptyDoc,
			initialDiscussionContent,
			loginData,
			locationData,
			pubData,
			threads,
		} = this.props;
		const { activeVersion } = pubData;
		const { query: queryObject } = locationData;
		const hasSections = pubData.isDraft
			? pubData.sectionsData.length > 1
			: activeVersion && Array.isArray(activeVersion.content);
		const sectionId = this.props.locationData.params.sectionId || '';
		const highlights = getHighlights(
			pubData,
			activeDiscussionChannel,
			sectionId,
			queryObject,
			editorChangeObject,
		);
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
									setOptionsMode={this.setOptionsMode}
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
									setActiveThread={this.setActiveThread}
									onChange={this.handleEditorChange}
									onSingleClick={this.handleEditorSingleClick}
									// Props from CollabEditor
									editorKey={`${this.props.pubData.editorKey}${
										sectionId ? '/' : ''
									}${sectionId || ''}`}
									isReadOnly={
										!pubData.isDraft ||
										(!pubData.isManager && !pubData.isDraftEditor)
									}
									clientData={activeCollaborators[0]}
									onClientChange={this.handleClientChange}
									onStatusChange={this.handleStatusChange}
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
									setOptionsMode={this.setOptionsMode}
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
								setOptionsMode={this.setOptionsMode}
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
									onPostDiscussion={this.handlePostDiscussion}
									onPutDiscussion={this.handlePutDiscussion}
									getHighlightContent={this.getHighlightContent}
									activeThread={activeThreadNumber}
									setActiveThread={this.setActiveThread}
									activeDiscussionChannel={activeDiscussionChannel}
									initialContent={initialDiscussionContent}
									getAbsolutePosition={this.getAbsolutePosition}
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
		const { pubData, editorChangeObject, linkPopupIsOpen, onOpenLinkMenu } = this.props;
		return (
			<React.Fragment>
				{!linkPopupIsOpen && !isMobile && (
					<PubInlineMenu
						pubData={pubData}
						editorChangeObject={editorChangeObject}
						getAbsolutePosition={this.getAbsolutePosition}
						onNewHighlightDiscussion={this.handleNewHighlightDiscussion}
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
				setOptionsMode={this.setOptionsMode}
				setPubData={this.setPubData}
			/>
		);
	}

	render() {
		const {
			activeCollaborators,
			activeDiscussionChannel,
			collabStatus,
			editorChangeObject,
			locationData,
			loginData,
			pubData,
			threads,
		} = this.props;
		const sectionId = locationData.params.sectionId || '';
		const isMobile = checkIfMobile();
		return (
			<div id="pub-container" ref={this.pageRef}>
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<PubHeader
						pubData={pubData}
						communityData={this.props.communityData}
						locationData={this.props.locationData}
						setOptionsMode={this.setOptionsMode}
						setPubData={this.setPubData}
						activeDiscussionChannel={activeDiscussionChannel}
						setDiscussionChannel={this.setDiscussionChannel}
					/>

					<div>
						{pubData.isDraft && (
							<PubDraftHeader
								pubData={pubData}
								loginData={loginData}
								editorChangeObject={editorChangeObject}
								setOptionsMode={this.setOptionsMode}
								bottomCutoffId="discussions"
								onRef={this.handleMenuWrapperRef}
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
