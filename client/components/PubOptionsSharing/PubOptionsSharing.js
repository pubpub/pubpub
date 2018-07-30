import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
// import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
// import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubOptionsDropdownPrivacy from 'components/PubOptionsDropdownPrivacy/PubOptionsDropdownPrivacy';
import PubOptionsDropdownPermissions from 'components/PubOptionsDropdownPermissions/PubOptionsDropdownPermissions';
import Avatar from 'components/Avatar/Avatar';
import { Checkbox } from '@blueprintjs/core';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
			activePermissionsVersion: 'draft',
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
		// this.handleUserSelect = this.handleUserSelect.bind(this);
		this.handleAddManager = this.handleAddManager.bind(this);
		this.handleRemoveManager = this.handleRemoveManager.bind(this);
		this.handleVersionUpdate = this.handleVersionUpdate.bind(this);
		this.handlePubUpdate = this.handlePubUpdate.bind(this);
		this.handleVersionPermissionAdd = this.handleVersionPermissionAdd.bind(this);
		this.handleVersionPermissionUpdate = this.handleVersionPermissionUpdate.bind(this);
		this.handleVersionPermissionDelete = this.handleVersionPermissionDelete.bind(this);
		// this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		// this.onDragEnd = this.onDragEnd.bind(this);
		// this.handleCollaboratorAdd = this.handleCollaboratorAdd.bind(this);
		// this.handleCollaboratorUpdate = this.handleCollaboratorUpdate.bind(this);
		// this.handleCollaboratorDelete = this.handleCollaboratorDelete.bind(this);
		// this.handlePutPub = this.handlePutPub.bind(this);
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

	handleAddManager(user) {
		return apiFetch('/api/pubManagers', {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				managers: [
					...this.props.pubData.managers,
					result,
				]
			});
		});
	}

	handleRemoveManager(managerId) {
		return apiFetch('/api/pubManagers', {
			method: 'DELETE',
			body: JSON.stringify({
				pubManagerId: managerId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				managers: this.props.pubData.managers.filter((manager)=> {
					return manager.id !== managerId;
				})
			});
		});
	}

	handleVersionUpdate(versionUpdates) {
		return apiFetch('/api/versions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versions: this.props.pubData.versions.map((version)=> {
					if (version.id !== versionUpdates.versionId) { return version; }
					return {
						...version,
						...versionUpdates,
					};
				})
			});
		});
	}

	handlePubUpdate(pubUpdates) {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...pubUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				...pubUpdates,
			});
		});
	}

	handleVersionPermissionAdd(newVersionPermission) {
		return apiFetch('/api/versionPermissions', {
			method: 'POST',
			body: JSON.stringify({
				...newVersionPermission,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: [
					...this.props.pubData.versionPermissions,
					result,
				]
			});
		});
	}

	handleVersionPermissionUpdate(versionPermissionUpdates) {
		return apiFetch('/api/versionPermissions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionPermissionUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: this.props.pubData.versionPermissions.map((versionPermission)=> {
					if (versionPermission.id !== versionPermissionUpdates.versionPermissionId) { return versionPermission; }
					return {
						...versionPermission,
						...versionPermissionUpdates,
					};
				})
			});
		});
	}

	handleVersionPermissionDelete(versionPermissionId) {
		return apiFetch('/api/versionPermissions', {
			method: 'DELETE',
			body: JSON.stringify({
				versionPermissionId: versionPermissionId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: this.props.pubData.versionPermissions.filter((versionPermission)=> {
					return versionPermission.id !== versionPermissionId;
				})
			});
		});
	}

	// handleCollaborationModeChange(value) {
	// 	this.setState({ collaborationMode: value });
	// 	this.handlePutPub({
	// 		collaborationMode: value,
	// 	});
	// }

	// handleCollaboratorAdd(collaboratorObject) {
	// 	return apiFetch('/api/collaborators', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			...collaboratorObject,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then((result)=> {
	// 		this.props.setPubData({
	// 			...this.props.pubData,
	// 			collaborators: [
	// 				...this.props.pubData.collaborators,
	// 				result,
	// 			]
	// 		});
	// 	});
	// }

	// handleCollaboratorUpdate(collaboratorObject) {
	// 	return apiFetch('/api/collaborators', {
	// 		method: 'PUT',
	// 		body: JSON.stringify({
	// 			...collaboratorObject,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then((result)=> {
	// 		this.props.setPubData({
	// 			...this.props.pubData,
	// 			collaborators: this.props.pubData.collaborators.map((item)=> {
	// 				if (item.Collaborator.id === result.Collaborator.id) {
	// 					return {
	// 						...item,
	// 						fullName: result.fullName || item.fullName,
	// 						Collaborator: {
	// 							...item.Collaborator,
	// 							...result.Collaborator,
	// 						}
	// 					};
	// 				}
	// 				return item;
	// 			})
	// 		});
	// 	});
	// }

	// handleCollaboratorDelete(collaboratorObject) {
	// 	return apiFetch('/api/collaborators', {
	// 		method: 'DELETE',
	// 		body: JSON.stringify({
	// 			...collaboratorObject,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then((result)=> {
	// 		this.props.setPubData({
	// 			...this.props.pubData,
	// 			collaborators: this.props.pubData.collaborators.filter((item)=> {
	// 				return item.Collaborator.id !== result;
	// 			})
	// 		});
	// 	});
	// }

	// handlePutPub(detailsObject) {
	// 	return apiFetch('/api/pubs', {
	// 		method: 'PUT',
	// 		body: JSON.stringify({
	// 			...detailsObject,
	// 			pubId: this.props.pubData.id,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then((result)=> {
	// 		this.props.setPubData({
	// 			...this.props.pubData,
	// 			...result
	// 		});
	// 	})
	// 	.catch(()=> {
	// 		// this.setState({ putPubIsLoading: false });
	// 	});
	// }

	render() {
		const pubData = this.props.pubData;
		// const managers = this.props.pubData.collaborators.filter((item)=> {
		// 	return item.Collaborator.permissions === 'manage';
		// });
		const managers = pubData.managers;
		// const numManagers = managers.length;
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
								<Checkbox
									checked={this.props.pubData.isCommunityAdminManaged}
									onChange={(evt)=> {
										this.handlePubUpdate({
											isCommunityAdminManaged: evt.target.checked,
										});
									}}
								>
									Can Manage
								</Checkbox>
							</div>
						</div>
						{managers.sort((foo, bar)=> {
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
													this.handleRemoveManager(manager.id);
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
								onSelect={this.handleAddManager}
								allowCustomUser={false} // Eventually use this for emails
								placeholder="Add manager..."
								usedUserIds={managers.map((item)=> {
									return item.user.id;
								})}
							/>
						</div>
					</div>

					<h2>Permissions</h2>

					<div
						className={`version-block draft ${this.state.activePermissionsVersion === 'draft' ? 'active' : ''}`}
						onClick={()=> { this.setState({ activePermissionsVersion: 'draft' }); }}
						role="button"
						tabIndex="-1"
					>
						<div className="header">
							<div className="title"><b>Working Draft</b></div>
							<div className="privacy">
								{this.state.activePermissionsVersion === 'draft' &&
									<PubOptionsDropdownPrivacy
										value={this.props.pubData.draftPermissions}
										isDraft={true}
										onChange={(newValue)=> {
											this.handlePubUpdate({ draftPermissions: newValue });
										}}
									/>
								}
								{this.state.activePermissionsVersion !== 'draft' &&
									<span>{this.props.pubData.draftPermissions.replace('public', 'Public ').replace('private', 'Private')}</span>
								}
							</div>
						</div>
						{this.state.activePermissionsVersion === 'draft' &&
							<div>
								<div>Permissions</div>
								<div className="manager pt-elevation-1">
									<div className="name">
										Community Admins
									</div>
									<div className="options">
										<PubOptionsDropdownPermissions
											value={this.props.pubData.communityAdminDraftPermissions}
											onChange={(newValue)=> {
												this.handlePubUpdate({
													communityAdminDraftPermissions: newValue,
												});
											}}
										/>
									</div>
								</div>
								{this.props.pubData.versionPermissions.filter((versionPermission)=> {
									return !versionPermission.versionId;
								}).sort((foo, bar)=> {
									if (foo.createdAt < bar.createdAt) { return -1; }
									if (foo.createdAt > bar.createdAt) { return 1; }
									return 0;
								}).map((versionPermission)=> {
									return (
										<div className="manager pt-elevation-1">
											<div className="name">
												<Avatar width={35} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />
												{versionPermission.user.fullName}
											</div>
											<div className="options">
												<PubOptionsDropdownPermissions
													value={versionPermission.permissions}
													hideNone={true}
													onChange={(newValue)=> {
														this.handleVersionPermissionUpdate({
															versionPermissionId: versionPermission.id,
															permissions: newValue,
														});
													}}
												/>
												<button
													className="pt-button pt-minimal"
													type="button"
													onClick={()=> {
														this.handleVersionPermissionDelete(versionPermission.id);
													}}
												>
													Remove
												</button>
											</div>
										</div>
									);
								})}
								<div className="manager pt-elevation-1 add">
									<UserAutocomplete
										onSelect={(user)=> {
											return this.handleVersionPermissionAdd({
												userId: user.id,
												versionId: null,
											});
										}}
										allowCustomUser={false} // Eventually use this for emails
										placeholder="Add person to draft..."
										usedUserIds={this.props.pubData.versionPermissions.filter((versionPermission)=> {
											return !versionPermission.versionId;
										}).map((item)=> {
											return item.user.id;
										})}
									/>
								</div>

								<div>Sharing Links</div>
								<a href="">Anyone with this link can view (Click to copy)</a>
								<a href="">Anyone with this link can edit (Click to copy)</a>
							</div>
						}
					</div>
					{pubData.versions.sort((foo, bar)=> {
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((version)=> {
						const isActive = this.state.activePermissionsVersion === version.id;
						return (
							<div
								className={`version-block ${isActive ? 'active' : ''}`}
								onClick={()=> { this.setState({ activePermissionsVersion: version.id }); }}
								role="button"
								tabIndex="-1"
							>
								<div className="header">
									<div className="title">
										<b>{dateFormat(version.createdAt, 'mmm dd, yyyy · h:MMTT')}</b>
										<span>{version.description}</span>
									</div>
									<div className="privacy">
										{isActive &&
											<PubOptionsDropdownPrivacy
												value={version.isPublic ? 'publicView' : 'private'}
												isDraft={false}
												onChange={(newValue)=> {
													this.handleVersionUpdate({
														versionId: version.id,
														isPublic: newValue === 'public'
													});
												}}
											/>
										}
										{!isActive &&
											<span>{version.isPublic ? 'Public' : 'Private'}</span>
										}
									</div>
								</div>
								{isActive &&
									<div>
										<div>Permissions</div>
										<div className="manager pt-elevation-1">
											<div className="name">
												Community Admins
											</div>
											<div className="options">
												<Checkbox
													checked={version.isCommunityAdminShared}
													onChange={(evt)=> {
														this.handleVersionUpdate({
															versionId: version.id,
															isCommunityAdminShared: evt.target.checked,
														});
													}}
												>
													Can View
												</Checkbox>
											</div>
										</div>
										{this.props.pubData.versionPermissions.filter((versionPermission)=> {
											return versionPermission.versionId === version.id;
										}).sort((foo, bar)=> {
											if (foo.createdAt < bar.createdAt) { return -1; }
											if (foo.createdAt > bar.createdAt) { return 1; }
											return 0;
										}).map((versionPermission)=> {
											return (
												<div className="manager pt-elevation-1">
													<div className="name">
														<Avatar width={35} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />
														{versionPermission.user.fullName}
													</div>
													<div className="options">
														<button
															className="pt-button pt-minimal"
															type="button"
															onClick={()=> {
																this.handleVersionPermissionDelete(versionPermission.id);
															}}
														>
															Remove
														</button>
													</div>
												</div>
											);
										})}
										<div className="manager pt-elevation-1 add">
											<UserAutocomplete
												onSelect={(user)=> {
													return this.handleVersionPermissionAdd({
														userId: user.id,
														versionId: version.id,
													});
												}}
												allowCustomUser={false} // Eventually use this for emails
												placeholder="Add person to this version..."
												usedUserIds={this.props.pubData.versionPermissions.filter((versionPermission)=> {
													return !versionPermission.versionId;
												}).map((item)=> {
													return item.user.id;
												})}
											/>
										</div>

										<div>Sharing Links</div>
										<a href="">Anyone with this link can view (Click to copy)</a>
									</div>
								}
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
