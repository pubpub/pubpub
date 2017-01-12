import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import { Dialog, NonIdealState, Checkbox } from '@blueprintjs/core';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { postLabel, putLabel, deleteLabel } from './actionsLabels'; 
import { Loader } from 'components';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

let styles = {};


export const JournalCollections = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			editingLabelId: undefined,
			editingTitle: '',
			editingDescription: '',
			createOpen: false,
			creatingTitle: '',
			creatingDescription: '',
			creatingIsDisplayed: true,
		};
	},
	
	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ editingLabelId: undefined });	
			this.setState({ createOpen: false });	
		}
	},

	editClick: function(collection, evt) {
		this.setState({ 
			editingLabelId: collection.id,
			editingTitle: collection.title,
		});
	},
	
	updateEditTitle: function(evt) {
		this.setState({ editingTitle: evt.target.value });
	},

	updateEditDescription: function(evt) {
		this.setState({ editingDescription: evt.target.value });
	},

	saveEdit: function() {
		const labelUpdates = {
			 title: this.state.editingTitle,
			 description: this.state.editingDescription
		};
		this.props.dispatch(putLabel(this.props.journal.id, this.state.editingLabelId, labelUpdates));
		this.setState({ editingLabelId: undefined });
	},
	cancelEdit: function() {
		this.setState({ editingLabelId: undefined });
	},
	deleteEdit: function() {
		this.props.dispatch(deleteLabel(this.props.journal.id, this.state.editingLabelId));
		this.setState({ editingLabelId: undefined });
	},

	toggleIsDisplayed: function(collection, evt) {
		const labelUpdates = { isDisplayed: !collection.isDisplayed };
		this.props.dispatch(putLabel(this.props.journal.id, collection.id, labelUpdates));
	},

	toggleCreate: function() {
		this.setState({
			createOpen: !this.state.createOpen,
			creatingTitle: '',
			creatingDescription: '',
			creatingIsDisplayed: true,
		});
	},
	updateCreateTitle: function(evt) {
		this.setState({ creatingTitle: evt.target.value });
	},
	updateCreateDescription: function(evt) {
		this.setState({ creatingDescription: evt.target.value });
	},
	updateCreateIsDisplayed: function(evt) {
		this.setState({ creatingIsDisplayed: evt.target.checked });	
	},
	saveCreate: function() {
		if (!this.state.creatingTitle) { return null; }
		const collections = this.props.journal.collections || [];
		const sortedCollections = collections.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const order = sortedCollections.length ? sortedCollections[0].order / 2 : 0.5;
		this.props.dispatch(postLabel(this.props.journal.id, this.state.creatingTitle, this.state.creatingDescription, this.state.creatingIsDisplayed, order));
		return this.setState({
			createOpen: false,
			creatingTitle: '',
			creatingDescription: '',
			creatingIsDisplayed: true,
		});
	},

	onSortEnd: function({oldIndex, newIndex}) {
		const collections = this.props.journal.collections || [];
		const sortedCollections = collections.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const collection = sortedCollections[oldIndex];
		const newSortedCollections = arrayMove(sortedCollections, oldIndex, newIndex);

		let nextOrder;
		if (newIndex === newSortedCollections.length - 1) {
			nextOrder = (1 + newSortedCollections[newIndex - 1].order) / 2;			
		} else if (newIndex === 0) {
			nextOrder = newSortedCollections[newIndex + 1].order / 2;
		} else {
			nextOrder = (newSortedCollections[newIndex + 1].order + newSortedCollections[newIndex - 1].order) / 2;
		}

		this.props.dispatch(putLabel(this.props.journal.id, collection.id, { order: nextOrder }));
	},

	render: function() {
		const journal = this.props.journal || {};
		const collections = journal.collections || [];
		const sortedCollections = collections.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const metaData = {
			title: 'Collections · ' + journal.name,
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		const DragHandle = SortableHandle(() => <span style={styles.dragHandle} className={'pt-icon-standard pt-icon-drag-handle-vertical pt-icon-large'} />); // This can be any component you want

		const SortableItem = SortableElement(({value})=> {
			const collection = value || {};
			const isEditing = this.state.editingLabelId === collection.id;
			return (
				<div style={styles.collectionWrapper}>
					<div style={styles.smallTableCell}>
						<DragHandle />
					</div>
					{!isEditing &&
						<div style={styles.tableCell}>
							<Link style={styles.collectionTitle} to={'/' + journal.slug + '/collection/' + collection.title}>{collection.title}</Link>
							<div style={styles.collectionDescription}>{collection.description}</div>
						</div>
					}
					
					{!isEditing &&
						<div style={styles.smallTableCell}>
							<button className="pt-button pt-icon-edit" style={{ marginBottom: '0.5em' }} onClick={this.editClick.bind(this, collection)}>Edit</button>	
							<Checkbox checked={collection.isDisplayed} label={'Display in Header'} onChange={this.toggleIsDisplayed.bind(this, collection)} />
						</div>
						
					}

					{isEditing &&
						<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'} key={'publabeledit- ' + collection.id}>
							<label>
								Title
								<input type="text" className={'pt-input'} value={this.state.editingTitle} onChange={this.updateEditTitle} style={styles.labelEditInput} />
							</label>
							<label>
								Description
								<textarea type="text" className={'pt-input'} value={this.state.editingDescription} onChange={this.updateEditDescription} style={styles.labelEditInput} />	
							</label>
							
							<div className="pt-button-group" style={styles.labelEditActions}>
								<button className="pt-button pt-minimal pt-icon-trash" onClick={this.deleteEdit} />
								<button className="pt-button" onClick={this.cancelEdit}>Cancel</button>
								<button className="pt-button pt-intent-primary" onClick={this.saveEdit.bind(this, collection)}>Save Label</button>
							</div>
						</div>
					}

					

				</div>
			);
		});

		const SortableList = SortableContainer(({items}) => {
			console.log(items);
			return (
				<div>
					{items.map((value, index) =>
						<SortableItem key={`item-${index}`} index={index} value={value} />
					)}
				</div>
			);
		});


		return (
			<div>
				<Helmet {...metaData} />
				{!!sortedCollections.length &&
					<h2>Collections</h2>
				}
				
				{/*
					Display collections if not logged in
					Show title, description
					Set isDisplayed
					Drag order

					Actions:
					Move over the dispatch functions needed from CollectionsList
					Move over state and edit functions. 
					Map all collections and build out their edit interfaces.
				*/}

				{!this.state.createOpen && !!sortedCollections.length &&
				<div style={{ textAlign: 'right' }}>
					<button className={'pt-button pt-intent-primary'} onClick={this.toggleCreate}>Create New Collection</button>
				</div>
				}

				{this.state.createOpen &&
					<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'}>
						<label>
							Title
							<input type="text" className={'pt-input'} value={this.state.creatingTitle} onChange={this.updateCreateTitle} placeholder={'Collection Name'} style={styles.labelEditInput} />
						</label>
						<label>
							Description
							<textarea type="text" className={'pt-input'} value={this.state.creatingDescription} onChange={this.updateCreateDescription} placeholder={'Collection Description'} style={styles.labelEditInput} />
						</label>
						
						<Checkbox checked={this.state.creatingIsDisplayed} label={'Display in Header'} onChange={this.updateCreateIsDisplayed} />

						<div className="pt-button-group" style={styles.labelEditActions}>
							<button className="pt-button" onClick={this.toggleCreate}>Cancel</button>
							<button className={this.state.creatingTitle ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.saveCreate}>Create Collection</button>
						</div>
					</div>
				}

				{!this.state.createOpen && !sortedCollections.length &&
					<NonIdealState
						action={<button className={'pt-button pt-intent-primary'} onClick={this.toggleCreate}>Create New Collection</button>}
						description={'Collections can be used to group featured pubs together.'}
						title={'No Collections'}
						visual={'application'} />
				}
				<SortableList items={sortedCollections} onSortEnd={this.onSortEnd} useDragHandle={true} lockAxis={'y'} />

			</div>
		);
	}

});

export default Radium(JournalCollections);

styles = {
	collectionWrapper: {
		margin: '1em 0em',
		borderTop: '1px solid #DDD',
		display: 'table',
		width: '100%',
		paddingTop: '1em',
	},
	smallTableCell: {
		display: 'table-cell',
		width: '1%',
		textAlign: 'right',
		whiteSpace: 'nowrap',
	},
	tableCell: {
		display: 'table-cell',
		padding: '0em 1em',
	},
	dragHandle: {
		cursor: 'move',
		padding: '.5em',
	},
	collectionTitle: {
		display: 'block',
		fontWeight: 'bold',
		fontSize: '1.2em',
	},
	collectionDescription: {
		padding: '0.5em 0em',
	},
	labelEditInput: {
		width: '100%',
		marginBottom: '1em',
	},
	
};
