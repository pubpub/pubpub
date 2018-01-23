import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

require('./pubCollabShare.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	canManage: PropTypes.bool,
	onOpenCollaborators: PropTypes.func,
	onOpenShare: PropTypes.func,
	onCollaboratorAdd: PropTypes.func,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	onPutPub: PropTypes.func,
	collaboratorsOnly: PropTypes.bool,
	mode: PropTypes.string,
	// isLoading: PropTypes.bool,
};

const defaultProps = {
	canManage: false,
	onOpenCollaborators: ()=>{},
	onOpenShare: ()=>{},
	onCollaboratorAdd: ()=>{},
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	onPutPub: ()=>{},
	collaboratorsOnly: false,
	mode: undefined,
	// isLoading: false,
};

class PubCollabShare extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collaborationMode: this.props.pubData.collaborationMode,
			adminPermissions: this.props.pubData.adminPermissions,
			collaborators: this.props.pubData.collaborators.filter((item)=> {
				return this.props.canManage || item.Collaborator.isAuthor || item.Collaborator.isContributor;
			}).sort((foo, bar)=> {
				if (!this.props.canManage && foo.Collaborator.isAuthor && !bar.Collaborator.isAuthor) { return -1; }
				if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
				if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
				if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
				if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
				return 0;
			}),
		};
		this.handleUserSelect = this.handleUserSelect.bind(this);
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
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

		this.props.onCollaboratorUpdate({
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
		this.props.onCollaboratorAdd({
			userId: user.id,
			name: user.name,
			order: calculateOrder,
			pubId: this.props.pubData.id,
		});
	}
	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		this.props.onPutPub({
			collaborationMode: value,
		});
	}

	render() {
		const pubData = this.props.pubData;
		const numPubAdmins = this.props.pubData.collaborators.reduce((prev, curr)=> {
			if (curr.Collaborator.permissions === 'manage') { return prev + 1; }
			return prev;
		}, 0);
		return (
			<div className="pub-collab-share-component">
				{!this.props.collaboratorsOnly &&
					<div>
						<h5>Sharing Links</h5>
						<div className="wrapper">
							<div className="share-link">
								<div className="input-name">
									Anyone with this link <b>Can Edit</b>
								</div>
								<input className="pt-input" type="text" value={`${window.location.origin}/pub/${pubData.slug}/collaborate?access=${pubData.editHash}`} onChange={()=>{}} />
							</div>
							<div className="share-link">
								<div className="input-name">
									Anyone with this link <b>Can View</b>
								</div>
								<input className="pt-input" type="text" value={`${window.location.origin}/pub/${pubData.slug}/collaborate?access=${pubData.viewHash}`} onChange={()=>{}} />
							</div>
						</div>

						<div className="wrapper">
							<h5>Working Draft Privacy</h5>
							<PubCollabDropdownPrivacy
								value={this.state.collaborationMode}
								onChange={this.handleCollaborationModeChange}
							/>
						</div>

						<div className="wrapper">
							<h5>Community Admin Permissions</h5>
							<PubAdminPermissions
								communityData={this.props.communityData}
								onSave={this.props.onPutPub}
								pubData={pubData}
							/>
						</div>

					</div>
				}

				{this.props.collaboratorsOnly && this.props.canManage &&
					<div style={{ float: 'right', marginBottom: '2em' }}>
						<button onClick={this.props.onOpenShare} className="pt-button pt-minimal">Show all sharing options</button>
					</div>
				}

				<div>
					{!this.props.mode &&
						<h5> Collaborators</h5>
					}
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
											{this.state.collaborators.map((item)=> {
												return (
													<Draggable key={`draggable-${item.id}`} draggableId={item.id}>
														{(providedItem, snapshotItem) => (
															<div>
																<div
																	ref={providedItem.innerRef}
																	className={`draggable-item ${snapshotItem.isDragging ? 'dragging' : ''}`}
																	style={providedItem.draggableStyle}
																>
																	<PubCollaboratorDetails
																		key={`details-${item.id}`}
																		pubId={this.props.pubData.id}
																		handle={<span {...providedItem.dragHandleProps} className="pt-icon-standard pt-icon-drag-handle-horizontal" />}
																		canManage={this.props.canManage}
																		lastAdmin={item.Collaborator.permissions === 'manage' && numPubAdmins === 1}
																		collaboratorData={item}
																		onCollaboratorUpdate={this.props.onCollaboratorUpdate}
																		onCollaboratorDelete={this.props.onCollaboratorDelete}
																		// isPermissionsMode={true}
																	/>
																</div>
																{providedItem.placeholder}
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

			</div>
		);
	}
}

PubCollabShare.propTypes = propTypes;
PubCollabShare.defaultProps = defaultProps;
export default PubCollabShare;
