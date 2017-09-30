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

		this.reorder = this.reorder.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return null;
		}
		console.log('Result', result);
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
		return this.props.onChange(items);
	}

	reorder(list, startIndex, endIndex) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	}
	addItem(newItem, dropdownId) {
		const prevNav = this.state.nav;
		if (!dropdownId) {
			this.setState({
				nav: [
					prevNav[0],
					newItem,
					...prevNav.slice(1, prevNav.length)
				]
			});
		}
	}
	removeItem(itemId) {
		this.setState({
			nav: this.state.nav.filter((item)=> {
				// if (item.children) {}
				return item.id !== itemId;
			})
		});
	}
	render() {
		// return (
		// 	<div style={{ height: 400 }}>
		// 		<SortableTree
		// 			treeData={this.state.items}
		// 			onChange={treeData => this.setState({ items: treeData })}
		// 		/>
		// 	</div>

		// );
		return (
			<div className={'nav-drag'}>
				<CollectionAutocomplete
					collections={this.props.collections}
					usedItems={this.state.nav}
					onSelect={(newItem)=>{ this.addItem(newItem, undefined); }}
					allowCustom={true}
				/>
				<div className={'item-style'}>
					Home
				</div>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="mainDroppable" type={'TOP'}>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								className={`main-list-style ${snapshot.isDraggingOver ? 'dragging' : ''}`}
							>
								{this.state.nav.map((item)=> {
									/*if (item.children) {
										return (
											<Draggable key={item.title} draggableId={item.title}>
												{(providedListItem, snapshotListItem) => (
													<div
														ref={providedListItem.innerRef}
														className={`list-item-style ${snapshotListItem.isDragging ? 'dragging' : ''}`}
														style={providedListItem.draggableStyle}
													>
														<span className={'pt-icon-standard pt-icon-drag-handle-horizontal'} {...providedListItem.dragHandleProps} />
														<h3>{item.title}</h3>
														<Droppable droppableId={item.title}>
															{(providedList, snapshotList) => (
																<div
																	ref={providedList.innerRef}
																	className={`sub-list-style ${snapshotList.isDraggingOver ? 'dragging' : ''}`}
																>
																	{item.children.map((subItem)=> {
																		return (
																			<Draggable key={subItem} draggableId={subItem}>
																				{(providedItem, snapshotItem) => (
																					<div>
																						<div
																							ref={providedItem.innerRef}
																							className={`item-style sub-item-style ${snapshotItem.isDragging ? 'dragging' : ''}`}
																							style={providedItem.draggableStyle}
																						>
																							<span className={'pt-icon-standard pt-icon-drag-handle-horizontal'} {...providedItem.dragHandleProps} />
																							{subItem}
																						</div>
																						{providedItem.placeholder}
																					</div>
																				)}
																			</Draggable>
																		);
																	})}
																</div>
															)}
														</Droppable>
														{providedListItem.placeholder}
													</div>
												)}
											</Draggable>
										);
									}*/
									return (
										<Draggable key={item.id} draggableId={item.id} type={'TOP'}>
											{(providedItem, snapshotItem) => (
												<div>
													<div
														ref={providedItem.innerRef}
														className={`item-style ${snapshotItem.isDragging ? 'dragging' : ''}`}
														style={providedItem.draggableStyle}
													>
														<span className={'pt-icon-standard pt-icon-drag-handle-horizontal'} {...providedItem.dragHandleProps} />
														
														{item.title}
														<span>{!!item.children && ' · Dropdown'}</span>
														<button onClick={()=>{ this.removeItem(item.id); }} className={'pt-button pt-icon-trash'} />
														{item.children &&
															<Droppable droppableId={item.id} type={item.id}>
																{(providedSub, snapshotSub) => (
																	<div
																		ref={providedSub.innerRef}
																		className={`main-list-style ${snapshotSub.isDraggingOver ? 'dragging' : ''}`}
																	>
																		{item.children.map((child)=> {
																			return (
																				<Draggable key={`subitem-${item.id}-${child.id}`} draggableId={child.id} type={item.id}>
																					{(providedItemSub, snapshotItemSub) => (
																						<div>
																							<div
																								ref={providedItemSub.innerRef}
																								className={`item-style ${snapshotItemSub.isDragging ? 'dragging' : ''}`}
																								style={providedItemSub.draggableStyle}
																							>
																								<span className={'pt-icon-standard pt-icon-drag-handle-horizontal'} {...providedItemSub.dragHandleProps} />
																								{child.title}
																							</div>
																							{providedItemSub.placeholder}
																						</div>
																					)}
																				</Draggable>
																			);
																		})}
																		{!item.children.length &&
																			<div>Drag dropdown items here</div>
																		}
																		{providedSub.placeholder}
																	</div>
																)}
															</Droppable>
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
				</DragDropContext>
			</div>
		);
	}
}

NavDrag.propTypes = propTypes;
export default NavDrag;
