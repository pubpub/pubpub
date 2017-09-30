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
		if (!dropdownId) {
			return this.setState({
				nav: [
					newItem,
					...this.state.nav,
				]
			});
		}
		return this.setState({
			nav: this.state.nav.map((item)=> {
				if (item.id === dropdownId) {
					return {
						...item,
						children: [
							newItem,
							...item.children
						]
					};
				}
				return item;
			})
		});
	}
	removeItem(itemId, dropdownId) {
		if (!dropdownId) {
			return this.setState({
				nav: this.state.nav.filter((item)=> {
					return item.id !== itemId;
				})
			});
		}
		return this.setState({
			nav: this.state.nav.map((item)=> {
				if (item.id === dropdownId) {
					return {
						...item,
						children: item.children.filter((item)=> {
							return item.id !== itemId;
						})
					};
				}
				return item;
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
				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="mainDroppable" type={'TOP'} direction="horizontal">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								className={`main-list-style ${snapshot.isDraggingOver ? 'dragging' : ''}`}
							>
								<div className={'item-style'}>Home</div>
								{this.state.nav.map((item)=> {
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
															<CollectionAutocomplete
																collections={this.props.collections}
																usedItems={item.children}
																placeholder={'Add Collection or Page to dropdown'}
																onSelect={(newItem)=>{ this.addItem(newItem, item.id); }}
															/>
														}
														{item.children &&
															<Droppable droppableId={item.id} type={item.id}>
																{(providedSub, snapshotSub) => (
																	<div
																		ref={providedSub.innerRef}
																		className={`sub-list-style ${snapshotSub.isDraggingOver ? 'dragging' : ''}`}
																	>
																		{item.children.map((child)=> {
																			return (
																				<Draggable key={`subitem-${item.id}-${child.id}`} draggableId={child.id} type={item.id}>
																					{(providedItemSub, snapshotItemSub) => (
																						<div>
																							<div
																								ref={providedItemSub.innerRef}
																								className={`sub-item-style ${snapshotItemSub.isDragging ? 'dragging' : ''}`}
																								style={providedItemSub.draggableStyle}
																							>
																								<span className={'pt-icon-standard pt-icon-drag-handle-horizontal'} {...providedItemSub.dragHandleProps} />
																								{child.title}
																								<button onClick={()=>{ this.removeItem(child.id, item.id); }} className={'pt-button pt-icon-trash'} />
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
