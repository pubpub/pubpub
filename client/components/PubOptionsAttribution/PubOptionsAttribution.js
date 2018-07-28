import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
		this.state = {
			collaborationMode: this.props.pubData.collaborationMode,
			adminPermissions: this.props.pubData.adminPermissions,
			attributions: this.props.pubData.attributions.sort((foo, bar)=> {
				if (foo.order < bar.order) { return -1; }
				if (foo.order > bar.order) { return 1; }
				if (foo.createdAt < bar.createdAt) { return 1; }
				if (foo.createdAt > bar.createdAt) { return -1; }
				return 0;
			}),
		};
		this.handleUserSelect = this.handleUserSelect.bind(this);
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.handleCollaboratorAdd = this.handleCollaboratorAdd.bind(this);
		this.handleCollaboratorUpdate = this.handleCollaboratorUpdate.bind(this);
		this.handleCollaboratorDelete = this.handleCollaboratorDelete.bind(this);
		this.handlePutPub = this.handlePutPub.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.pubData.collaborators.length !== this.props.pubData.collaborators.length) {
			this.setState({
				collaborators: nextProps.pubData.collaborators.sort((foo, bar)=> {
					if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
					if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
					if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
					if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
					return 0;
				})
			});
		}
	}

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
		// const numPubAdmins = this.props.pubData.attributions.reduce((prev, curr)=> {
		// 	if (curr.Collaborator.permissions === 'manage') { return prev + 1; }
		// 	return prev;
		// }, 0);
		return (
			<div className="pub-options-attribution-component">
				<h1>Attribution</h1>

				{this.props.canManage &&
					<UserAutocomplete
						onSelect={this.handleUserSelect}
						allowCustomUser={true}
						placeholder="Add new Collaborator..."
						usedUserIds={this.state.attributions.map((item)=> {
							return item.user.id;
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
										{this.state.attributions.map((item, index)=> {
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
																// lastAdmin={item.Collaborator.permissions === 'manage' && numPubAdmins === 1}
																lastAdmin={false}
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

			</div>
		);
	}
}

PubOptionsAttribution.propTypes = propTypes;
// PubOptionsAttribution.defaultProps = defaultProps;
export default PubOptionsAttribution;
