import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Position } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import Avatar from 'components/Avatar/Avatar';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { apiFetch } from 'utilities';

require('./pubOptionsAttribution.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
	canManage: PropTypes.bool.isRequired,

	

	// onOpenCollaborators: PropTypes.func,
	// onOpenShare: PropTypes.func,
	// onCollaboratorAdd: PropTypes.func,
	// onCollaboratorUpdate: PropTypes.func,
	// onCollaboratorDelete: PropTypes.func,
	// onPutPub: PropTypes.func,
	// collaboratorsOnly: PropTypes.bool,
	// mode: PropTypes.string,
	// isLoading: PropTypes.bool,
};

// const defaultProps = {
// 	// canManage: false,
// 	// onOpenCollaborators: ()=>{},
// 	// onOpenShare: ()=>{},
// 	onCollaboratorAdd: ()=>{},
// 	onCollaboratorUpdate: ()=>{},
// 	onCollaboratorDelete: ()=>{},
// 	onPutPub: ()=>{},
// 	// collaboratorsOnly: false,
// 	// mode: undefined,
// 	// isLoading: false,
// };

class PubOptionsAttribution extends Component {
	constructor(props) {
		super(props);
		// this.state = {
		// 	collaborationMode: this.props.pubData.collaborationMode,
		// 	adminPermissions: this.props.pubData.adminPermissions,
		// 	attributions: this.props.pubData.attributions.sort((foo, bar)=> {
		// 		if (foo.order < bar.order) { return -1; }
		// 		if (foo.order > bar.order) { return 1; }
		// 		if (foo.createdAt < bar.createdAt) { return 1; }
		// 		if (foo.createdAt > bar.createdAt) { return -1; }
		// 		return 0;
		// 	}),
		// };
		this.getFilteredRoles = this.getFilteredRoles.bind(this);
		this.handleAttributionAdd = this.handleAttributionAdd.bind(this);
		this.handleAttributionUpdate = this.handleAttributionUpdate.bind(this);
		this.handleAttributionDelete = this.handleAttributionDelete.bind(this);
		// this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);

		// this.handleCollaboratorAdd = this.handleCollaboratorAdd.bind(this);
		// this.handleCollaboratorUpdate = this.handleCollaboratorUpdate.bind(this);
		// this.handleCollaboratorDelete = this.handleCollaboratorDelete.bind(this);
		// this.handlePu/tPub = this.handlePutPub.bind(this);
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
		const sourceId = this.props.pubData.attributions[sourceIndex].id;
		const destIndex = result.destination.index;
		const destinationOrder = this.props.pubData.attributions[destIndex].order;
		const direction = sourceIndex > destIndex ? -1 : 1;
		let newOrder = 0.5;
		if (sourceIndex === destIndex) {
			newOrder = this.props.pubData.attributions[sourceIndex].order;
		} else if (result.destination.index === 0) {
			newOrder = destinationOrder / 2;
		} else if (result.destination.index === this.props.pubData.attributions.length - 1) {
			newOrder = (1 + destinationOrder) / 2;
		} else {
			const destinationNeighborOrder = this.props.pubData.attributions[destIndex + direction].order;
			newOrder = (destinationOrder + destinationNeighborOrder) / 2;
		}

		const newCollaborators = this.props.pubData.attributions;
		newCollaborators[sourceIndex].order = newOrder;

		this.handleAttributionUpdate({
			pubAttributionId: sourceId,
			order: newOrder,
			pubId: this.props.pubData.id,
			communityId: this.props.communityData.id,
		});

		return this.props.setPubData({
			...this.props.pubData,
			attributions: this.props.pubData.attributions.map((attribution)=> {
				if (attribution.id !== sourceId) {
					return attribution;
				}
				return {
					...attribution,
					order: newOrder,
				};
			})
		});
		// return this.setState({
		// 	collaborators: newCollaborators.sort((foo, bar)=> {
		// 		if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
		// 		if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
		// 		if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
		// 		if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
		// 		return 0;
		// 	})
		// });
	}

	getFilteredRoles(query, existingRoles) {
		const defaultRoles = [
			'Conceptualization',
			'Methodology',
			'Software',
			'Validation',
			'Formal Analysis',
			'Investigation',
			'Resources',
			'Data Curation',
			'Writing – Original Draft Preparation',
			'Writing – Review & Editing',
			'Visualization',
			'Supervision',
			'Project Administration',
			'Peer Review',
			'Funding Acquisition',
			'Illustrator'
		];
		const addNewRoleOption = defaultRoles.reduce((prev, curr)=> {
			if (curr.toLowerCase() === query.toLowerCase()) { return false; }
			return prev;
		}, true);
		const newRoleOption = query && addNewRoleOption ? [query] : [];
		const allRoles = [...newRoleOption, ...defaultRoles];
		const output = allRoles.filter((item)=> {
			const fuzzyMatchRole = fuzzysearch(query.toLowerCase(), item.toLowerCase());
			const alreadyUsed = existingRoles.indexOf(item) > -1;
			return !alreadyUsed && fuzzyMatchRole;
		}).sort((foo, bar)=> {
			if (foo.toLowerCase() < bar.toLowerCase()) { return -1; }
			if (foo.toLowerCase() > bar.toLowerCase()) { return 1; }
			return 0;
		});
		return output;
	}

