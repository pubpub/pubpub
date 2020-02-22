import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@blueprintjs/core';
import Icon from 'components/Icon/Icon';
import NavBuilderRow from './NavBuilderRow';

const propTypes = {
	id: PropTypes.string.isRequired,
	items: PropTypes.array,
	removeItem: PropTypes.func.isRequired,
	updateItem: PropTypes.func.isRequired,
	pages: PropTypes.array.isRequired,
	newLink: PropTypes.object.isRequired,
};

const defaultProps = {
	items: [],
};

const NavBuilderList = (props) => {
	const { id, items, updateItem, pages, newLink, removeItem } = props;

	return (
		<Droppable droppableId={id} type={id}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					className={snapshot.isDraggingOver ? 'dragging' : ''}
					{...provided.droppableProps}
				>
					{items.map((item, index) => {
						const itemId = typeof item === 'string' ? item : item.id;
						return (
							<Draggable
								key={`draggable-${itemId}`}
								draggableId={itemId}
								index={index}
								type={id}
							>
								{(providedItem, snapshotItem) => (
									<div
										ref={providedItem.innerRef}
										className={
											snapshotItem.isDragging
												? 'dragging nav-builder-row'
												: 'nav-builder-row'
										}
										{...providedItem.draggableProps}
									>
										<span {...providedItem.dragHandleProps}>
											<Icon icon="drag-handle-horizontal" />
										</span>
										<Button
											icon="small-cross"
											minimal
											small
											onClick={() => {
												removeItem(itemId, id);
											}}
										/>
										<NavBuilderRow
											dropdownId={id}
											index={index}
											item={item}
											removeItem={removeItem}
											updateItem={updateItem}
											pages={pages}
											newLink={newLink}
											NavBuilderList={NavBuilderList}
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
	);
};

NavBuilderList.propTypes = propTypes;
NavBuilderList.defaultProps = defaultProps;
export default NavBuilderList;
