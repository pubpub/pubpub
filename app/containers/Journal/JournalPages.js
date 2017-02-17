import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import Link from 'components/Link/Link';
import { NonIdealState, Checkbox, Button } from '@blueprintjs/core';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { postLabel, putLabel, deleteLabel } from './actionsLabels'; 
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

let styles = {};


export const JournalPages = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			editingLabelId: undefined,
			// editingTitle: '',
			// editingDescription: '',
			createOpen: false,
			creatingTitle: '',
			creatingDescription: '',
			creatingIsDisplayed: true,
		};
	},
	
	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ 
				editingLabelId: undefined,
				createOpen: false,
				creatingTitle: '',
				creatingDescription: '',
				creatingIsDisplayed: true,
			});	
		}
	},

	editClick: function(page, evt) {
		this.setState({ 
			editingLabelId: page.id,
			// editingTitle: page.title,
			// editingDescription: page.description,
		});
		
	},
	
	// updateEditTitle: function(evt) {
	// 	this.setState({ editingTitle: evt.target.value });
	// },

	// updateEditDescription: function(evt) {
	// 	this.setState({ editingDescription: evt.target.value });
	// },

	saveEdit: function() {
		// const labelUpdates = {
		// 	title: this.state.editingTitle,
		// 	description: this.state.editingDescription
		// };
		const labelUpdates = {
			title: document.getElementById('editTitle').value,
			description: document.getElementById('editDescription').value
		};
		this.props.dispatch(putLabel(this.props.journal.id, this.state.editingLabelId, labelUpdates));
		this.setState({ editingLabelId: undefined });
	},
	cancelEdit: function() {
		this.setState({ editingLabelId: undefined });
	},
	deleteEdit: function() {
		this.props.dispatch(deleteLabel(this.props.journal.id, this.state.editingLabelId));
		// this.setState({ editingLabelId: undefined });
	},

	toggleIsDisplayed: function(page, evt) {
		const labelUpdates = { isDisplayed: !page.isDisplayed };
		this.props.dispatch(putLabel(this.props.journal.id, page.id, labelUpdates));
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
		const pages = this.props.journal.pages || [];
		const sortedPages = pages.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const order = sortedPages.length ? sortedPages[0].order / 2 : 0.5;
		this.props.dispatch(postLabel(this.props.journal.id, this.state.creatingTitle, this.state.creatingDescription, this.state.creatingIsDisplayed, order));
		// return this.setState({
		// 	createOpen: false,
		// 	creatingTitle: '',
		// 	creatingDescription: '',
		// 	creatingIsDisplayed: true,
		// });
	},

	onSortEnd: function({ oldIndex, newIndex }) {
		if (oldIndex === newIndex) { return null; }
		const pages = this.props.journal.pages || [];
		const sortedPages = pages.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const page = sortedPages[oldIndex];
		const newSortedPages = arrayMove(sortedPages, oldIndex, newIndex);

		let nextOrder;
		if (newIndex === newSortedPages.length - 1) {
			nextOrder = (1 + newSortedPages[newIndex - 1].order) / 2;			
		} else if (newIndex === 0) {
			nextOrder = newSortedPages[newIndex + 1].order / 2;
		} else {
			nextOrder = (newSortedPages[newIndex + 1].order + newSortedPages[newIndex - 1].order) / 2;
		}

		return this.props.dispatch(putLabel(this.props.journal.id, page.id, { order: nextOrder }));
	},

	onDepthChange: function(pageId, depth) {
		return this.props.dispatch(putLabel(this.props.journal.id, pageId, { depth: depth }));
	},

	render: function() {
		const journal = this.props.journal || {};
		const pages = journal.pages || [];
		const sortedPages = pages.sort((foo, bar)=> {
			if (foo.order < bar.order) { return -1; }
			if (foo.order > bar.order) { return 1; }
			return 0;
		});
		const metaData = {
			title: 'Pages · ' + journal.title,
		};
		// const isLoading = this.props.isLoading;
		// const errorMessage = this.props.error;

		const DragHandle = SortableHandle(() => <span style={styles.dragHandle} className={'pt-icon-standard pt-icon-drag-handle-vertical pt-icon-large'} />); // This can be any component you want

		const SortableItem = SortableElement(({ value })=> {
			const page = value || {};
			const isEditing = this.state.editingLabelId === page.id;
			return (
				<div style={styles.pageWrapper(page.depth)}>
					{journal.isAdmin &&
						<div style={styles.smallTableCell}>
							<DragHandle />
						</div>
					}
					{!isEditing &&
						<div style={styles.tableCell}>
							<Link style={styles.pageTitle} to={'/' + journal.slug + '/page/' + page.slug} customDomain={journal.customDomain}>{page.title}</Link>
							{/* <div style={styles.pageDescription}>{page.description}</div >*/}
						</div>
					}
					
					{!isEditing && journal.isAdmin &&
						<div style={styles.smallTableCell}>
							<div className={'pt-button-gorup'}>
								<button onClick={this.onDepthChange.bind(this, page.id, page.depth - 1)} disabled={page.depth === 0}} className={'pt-button pt-icon-caret-left'} />
								<button onClick={this.onDepthChange.bind(this, page.id, page.depth + 1)} disabled={page.depth + 1 > value.addDepth} className={'pt-button pt-icon-caret-right'} />
							</div>
						</div>
						
					}

					{!isEditing && journal.isAdmin &&
						<div style={styles.smallTableCell}>
							<button className="pt-button pt-icon-edit" style={{ marginBottom: '0.5em' }} onClick={this.editClick.bind(this, page)}>Edit</button>	
							<Checkbox checked={page.isDisplayed} label={'Display in Header'} onChange={this.toggleIsDisplayed.bind(this, page)} />
						</div>
						
					}

					{isEditing &&
						<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'} key={'publabeledit- ' + page.id}>
							<label key={'thinger' + page.id}>
								Title
								{/* <input type="text" className={'pt-input'} value={this.state.editingTitle} onChange={this.updateEditTitle} style={styles.labelEditInput} /> */}
								<input type="text" className={'pt-input'} id={'editTitle'} defaultValue={page.title} style={styles.labelEditInput} />
							</label>
							{/* <label>
								Description
								<textarea type="text" className={'pt-input'} id={'editDescription'} defaultValue={page.description} style={styles.labelEditInput} />
							</label> */}
							
							<div className="pt-button-group" style={styles.labelEditActions}>
								<Button loading={this.props.isLoading} className="pt-button pt-minimal pt-icon-trash" onClick={this.deleteEdit} />
								<button className="pt-button" onClick={this.cancelEdit}>Cancel</button>
								<button className="pt-button pt-intent-primary" onClick={this.saveEdit.bind(this, page)}>Save Page</button>
							</div>
						</div>
					}

				</div>
			);
		});

		const SortableList = SortableContainer(({ items }) => {
			return (
				<div>
					{items.map((value, index, array) => {
						const renderValue = {
							...value,
							minusDepth: Math.max(0, value.depth - 1),
							addDepth: index === 0 ? 0 : Math.min(value.depth + 1, array[index - 1].depth + 1)
						};
						return <SortableItem key={`item-${index}`} index={index} value={renderValue} />;
					})}
				</div>
			);
		});
		return (
			<div>
				<Helmet {...metaData} />
				{!!sortedPages.length &&
					<h2>Pages</h2>
				}

				{!this.state.createOpen && !!sortedPages.length && journal.isAdmin &&
					<div style={{ textAlign: 'right' }}>
						<button className={'pt-button pt-intent-primary'} onClick={this.toggleCreate}>Create New Page</button>
					</div>
				}

				{this.state.createOpen &&
					<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'}>
						<label>
							Title
							<input type="text" className={'pt-input'} value={this.state.creatingTitle} onChange={this.updateCreateTitle} placeholder={'Page Name'} style={styles.labelEditInput} />
						</label>
						{/* <label>
							Description
							<textarea type="text" className={'pt-input'} value={this.state.creatingDescription} onChange={this.updateCreateDescription} placeholder={'Page Description'} style={styles.labelEditInput} />
						</label> */}
						
						<Checkbox checked={this.state.creatingIsDisplayed} label={'Display in Header'} onChange={this.updateCreateIsDisplayed} />

						<div className="pt-button-group" style={styles.labelEditActions}>
							<button className="pt-button" onClick={this.toggleCreate}>Cancel</button>
							<Button loading={this.props.isLoading} className={this.state.creatingTitle ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.saveCreate} text={'Create Page'} />
						</div>
					</div>
				}

				{!this.state.createOpen && !sortedPages.length &&
					<NonIdealState
						action={journal.isAdmin ? <button className={'pt-button pt-intent-primary'} onClick={this.toggleCreate}>Create New Page</button> : undefined}
						description={journal.isAdmin ? 'Pages can be used to group featured pubs together.' : ''}
						title={'No Pages'}
						visual={'application'} />
				}
				<SortableList items={sortedPages} onSortEnd={this.onSortEnd} useDragHandle={true} lockAxis={'y'} />

			</div>
		);
	}

});

export default Radium(JournalPages);

styles = {
	pageWrapper: function(depth) {
		return {
			margin: `1em 0em 1em ${depth * 2}em`,
			borderTop: '1px solid #DDD',
			display: 'table',
			maxWidth: '100%',
			paddingTop: '1em',
		};
		
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
	pageTitle: {
		display: 'block',
		fontWeight: 'bold',
		fontSize: '1.2em',
	},
	pageDescription: {
		padding: '0.5em 0em',
	},
	labelEditInput: {
		width: '100%',
		marginBottom: '1em',
	},
	
};
