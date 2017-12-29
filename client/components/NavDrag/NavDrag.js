import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CollectionAutocomplete from './CollectionAutocomplete';

require('./navDrag.scss');

const propTypes = {
	initialNav: PropTypes.array.isRequired,
	collections: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

class NavDrag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nav: props.initialNav.slice(1, props.initialNav.length),
		};
		this.cleanOutputNav = this.cleanOutputNav.bind(this);
		this.reorder = this.reorder.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	onDragEnd(result) {
		if (!result.destination) { return null; }
		const items = result.destination.droppableId === 'mainDroppable'
			? this.reorder(
				this.state.nav,
				result.source.index,
				result.destination.index
			)
			: this.state.nav.map((item)=> {
				if (item.id === result.destination.droppableId) {
					return {
						...item,
						children: this.reorder(
							item.children,
							result.source.index,
							result.destination.index
						)
					};
				}
				return item;
			});

		this.setState({
			nav: items,
		});
		return this.props.onChange([
			this.props.initialNav[0].id,
			...this.cleanOutputNav(items)
		]);
	}

	cleanOutputNav(populatedNav) {
		return populatedNav.map((item)=> {
			if (!item.children) {
				return item.id;
			}
			return {
				id: item.id,
				title: item.title,
				children: item.children.map((child)=> {
					return child.id;
				})
			};
		});
	}

	reorder(list, startIndex, endIndex) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	}
	addItem(newItem, dropdownId) {
		if (!dropdownId) {
			return this.setState({
				nav: [newItem, ...this.state.nav]
			});
		}
		const newItems = this.state.nav.map((item)=> {
			if (item.id === dropdownId) {
				return {
					...item,
					children: [newItem, ...item.children]
				};
			}
			return item;
		});
		this.setState({ nav: newItems });
		return this.props.onChange([
			this.props.initialNav[0].id,
			...this.cleanOutputNav(newItems)
		]);
	}
	removeItem(itemId, dropdownId) {
		const newItems = !dropdownId
			? this.state.nav.filter((item)=> {
				return item.id !== itemId;
			})
			: this.state.nav.map((item)=> {
				if (item.id === dropdownId) {
					return {
						...item,
						children: item.children.filter((subItem)=> {
							return subItem.id !== itemId;
						})
					};
				}
				return item;
			});
		this.setState({ nav: newItems });
		return this.props.onChange([
			this.props.initialNav[0].id,
			...this.cleanOutputNav(newItems)
		]);
	}
	render() {
		return (
			<div className="nav-drag-component">
				<div className="new-collection-wrapper">
					<CollectionAutocomplete
						collections={this.props.collections}
						usedItems={this.state.nav}
						onSelect={(newItem)=>{ this.addItem(newItem, undefined); }}
						allowCustom={true}
					/>
				</div>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className="main-list-wrapper">
						<Droppable droppableId="mainDroppable" type="PRIMARY-NAV" direction="horizontal">
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									className={`main-list ${snapshot.isDraggingOver ? 'dragging' : ''}`}
								>
									<div className="nav-item-background accent-background" />
									<div className="nav-item accent-color">Home</div>
									{this.state.nav.map((item)=> {
										return (
											<Draggable key={`draggable-${item.id}`} draggableId={item.id} type="PRIMARY-NAV">
												{(providedItem, snapshotItem) => (
													<div>
														<div
															ref={providedItem.innerRef}
															className={`nav-item accent-color ${snapshotItem.isDragging ? 'dragging' : ''}`}
															style={providedItem.draggableStyle}
														>
															<span {...providedItem.dragHandleProps} className="dragger-horiz">
																<span className="pt-icon-standard pt-icon-drag-handle-vertical" />
																{!item.children && !item.isPublic &&
																	<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
																}
																{item.title}
																{item.children &&
																	<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
																}
															</span>
															<button onClick={()=>{ this.removeItem(item.id); }} className="pt-button pt-icon-small-cross pt-minimal" />

															{item.children &&
																<div className="dropdown-wrapper pt-card pt-elevation-2">
																	<CollectionAutocomplete
																		collections={this.props.collections}
																		usedItems={item.children}
																		placeholder="Add..."
																		onSelect={(newItem)=>{ this.addItem(newItem, item.id); }}
																	/>
																	<Droppable droppableId={item.id} type={item.id}>
																		{(providedSub, snapshotSub) => (
																			<div
																				ref={providedSub.innerRef}
																				className={`sub-list ${snapshotSub.isDraggingOver ? 'dragging' : ''}`}
																			>
																				{item.children.map((child)=> {
																					return (
																						<Draggable key={`subitem-${item.id}-${child.id}`} draggableId={child.id} type={item.id}>
																							{(providedItemSub, snapshotItemSub) => (
																								<div>
																									<div
																										ref={providedItemSub.innerRef}
																										className={`sub-nav-item ${snapshotItemSub.isDragging ? 'dragging' : ''}`}
																										style={providedItemSub.draggableStyle}
																									>
																										<span {...providedItemSub.dragHandleProps} className="dragger-vert">
																											<span className="pt-icon-standard pt-icon-drag-handle-horizontal" />
																											{!child.children && !child.isPublic &&
																												<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
																											}
																											{child.title}
																										</span>
																										<button onClick={()=>{ this.removeItem(child.id, item.id); }} className="pt-button pt-minimal pt-icon-small-cross" />
																									</div>
																									{providedItemSub.placeholder}
																								</div>
																							)}
																						</Draggable>
																					);
																				})}
																				{providedSub.placeholder}
																			</div>
																		)}
																	</Droppable>
																</div>
															}
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
		);
	}
}

NavDrag.propTypes = propTypes;
export default NavDrag;
