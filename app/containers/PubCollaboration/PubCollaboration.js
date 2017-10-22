import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import queryString from 'query-string';
import { withRouter, Link } from 'react-router-dom';
import { NonIdealState } from '@blueprintjs/core';
import NoMatch from 'containers/NoMatch/NoMatch';
import Overlay from 'components/Overlay/Overlay';
import PubCollabEditor from 'components/PubCollabEditor/PubCollabEditor';
import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import PubCollabPublish from 'components/PubCollabPublish/PubCollabPublish';
import PubCollabSubmit from 'components/PubCollabSubmit/PubCollabSubmit';
import PubCollabDetails from 'components/PubCollabDetails/PubCollabDetails';
import PubCollabCollections from 'components/PubCollabCollections/PubCollabCollections';
// import PubCollabCollaborators from 'components/PubCollabCollaborators/PubCollabCollaborators';
import DiscussionNew from 'components/DiscussionNew/DiscussionNew';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionPreviewArchived from 'components/DiscussionPreviewArchived/DiscussionPreviewArchived';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import { getPubData, putPubData, deletePub, postDiscussion, putDiscussion, postCollaborator, putCollaborator, deleteCollaborator, postVersion, postCollectionPub, deleteCollectionPub } from 'actions/pub';
import { nestDiscussionsToThreads, getRandomColor } from 'utilities';

