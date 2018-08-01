import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Position, Spinner, Tag, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import { apiFetch } from 'utilities';

require('./pubOptionsTags.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
	canManage: PropTypes.bool.isRequired,
};


class PubOptionsTags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/* We store pubTags in state of this component so we can do immediate */
			/* updates and save in the background without jumpy effects */
			pubTags: this.props.pubData.pubTags,
			isLoading: false,
			queryValue: '',
			filteredTags: [],
		};
		this.inputRef = undefined;
		this.getFilteredTags = this.getFilteredTags.bind(this);
		this.handlePubTagAdd = this.handlePubTagAdd.bind(this);
		this.handlePubTagDelete = this.handlePubTagDelete.bind(this);
	}


	getFilteredTags(query, existingPubTags) {
		if (!query) {
			this.setState({ queryValue: query });
			return [];
		}
		if (query !== this.state.queryValue) {
			this.setState({ queryValue: query });
			const existingTagIds = existingPubTags.map((pubTag)=> {
				return pubTag.tag.id;
			});
			const defaultTags = this.props.communityData.tags;
			const addNewTagOption = defaultTags.reduce((prev, curr)=> {
				console.log(curr, query);
				if (curr.title.toLowerCase() === query.toLowerCase()) { return false; }
				return prev;
			}, true);
			const newTagOption = query && addNewTagOption ? [{ title: query }] : [];
			console.log('newTagOption', newTagOption);
			console.log('existingTagIds', existingTagIds);
			const allTags = [...newTagOption, ...defaultTags];
			const output = allTags.filter((item)=> {
				const fuzzyMatchTag = fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
				const alreadyUsed = existingTagIds.indexOf(item.id) > -1;
				return !alreadyUsed && fuzzyMatchTag;
			}).sort((foo, bar)=> {
				if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
				if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
				return 0;
			});
			this.setState({ filteredTags: output });
			return output;
		}
		return this.state.filteredTags;
	}

	handlePubTagAdd(tag) {
		this.inputRef.focus();
		return apiFetch('/api/pubTags', {
			method: 'POST',
			body: JSON.stringify({
				title: tag.title,
				tagId: tag.id,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			const newPubTags = [...this.state.pubTags, result];

			this.setState({
				pubTags: newPubTags
			});
			this.props.setPubData({
				...this.props.pubData,
				pubTags: newPubTags
			});
		});
	}


	handlePubTagDelete(pubTagId) {
		const newPubTags = this.state.pubTags.filter((pubTag)=> {
			return pubTag.id !== pubTagId;
		});
		this.setState({ pubTags: newPubTags, isLoading: true });
		return apiFetch('/api/pubTags', {
			method: 'DELETE',
			body: JSON.stringify({
				pubTagId: pubTagId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				pubTags: newPubTags
			});
			this.setState({ isLoading: false });
		});
	}

	render() {
		const pubTags = this.state.pubTags;
		return (
			<div className="pub-options-tags-component">
				{this.state.isLoading &&
					<div className="save-wrapper">
						<Spinner small={true} /> Saving...
					</div>
				}
				<h1>Tags</h1>
				<Suggest
					items={pubTags}
					inputProps={{
						placeholder: 'Add Tag...',
						className: 'pt-large',
						inputRef: (ref)=> { this.inputRef = ref; },
					}}
					itemListPredicate={this.getFilteredTags}
					inputValueRenderer={()=> { return ''; }}
					itemRenderer={(item, { handleClick, modifiers })=> {
						return (
							<li key={item.id || 'empty-user-create'}>
								<button
									type="button"
									tabIndex={-1}
									onClick={handleClick}
									className={modifiers.active ? 'pt-menu-item pt-active' : 'pt-menu-item'}
								>
									{!item.id && <span>Create new tag: </span>}
									<span className="autocomplete-name">{item.title}</span>
								</button>
							</li>
						);
					}}
					closeOnSelect={true}
					onItemSelect={this.handlePubTagAdd}
					noResults={<MenuItem disabled text="No results" />}
					popoverProps={{
						isOpen: this.state.queryValue,
						popoverClassName: 'pt-minimal user-autocomplete-popover',
						position: Position.BOTTOM_LEFT,
						modifiers: {
							preventOverflow: { enabled: false },
							hide: { enabled: false },
						},
					}}
				/>

				{pubTags.map((pubTag)=> {
					return (
						<Tag
							key={pubTag.id}
							className="pt-minimal pt-intent-primary"
							large={true}
							onRemove={()=> {
								this.handlePubTagDelete(pubTag.id);
							}}
						>
							{pubTag.tag.title}
						</Tag>
					);
				})}
				{/*<DragDropContext onDragEnd={this.onDragEnd}>
					<div className="main-list-wrapper">
						<Droppable droppableId="mainDroppable">
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									className={`main-list ${snapshot.isDraggingOver ? 'dragging' : ''}`}
								>
									{pubData.attributions.sort((foo, bar)=> {
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
																		<span key={`${attribution.id}-handle`} {...providedItem.dragHandleProps} className="pt-icon-standard pt-icon-drag-handle-horizontal" />
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
				</DragDropContext>*/}
			</div>
		);
	}
}

PubOptionsTags.propTypes = propTypes;
export default PubOptionsTags;


// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { MultiSelect } from '@blueprintjs/select';
// import fuzzysearch from 'fuzzysearch';
// import { apiFetch } from 'utilities';

// require('./pubOptionsTags.scss');

// const propTypes = {
// 	communityData: PropTypes.object.isRequired,
// 	pubData: PropTypes.object.isRequired,
// 	setPubData: PropTypes.func.isRequired,
// };

// class PubOptionsTags extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			value: '',
// 			activePubTags: props.pubData.pubTags,
// 		};
// 		this.getFilteredItems = this.getFilteredItems.bind(this);
// 		this.handleInputChange = this.handleInputChange.bind(this);
// 		this.handleAddPubTag = this.handleAddPubTag.bind(this);
// 		this.handleRemovePubTag = this.handleRemovePubTag.bind(this);
// 		this.showSaveSuccess = this.showSaveSuccess.bind(this);
// 	}

// 	getFilteredItems(allTags, activePubTags, query) {
// 		if (!query) {
// 			// this.setState({ value: query });
// 			return [];
// 		}

// 		const usedIndexes = activePubTags.map((item)=> {
// 			return item.id;
// 		});
// 		const filteredTags = allTags.filter((item)=> {
// 			const fuzzyMatchName = fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
// 			const alreadyUsed = usedIndexes.indexOf(item.id) > -1;
// 			return !alreadyUsed && fuzzyMatchName;
// 		}).sort((foo, bar)=> {
// 			if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
// 			if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
// 			return 0;
// 		});
// 		return [{ title: query }, ...filteredTags];
// 	}

// 	handleInputChange(evt) {
// 		const query = evt.target.value;

// 		return this.setState({ value: query });
// 	}

// 	handleAddPubTag(newPubTag) {
// 		if (newPubTag.tag) {
// 			this.setState({
// 				activePubTags: [...this.state.activePubTags, newPubTag],
// 				value: '',
// 			});
// 		}

// 		const addTagObject = {
// 			pubId: this.props.pubData.id,
// 			tagId: newTag.id,
// 			title: newTag.title,
// 		};

// 		apiFetch('/api/pubTags', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				...addTagObject,
// 				communityId: this.props.communityData.id,
// 			})
// 		})
// 		.then((result)=> {
// 			if (!newTag.id) {
// 				this.setState({
// 					activePubTags: [...this.state.activePubTags, result],
// 					value: '',
// 				});
// 			}
// 			this.props.setPubData({
// 				...this.props.pubData,
// 				tags: [
// 					...this.props.pubData.tags,
// 					result,
// 				]
// 			});
// 			this.showSaveSuccess();
// 		});
// 	}

// 	handleRemovePubTag(evt, index) {
// 		if (this.state.activePubTags.length === 1) { return null; }
// 		const removedTag = this.state.activePubTags[index];
// 		this.setState({
// 			activePubTags: this.state.activePubTags.filter((item, filterIndex)=> {
// 				return filterIndex !== index;
// 			})
// 		});

// 		const removeTagObject = {
// 			pubId: this.props.pubData.id,
// 			pubTagId: removedTag.id,
// 		};

// 		return apiFetch('/api/pubTags', {
// 			method: 'DELETE',
// 			body: JSON.stringify({
// 				...removeTagObject,
// 				communityId: this.props.communityData.id,
// 			})
// 		})
// 		.then((result)=> {
// 			this.props.setPubData({
// 				...this.props.pubData,
// 				tags: this.props.pubData.tags.filter((item)=> {
// 					return item.id !== result;
// 				})
// 			});
// 			this.showSaveSuccess();
// 		});
// 	}

// 	showSaveSuccess() {
// 		this.setState({ saveSuccess: true });
// 		setTimeout(()=> {
// 			this.setState({ saveSuccess: false });
// 		}, 2500);
// 	}

// 	render() {
// 		return (
// 			<div className="pub-options-tags-component">
// 				<div className="save-wrapper">
// 					<div className={`save-success-message ${this.state.saveSuccess && !this.state.hasUpdated ? 'active' : ''}`}>
// 						<span className="pt-icon-standard pt-icon-tick-circle" /> Saved
// 					</div>
// 				</div>
// 				<h1>Tags</h1>

// 				<div className="details">
// 					Use the below input to apply tags to this pub.
// 				</div>

// 				<div className="multiselect-wrapper">
// 					<MultiSelect
// 						items={this.getFilteredItems(this.props.communityData.tags, this.state.activePubTags, this.state.value)}
// 						itemRenderer={(item, { handleClick, modifiers })=> {
// 							return (
// 								<li key={item.id}>
// 									<button type="button" tabIndex={-1} onClick={handleClick} className={modifiers.active ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
// 										{!item.id && <span>Create and Add new Tag: </span>}
// 										{/*!item.isPublic &&
// 											<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
// 										*/}
// 										{item.title}
// 									</button>
// 								</li>
// 							);
// 						}}
// 						selectedItems={this.state.activePubTags}
// 						tagRenderer={(item)=> {
// 							return (
// 								<span>
// 									{/*!item.isPublic &&
// 										<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
// 									*/}
// 									{item.title}
// 								</span>
// 							);
// 						}}
// 						tagInputProps={{
// 							className: 'pt-large',
// 							onRemove: this.handleRemovePubTag,
// 							tagProps: {
// 								className: 'pt-minimal pt-intent-primary'
// 							},
// 							inputProps: {
// 								onChange: this.handleInputChange,
// 								placeholder: 'Apply Tag to pub...',
// 							}
// 						}}
// 						resetOnSelect={true}
// 						onItemSelect={this.handleAddPubTag}
// 						noResults={<div className="pt-menu-item">No Matching Tags</div>}
// 						popoverProps={{ popoverClassName: 'pt-minimal pub-options-pages-overlay' }}
// 					/>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// PubOptionsTags.propTypes = propTypes;
// export default PubOptionsTags;