	handleAttributionAdd(user) {
		const calculatedOrder = this.props.pubData.attributions.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			if (foo.createdAt > bar.createdAt) { return -1; }
			return 0;
		})[0].order / 2;

		return apiFetch('/api/pubAttributions', {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				name: user.name,
				order: calculatedOrder,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				attributions: [
					...this.props.pubData.attributions,
					result,
				]
			});
		});
	}

	handleAttributionUpdate(updatedAttribution) {
		return apiFetch('/api/pubAttributions', {
			method: 'PUT',
			body: JSON.stringify({
				...updatedAttribution,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				attributions: this.props.pubData.attributions.map((attribution)=> {
					if (attribution.id !== updatedAttribution.pubAttributionId) {
						return attribution;
					}
					return {
						...attribution,
						...updatedAttribution,
					};
				})
			});
		});
	}

	handleAttributionDelete(pubAttributionId) {
		return apiFetch('/api/pubAttributions', {
			method: 'DELETE',
			body: JSON.stringify({
				pubAttributionId: pubAttributionId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				attributions: this.props.pubData.attributions.filter((attribution)=> {
					return attribution.id !== pubAttributionId;
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
		// const pubData = this.props.pubData;
		// const numPubAdmins = this.props.pubData.attributions.reduce((prev, curr)=> {
		// 	if (curr.Collaborator.permissions === 'manage') { return prev + 1; }
		// 	return prev;
		// }, 0);
		return (
			<div className="pub-options-attribution-component">
				<h1>Attribution</h1>

				<UserAutocomplete
					onSelect={this.handleAttributionAdd}
					allowCustomUser={true}
					placeholder="Add new person..."
					usedUserIds={this.props.pubData.attributions.map((item)=> {
						return item.user.id;
					})}
				/>

				<div className="collaborators-wrapper">
					<DragDropContext onDragEnd={this.onDragEnd}>
						<div className="main-list-wrapper">
							<Droppable droppableId="mainDroppable">
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										className={`main-list ${snapshot.isDraggingOver ? 'dragging' : ''}`}
									>
										{this.props.pubData.attributions.sort((foo, bar)=> {
											if (foo.order < bar.order) { return -1; }
											if (foo.order > bar.order) { return 1; }
											return 0;
										}).map((attribution, index)=> {
											return (
												<Draggable key={`draggable-${attribution.id}`} draggableId={attribution.id} index={index}>
													{(providedItem, snapshotItem) => (
														<div
															ref={providedItem.innerRef}
															className={`draggable-item ${snapshotItem.isDragging ? 'dragging' : ''}`}
															{...providedItem.draggableProps}
														>
															<div className="attribution-wrapper">
																<div className="avatar-wrapper">
																	<Avatar width={50} userInitials={attribution.user.initials} userAvatar={attribution.user.avatar} />
																</div>
																<div className="content">
																	<div className="top-content">
																		<div className="name">
																			<span>{attribution.user.fullName}</span>
																			<span {...providedItem.dragHandleProps} className="pt-icon-standard pt-icon-drag-handle-horizontal" />
																		</div>
																		<button
																			className="pt-button pt-minimal"
																			type="button"
																			onClick={()=> {
																				this.handleAttributionDelete(attribution.id);
																			}}
																		>
																			<span className="pt-icon-standard pt-icon-small-cross" />
																		</button>
																	</div>
																	<div className="bottom-content">
																		<Checkbox
																			checked={attribution.isAuthor}
																			onChange={(evt)=> {
																				this.handleAttributionUpdate({
																					pubAttributionId: attribution.id,
																					isAuthor: evt.target.checked,
																				});
																			}}
																		>
																			List as Author
																		</Checkbox>
																		<MultiSelect
																			// items={this.getFilteredRoles(this.state.roleQueryValue, attribution.roles)}
																			items={attribution.roles || []}
																			itemListPredicate={this.getFilteredRoles}
																			itemRenderer={(item, { handleClick, modifiers })=> {
																				return (
																					<li key={item}>
																						<a role="button" tabIndex={-1} onClick={handleClick} className={modifiers.active ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
																							{item}
																						</a>
																					</li>
																				);
																			}}
																			selectedItems={attribution.roles || []}
																			tagRenderer={(item)=> {
																				return (
																					<span>
																						{item}
																					</span>
																				);
																			}}
																			tagInputProps={{
																				// className: 'pt-large',
																				onRemove: (evt, roleIndex)=> {
																					const newRoles = attribution.roles.filter((item, filterIndex)=> {
																						return filterIndex !== roleIndex;
																					});
																					this.handleAttributionUpdate({
																						pubAttributionId: attribution.id,
																						roles: newRoles,
																					});
																				},
																				placeholder: 'Add roles...',
																				tagProps: {
																					className: 'pt-minimal pt-intent-primary'
																				},
																				inputProps: {
																					// onChange: this.handleInputChange,
																					placeholder: 'Add roles...',
																				},
																			}}
																			// itemListPredicate={this.handleInputChange}
																			resetOnSelect={true}
																			onItemSelect={(newRole)=> {
																				const existingRoles = attribution.roles || [];
																				const newRoles = [...existingRoles, newRole];
																				// this.setState({
																				// 	roles: newRoles,
																				// 	roleQueryValue: '',
																				// });
																				this.handleAttributionUpdate({
																					pubAttributionId: attribution.id,
																					roles: newRoles,
																				});
																			}}
																			noResults={<div className="pt-menu-item">No Matching Roles</div>}
																			popoverProps={{
																				popoverClassName: 'pt-minimal',
																				position: Position.BOTTOM_LEFT,
																				modifiers: {
																					preventOverflow: { enabled: false },
																					hide: { enabled: false },
																				},
																			}}
																		/>
																	</div>
																</div>
															</div>
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

			</div>
		);
	}
}

PubOptionsAttribution.propTypes = propTypes;
// PubOptionsAttribution.defaultProps = defaultProps;
export default PubOptionsAttribution;
