import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';
import Avatar from 'components/Avatar/Avatar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dateFormat from 'dateformat';
import { apiFetch } from 'utilities';

require('./pubOptionsSharing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
	canManage: PropTypes.bool.isRequired,
};

class PubOptionsSharing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCommunityAdminManaged: this.props.pubData.isCommunityAdminManaged,
			communityAdminDraftPermissions: this.props.pubData.communityAdminDraftPermissions,
			draftPermissions: this.props.pubData.draftPermissions,
			// managers: this.props.pubData.managers,
			// collaborationMode: this.props.pubData.collaborationMode,
			// adminPermissions: this.props.pubData.adminPermissions,
			// collaborators: this.props.pubData.collaborators.filter((item)=> {
			// 	return this.props.canManage || item.Collaborator.isAuthor || item.Collaborator.isContributor;
			// }).sort((foo, bar)=> {
			// 	if (!this.props.canManage && foo.Collaborator.isAuthor && !bar.Collaborator.isAuthor) { return -1; }
			// 	if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
			// 	if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
			// 	if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
			// 	if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
			// 	return 0;
			// }),
		};
		this.handleUserSelect = this.handleUserSelect.bind(this);
		this.handleAddManagerSelect = this.handleAddManagerSelect.bind(this);
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.handleCollaboratorAdd = this.handleCollaboratorAdd.bind(this);
		this.handleCollaboratorUpdate = this.handleCollaboratorUpdate.bind(this);
		this.handleCollaboratorDelete = this.handleCollaboratorDelete.bind(this);
		this.handlePutPub = this.handlePutPub.bind(this);
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.pubData.collaborators.length !== this.props.pubData.collaborators.length) {
	// 		this.setState({
	// 			collaborators: nextProps.pubData.collaborators.sort((foo, bar)=> {
	// 				if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
	// 				if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
	// 				if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
	// 				if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
	// 				return 0;
	// 			})
	// 		});
	// 	}
	// }

	onDragEnd(result) {
		if (!result.destination) { return null; }
		const sourceIndex = result.source.index;
		const sourceId = this.state.collaborators[sourceIndex].Collaborator.id;
		const destIndex = result.destination.index;
		const destinationOrder = this.state.collaborators[destIndex].Collaborator.order;
		const direction = sourceIndex > destIndex ? -1 : 1;
		let newOrder = 0.5;
		if (sourceIndex === destIndex) {
			newOrder = this.state.collaborators[sourceIndex].Collaborator.order;
		} else if (result.destination.index === 0) {
			newOrder = destinationOrder / 2;
		} else if (result.destination.index === this.state.collaborators.length - 1) {
			newOrder = (1 + destinationOrder) / 2;
		} else {
			const destinationNeighborOrder = this.state.collaborators[destIndex + direction].Collaborator.order;
			newOrder = (destinationOrder + destinationNeighborOrder) / 2;
		}

		const newCollaborators = this.state.collaborators;
		newCollaborators[sourceIndex].Collaborator.order = newOrder;

		this.handleCollaboratorUpdate({
			collaboratorId: sourceId,
			pubId: this.props.pubData.id,
			order: newOrder
		});

		return this.setState({
			collaborators: newCollaborators.sort((foo, bar)=> {
				if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
				if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
				if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
				if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
				return 0;
			})
		});
	}

	handleUserSelect(user) {
		const calculateOrder = this.state.collaborators[0].Collaborator.order / 2;
		this.handleCollaboratorAdd({
			userId: user.id,
			name: user.name,
			order: calculateOrder,
			pubId: this.props.pubData.id,
		});
	}

	handleAddManagerSelect(user) {
		const calculateOrder = this.state.collaborators[0].Collaborator.order / 2;

		const collaboratorExists = this.props.pubData.collaborators.reduce((prev, curr)=> {
			if (curr.id === user.id) { return curr; }
			return prev;
		}, false);
		if (collaboratorExists) {
			this.handleCollaboratorUpdate({
				collaboratorId: collaboratorExists.Collaborator.id,
				pubId: this.props.pubData.id,
				permissions: 'manage',
			});
		} else {
			this.handleCollaboratorAdd({
				userId: user.id,
				name: user.name,
				order: calculateOrder,
				pubId: this.props.pubData.id,
				permissions: 'manage',
			});
		}
	}

	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		this.handlePutPub({
			collaborationMode: value,
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
			this.props.setPubData({
				...this.props.pubData,
				collaborators: [
					...this.props.pubData.collaborators,
					result,
				]
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
			this.props.setPubData({
				...this.props.pubData,
				collaborators: this.props.pubData.collaborators.map((item)=> {
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
			this.props.setPubData({
				...this.props.pubData,
				collaborators: this.props.pubData.collaborators.filter((item)=> {
					return item.Collaborator.id !== result;
				})
			});
		});
	}

	handlePutPub(detailsObject) {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...detailsObject,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				...result
			});
		})
		.catch(()=> {
			// this.setState({ putPubIsLoading: false });
		});
	}

	render() {
		const pubData = this.props.pubData;
		// const managers = this.props.pubData.collaborators.filter((item)=> {
		// 	return item.Collaborator.permissions === 'manage';
		// });
		const managers = pubData.managers;
		const numPubAdmins = managers.length;
		// `${window.location.origin}/pub/${pubData.slug}/collaborate?access=${pubData.editHash}`
		return (
			<div className="pub-options-sharing-component">
				<div>
					<h1>Sharing</h1>
					<h2>Managers</h2>
					<div className="managers">
						<p>Managers can view all versions, edit pub details, edit the draft</p>
						<div className="manager pt-elevation-1">
							<div className="name">
								Community Admins
							</div>
							<div className="options">
								Can Manage
							</div>
						</div>
						{managers.sort((foo, bar)=> {
							/* TODO: because Collaborator objects may already have been created, */
							/* this won't be perfect all the time */
							if (foo.createdAt < bar.createdAt) { return -1; }
							if (foo.createdAt > bar.createdAt) { return 1; }
							return 0;
						}).map((manager)=> {
							return (
								<div className="manager pt-elevation-1">
									<div className="name">
										<Avatar width={35} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />
										{manager.user.fullName}
									</div>
									{managers.length > 1 &&
										<div className="options">
											<button
												className="pt-button pt-minimal"
												type="button"
												onClick={()=> {
													this.handleCollaboratorDelete({
														collaboratorId: manager.id,
														pubId: this.props.pubData.id,
													});
												}}
											>
												Remove
											</button>
										</div>
									}
								</div>
							);
						})}
						<div className="manager pt-elevation-1 add">
							<UserAutocomplete
								onSelect={this.handleAddManagerSelect}
								allowCustomUser={false} // Eventually use this for emails
								placeholder="Add manager..."
								usedUserIds={managers.map((item)=> {
									return item.user.id;
								})}
							/>
						</div>
					</div>

					<h2>Permissions</h2>

					<div className="version-block draft">
						<div className="header">
							<div className="title">Working Draft</div>
							{/*<div className="note"></div>*/}
							<div className="privacy">Public Edit</div>
						</div>
					</div>
					{pubData.versions.sort((foo, bar)=> {
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((version)=> {
						return (
							<div className="version-block">
								<div className="header">
									<div className="title">{dateFormat(version.createdAt, 'mmm dd, yyyy · h:MMTT')}</div>
									{/*<div className="note"></div>*/}
									<div className="privacy">Public Edit</div>
								</div>
							</div>
						);
					})}
					{/*<div className="wrapper">
						<h5>Working Draft Privacy</h5>
						<PubCollabDropdownPrivacy
							value={this.state.collaborationMode}
							onChange={this.handleCollaborationModeChange}
						/>
					</div>*/}

					{/*<div className="wrapper">
						<h5>Community Admin Permissions</h5>
						<PubAdminPermissions
							communityData={this.props.communityData}
							onSave={this.handlePutPub}
							pubData={pubData}
						/>
					</div>*/}

				</div>


				{/*<div>
					<h5> Collaborators</h5>
					{this.props.canManage &&
						<UserAutocomplete
							onSelect={this.handleUserSelect}
							allowCustomUser={true}
							placeholder="Add new Collaborator..."
							usedUserIds={this.state.collaborators.map((item)=> {
								return item.id;
							})}
						/>
					}

					<div className="collaborators-wrapper">
						<DragDropContext onDragEnd={this.onDragEnd}>
							<div className="main-list-wrapper">
								<Droppable droppableId="mainDroppable">
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											className={`main-list ${snapshot.isDraggingOver ? 'dragging' : ''}`}
										>
											{this.state.collaborators.map((item, index)=> {
												return (
													<Draggable key={`draggable-${item.id}`} draggableId={item.id} index={index}>
														{(providedItem, snapshotItem) => (
															<div
																ref={providedItem.innerRef}
																className={`draggable-item ${snapshotItem.isDragging ? 'dragging' : ''}`}
																{...providedItem.draggableProps}
															>
																<PubCollaboratorDetails
																	key={`details-${item.id}`}
																	pubId={this.props.pubData.id}
																	handle={<span {...providedItem.dragHandleProps} className="pt-icon-standard pt-icon-drag-handle-horizontal" />}
																	canManage={this.props.canManage}
																	lastAdmin={item.Collaborator.permissions === 'manage' && numPubAdmins === 1}
																	collaboratorData={item}
																	onCollaboratorUpdate={this.handleCollaboratorUpdate}
																	onCollaboratorDelete={this.handleCollaboratorDelete}
																	// isPermissionsMode={true}
																/>
															</div>
														)}
													</Draggable>
												);
											})}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						</DragDropContext>
					</div>
				</div>*/}

			</div>
		);
	}
}

PubOptionsSharing.propTypes = propTypes;
// PubOptionsSharing.defaultProps = defaultProps;
export default PubOptionsSharing;
