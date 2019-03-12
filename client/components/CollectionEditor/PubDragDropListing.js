/**
 * Manages a drag-and-droppable listing of pubs using react-beautiful-dnd.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const DND_TYPE = 'collection-editor-entry';

const propTypes = {
	className: PropTypes.string.isRequired,
	droppableId: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
	itemId: PropTypes.func.isRequired,
	renderEmptyState: PropTypes.func,
	renderItem: PropTypes.func.isRequired,
	withDragHandles: PropTypes.bool,
};

const defaultProps = {
	renderEmptyState: () => null,
	withDragHandles: false,
};

const PubDragDropListing = (props) => {
	const {
		className,
		droppableId,
		items,
		itemId,
		renderItem,
		renderEmptyState,
		withDragHandles,
	} = props;
	return (
		<Droppable type={DND_TYPE} droppableId={droppableId}>
			{(droppableProvided) => (
				<div
					{...droppableProvided.droppableProps}
					className={className}
					ref={droppableProvided.innerRef}
				>
					{renderEmptyState && items.length === 0 && (
						<div className="empty-state-container">{renderEmptyState()}</div>
					)}
					{items.map((item, index) => {
						const id = itemId(item);
						return (
							<Draggable draggableId={id} index={index} type={DND_TYPE} key={id}>
								{(draggableProvided, snapshot) => {
									const {
										innerRef,
										draggableProps,
										dragHandleProps,
									} = draggableProvided;
									const { isDragging } = snapshot;
									const effectiveDragHandleProps = withDragHandles
										? {}
										: dragHandleProps;
									return (
										<div
											className={classNames(
												'drag-container',
												isDragging && 'is-dragging',
											)}
											ref={innerRef}
											{...draggableProps}
											{...effectiveDragHandleProps}
										>
											{renderItem(
												item,
												isDragging,
												withDragHandles && dragHandleProps,
											)}
										</div>
									);
								}}
							</Draggable>
						);
					})}
				</div>
			)}
		</Droppable>
	);
};

PubDragDropListing.propTypes = propTypes;
PubDragDropListing.defaultProps = defaultProps;

export default PubDragDropListing;
