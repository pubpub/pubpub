import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

require('./pubCollabChapters.scss');

const propTypes = {
	chaptersData: PropTypes.object.isRequired,
	onChapterAdd: PropTypes.func.isRequired,
	// onChapterTitleChange: PropTypes.func.isRequired,
	onChaptersChange: PropTypes.func.isRequired,
	onChapterSet: PropTypes.func.isRequired,
	activeChapterIndex: PropTypes.func.isRequired,
};

const defaultProps = {

};

class PubCollabChapters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editIndex: undefined,
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.handleChapterRemove = this.handleChapterRemove.bind(this);
		this.handleSetEdit = this.handleSetEdit.bind(this);
	}

	handleSetEdit(index) {
		this.setState({ editIndex: index });
	}
	handleTitleChange(evt, index) {
		const newChaptersArray = this.props.chaptersData;
		newChaptersArray[index].title = evt.target.value;
		this.props.onChaptersChange(newChaptersArray);
	}
	onDragEnd(result) {
		if (!result.destination) { return null; }
		const source = result.source.index + 1;
		const destination = result.destination.index + 1;
		const movedItem = this.props.chaptersData[source];
		const remainingItems = this.props.chaptersData.filter((item, index)=> {
			return index !== source;
		});

		const newChaptersArray = [
			...remainingItems.slice(0, destination),
			movedItem,
			...remainingItems.slice(destination)
		].map((item, index)=> {
			return {
				...item,
				order: index,
			};
		});
		return this.props.onChaptersChange(newChaptersArray);
	}
	handleChapterRemove(removeIndex) {
		const newChaptersArray = this.props.chaptersData.filter((item)=> {
			return item.order !== removeIndex;
		}).map((item, index)=> {
			return {
				...item,
				order: index,
			};
		});
		this.props.onChaptersChange(newChaptersArray);
	}

	render() {
		return (
			<div className="pub-collab-chapters-component">
				<button className="pt-button add-chapters-button" onClick={this.props.onChapterAdd}>Add Chapter</button>
				<h5>Chapters</h5>

				<div className={`chapter first ${this.props.activeChapterIndex === 0 ? 'active' : ''}`}>
					<div className="title">
						{this.state.editIndex === 0 &&
							<input
								className="pt-fill pt-input"
								value={this.props.chaptersData[0].title}
								onChange={(evt)=> { this.handleTitleChange(evt, 0); }}
							/>
						}
						{this.state.editIndex !== 0 &&
							<span className="link-title" onClick={()=> { this.props.onChapterSet(this.props.chaptersData[0].id); }}>{this.props.chaptersData[0].title}</span>
						}
					</div>
					{this.state.editIndex === 0 &&
						<button
							className="pt-button pt-minimal pt-icon-tick"
							onClick={()=> { this.handleSetEdit(undefined); }}
						/>
					}
					{this.state.editIndex !== 0 &&
						<button
							className="pt-button pt-minimal pt-icon-edit2"
							onClick={()=> { this.handleSetEdit(0); }}
						/>
					}
				</div>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="mainDroppable">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								className={`main-list ${snapshot.isDraggingOver ? 'dragging' : ''}`}
							>
								{this.props.chaptersData.map((chapter, index)=> {
									if (index === 0) { return null; }
									const isEditing = this.state.editIndex === index;
									return (
										<Draggable key={`draggable-${chapter.id}`} draggableId={chapter.id}>
											{(providedItem, snapshotItem) => (
												<div>
													<div
														ref={providedItem.innerRef}
														className={`chapter ${snapshotItem.isDragging ? 'dragging' : ''} ${this.props.activeChapterIndex === index ? 'active' : ''}`}
														style={providedItem.draggableStyle}
													>
														<span {...providedItem.dragHandleProps} className="drag">
															<span className="pt-icon-standard pt-icon-drag-handle-horizontal" />
														</span>
														<div className="title">
															{isEditing &&
																<input
																	className="pt-fill pt-input"
																	value={chapter.title}
																	onChange={(evt)=> { this.handleTitleChange(evt, index); }}
																/>
															}
															{!isEditing &&
																<span onClick={()=> { this.props.onChapterSet(chapter.id); }} className="link-title">{chapter.title}</span>
															}
														</div>
														{isEditing &&
															<button
																className="pt-button pt-minimal pt-icon-tick"
																onClick={()=> { this.handleSetEdit(undefined); }}
															/>
														}
														{!isEditing &&
															<button
																className="pt-button pt-minimal pt-icon-edit2"
																onClick={()=> { this.handleSetEdit(index); }}
															/>
														}
														<button
															className="pt-button pt-minimal pt-icon-trash pt-intent-danger"
															onClick={()=> { this.handleChapterRemove(index); }}
														/>
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
				</DragDropContext>
			</div>
		);
	}
}

PubCollabChapters.propTypes = propTypes;
PubCollabChapters.defaultProps = defaultProps;
export default PubCollabChapters;