require('./pubCollaboration.scss');
require('components/PubBody/pubBody.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

class PubCollaboration extends Component {
	constructor(props) {
		super(props);
		const loginData = props.loginData.data || {};
		const userColor = getRandomColor();
		this.localUser = {
			id: loginData.id || `anon-${Math.floor(Math.random() * 9999)}`,
			backgroundColor: `rgba(${userColor}, 0.2)`,
			cursorColor: `rgba(${userColor}, 1.0)`,
			image: loginData.avatar || null,
			name: loginData.fullName || 'Anonymous',
			intitials: loginData.initials || '?',
		};

		this.state = {
			isPublishOpen: false,
			isSubmitOpen: false,
			isShareOpen: false,
			isDetailsOpen: false,
			isCollaboratorsOpen: false,
			isCollectionsOpen: false,
			isArchivedVisible: false,
			activeCollaborators: [this.localUser],
		};
		this.editorRef = undefined;
		this.togglePublish = this.togglePublish.bind(this);
		this.toggleSubmit = this.toggleSubmit.bind(this);
		this.toggleShare = this.toggleShare.bind(this);
		this.toggleDetails = this.toggleDetails.bind(this);
		this.toggleCollaborators = this.toggleCollaborators.bind(this);
		this.toggleCollections = this.toggleCollections.bind(this);
		this.toggleArchivedVisible = this.toggleArchivedVisible.bind(this);
		this.handleDetailsSave = this.handleDetailsSave.bind(this);
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
		this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
		// this.focusEditor = this.focusEditor.bind(this);
	}
	componentWillMount() {
		const queryObject = queryString.parse(this.props.location.search);
		this.props.dispatch(getPubData(this.props.match.params.slug, this.props.appData.data.id, queryObject.access));
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.pubData.postDiscussionIsLoading
			&& !nextProps.pubData.postDiscussionIsLoading
			&& (nextProps.location.search.indexOf('thread=new') > -1 || this.state.isSubmitOpen)
		) {
			this.setState({ isSubmitOpen: false });
			this.props.history.push(`${nextProps.location.pathname}?thread=${nextProps.pubData.newThreadNumber}`);
		}
		if (this.props.pubData.putPubIsLoading && !nextProps.pubData.putPubIsLoading) {
			this.setState({ isDetailsOpen: false });
			const oldSlug = this.props.match.params.slug;
			const newSlug = nextProps.pubData.data.slug;
			this.props.history.replace(`${nextProps.location.pathname.replace(`/pub/${oldSlug}`, `/pub/${newSlug}`)}${nextProps.location.search}`);
		}
		if (this.props.pubData.postVersionIsLoading && !nextProps.pubData.postVersionIsLoading && nextProps.pubData.postVersionSuccess) {
			this.props.history.push(nextProps.location.pathname.replace('/collaborate', ''));
		}
		if (this.props.pubData.deletePubIsLoading && !nextProps.pubData.deletePubIsLoading) {
			this.props.history.push('/');
		}
	}
	componentWillUnmount() {
		// this.props.dispatch(clearPubData());
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
	toggleArchivedVisible() {
		this.setState({ isArchivedVisible: !this.state.isArchivedVisible });
	}
	handleDetailsSave(detailsObject) {
		this.props.dispatch(putPubData({
			...detailsObject,
			pubId: this.props.pubData.data.id,
			communityId: this.props.appData.data.id,
		}));
	}
	handlePubDelete(pubId) {
		this.props.dispatch(deletePub({
			pubId: pubId,
			communityId: this.props.appData.data.id,
		}));
	}
	handlePostDiscussion(discussionObject) {
		this.props.dispatch(postDiscussion({
			...discussionObject,
			communityId: this.props.pubData.data.communityId,
		}));
	}
	handlePutDiscussion(discussionObject) {
		this.props.dispatch(putDiscussion({
			...discussionObject,
			communityId: this.props.pubData.data.communityId,
		}));
	}
	handleCollaboratorAdd(collaboratorObject) {
		this.props.dispatch(postCollaborator(collaboratorObject));
	}
	handleCollaboratorUpdate(collaboratorObject) {
		this.props.dispatch(putCollaborator(collaboratorObject));
	}
	handleCollaboratorDelete(collaboratorObject) {
		this.props.dispatch(deleteCollaborator(collaboratorObject));
	}
	handleAddCollection(addCollectionObject) {
		this.props.dispatch(postCollectionPub({
			...addCollectionObject,
			communityId: this.props.pubData.data.communityId,
		}));
	}
	handleRemoveCollection(removeCollectionObject) {
		this.props.dispatch(deleteCollectionPub({
			...removeCollectionObject,
			communityId: this.props.pubData.data.communityId,
		}));
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
	handlePublish(submitHash) {
		this.props.dispatch((postVersion({
			pubId: this.props.pubData.data.id,
			communityId: this.props.appData.data.id,
			content: this.editorRef.view.state.doc.toJSON(),
			submitHash: submitHash,
		})));
	}
	// focusEditor() {
	// 	console.log(this.editorRef);
	// 	this.editorRef.focus();
	// }
	handleClientChange(clients) {
		this.setState({
			activeCollaborators: [this.localUser, ...clients]
		});
	}
	render() {
		const queryObject = queryString.parse(this.props.location.search);

		const pubData = this.props.pubData.data || {};
		const collaborators = pubData.collaborators || [];
		const loginData = this.props.loginData.data || {};
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const submissionThreadNumber = threads.reduce((prev, curr)=> {
			if (curr[0].submitHash && !curr[0].isArchived) { return curr[0].threadNumber; }
			return prev;
		}, undefined);
		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === Number(queryObject.thread)) { return curr; }
			return prev;
		}, undefined);

		const activeThreads = threads.filter((items)=> {
			return items.reduce((prev, curr)=> {
				if (curr.isArchived) { return false; }
				return prev;
			}, true);
		}).sort((foo, bar)=> {
			if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
			if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
			return 0;
		});

		const archivedThreads = threads.filter((items)=> {
			return items.reduce((prev, curr)=> {
				if (curr.isArchived) { return true; }
				return prev;
			}, false);
		}).sort((foo, bar)=> {
			if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
			if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
			return 0;
		});

		let canManage = false;
		if (pubData.localPermissions === 'manage') { canManage = true; }
		if (pubData.adminPermissions === 'manage' && loginData.isAdmin) { canManage = true; }

		let canDelete = false;
		if (canManage && !pubData.publishedAt) { canDelete = true; }
		if (pubData.adminPermissions === 'manage' && loginData.isAdmin) { canDelete = true; }

		if (this.props.pubData.isLoading) {
			return (
				<div className={'pub-collaboration'}>
					<div className={'upper'}>
						<div className={'container'}>
							<div className={'row'}>
								<div className={'col-12'} />
							</div>
						</div>
					</div>
					<div className={'lower'}>
						<div className={'container'}>
							<div className={'row'}>
								<div className={'col-12'}>
									<div className={'side-panel'} />
									<div className={'content-panel'} />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (!pubData.id) {
			return <NoMatch />;
		}

		return (
			<div className={'pub-collaboration'}>
				<Helmet>
					<title>Collaborate · {pubData.title}</title>
				</Helmet>

				<div className={'upper'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<PubCollabHeader
									pubData={pubData}
									collaborators={pubData.collaborators}
									canManage={canManage}
									isAdmin={loginData.isAdmin}
									activeCollaborators={this.state.activeCollaborators}
									submissionThreadNumber={submissionThreadNumber}
									activeThread={activeThread}
									onPublishClick={this.togglePublish}
									onSubmitClick={this.toggleSubmit}
									onShareClick={this.toggleShare}
									onDetailsClick={this.toggleDetails}
									onCollaboratorsClick={this.toggleCollaborators}
									onCollectionsClick={this.toggleCollections}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={'lower'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>

								<div className={'side-panel'}>
									<div className={'side-panel-content'}>
										{!queryObject.thread &&
											<div className={'new-discussion-wrapper'}>
												<Link to={`${this.props.location.pathname}?thread=new`} className={'pt-button pt-minimal pt-icon-add top-button'}>
													New Discussion
												</Link>
											</div>
										}
										{queryObject.thread === 'new' &&
											<DiscussionNew
												pubId={pubData.id}
												slug={pubData.slug}
												loginData={this.props.loginData.data}
												pathname={`${this.props.location.pathname}${this.props.location.search}`}
												handleDiscussionSubmit={this.handlePostDiscussion}
												submitIsLoading={this.props.pubData.postDiscussionIsLoading}
											/>
										}
										{queryObject.thread !== 'new' && !activeThread &&
											<div>
												{activeThreads.map((thread)=> {
													return (
														<DiscussionPreview
															key={`thread-${thread[0].id}`}
															discussions={thread}
															slug={pubData.slug}
															isPresentation={false}
														/>
													);
												})}
												{!!archivedThreads.length &&
													<div className={'archived-threads'}>
														<button className={'pt-button pt-minimal pt-large pt-fill archive-title-button'} onClick={this.toggleArchivedVisible}>
															{this.state.isArchivedVisible ? 'Hide ' : 'Show '}
															Archived Thread{archivedThreads.length === 1 ? '' : 's'} ({archivedThreads.length})
															
															
														</button>
														{this.state.isArchivedVisible && archivedThreads.map((thread)=> {
															return (
																<DiscussionPreviewArchived
																	key={`thread-${thread[0].id}`}
																	discussions={thread}
																	slug={pubData.slug}
																	isPresentation={false}
																/>
															);
														})}
													</div>
												}
											</div>
										}
										{activeThread &&
											<DiscussionThread
												discussions={activeThread}
												canManage={pubData.localPermissions === 'manage' || (this.props.loginData.data.isAdmin && pubData.adminPermissions === 'manage')}
												slug={pubData.slug}
												loginData={this.props.loginData.data}
												pathname={`${this.props.location.pathname}${this.props.location.search}`}
												handleReplySubmit={this.handlePostDiscussion}
												handleReplyEdit={this.handlePutDiscussion}
												submitIsLoading={this.props.pubData.postDiscussionIsLoading}
												onPublish={this.handlePublish}
												publishIsLoading={this.props.pubData.postVersionIsLoading}
											/>
										}
										{threads.length === 0 && !queryObject.thread &&
											<NonIdealState
												title={'Start the Conversation'}
												visual={'pt-icon-chat'}
												action={
													<Link to={`${this.props.location.pathname}?thread=new`} className={'pt-button'}>
														Create New Discussion
													</Link>
												}
											/>
										}
									</div>
								</div>

								<div
									className={'content-panel'}
									// onClick={this.focusEditor}
									tabIndex={-1}
									role={'textbox'}
								>
									<div className={'pub-body'}>
										<PubCollabEditor
											onRef={(ref)=> { this.editorRef = ref; }}
											editorKey={`pub-${pubData.id}`}
											isReadOnly={!canManage && pubData.localPermissions !== 'edit'}
											clientData={this.state.activeCollaborators[0]}
											onClientChange={this.handleClientChange}
											threads={threads}
											slug={pubData.slug}
										/>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<Overlay isOpen={this.state.isPublishOpen} onClose={this.togglePublish}>
					<PubCollabPublish
						pubData={pubData}
						onPublish={this.handlePublish}
						onPutPub={this.handleDetailsSave}
						isLoading={this.props.pubData.postVersionIsLoading}
						onOpenDetails={this.onOpenDetails}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isSubmitOpen} onClose={this.toggleSubmit}>
					<PubCollabSubmit
						appData={this.props.appData.data}
						pubData={pubData}
						loginData={this.props.loginData.data}
						pubId={pubData.id}
						onSubmit={this.handlePostDiscussion}
						onPutPub={this.handleDetailsSave}
						isLoading={this.props.pubData.postDiscussionIsLoading}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isCollectionsOpen} onClose={this.toggleCollections}>
					<PubCollabCollections
						pubData={pubData}
						collections={this.props.appData.data.collections}
						onAddCollection={this.handleAddCollection}
						onRemoveCollection={this.handleRemoveCollection}
					/>
				</Overlay>
				<Overlay isOpen={this.state.isShareOpen} onClose={this.toggleShare}>
					<PubCollabShare
						appData={this.props.appData.data}
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
					{/* <PubCollabCollaborators
						pubData={pubData}
						canManage={canManage}
						onOpenShare={this.onOpenShare}
						onCollaboratorAdd={this.handleCollaboratorAdd}
						onCollaboratorUpdate={this.handleCollaboratorUpdate}
						onCollaboratorDelete={this.handleCollaboratorDelete}
					/> */}
					<PubCollabShare
						appData={this.props.appData.data}
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
						putIsLoading={this.props.pubData.putPubIsLoading}
						deleteIsLoading={this.props.pubData.deletePubIsLoading}
					/>
				</Overlay>
			</div>
		);
	}
}

PubCollaboration.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	pubData: state.pub,
	loginData: state.login,
}))(PubCollaboration));
