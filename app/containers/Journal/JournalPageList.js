import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
// import { Link as UnwrappedLink } from 'react-router';
// const Link = Radium(UnwrappedLink);
import Link from 'components/Link/Link';
import { postPubLabel, deletePubLabel } from './actionsPubLabels';
import { postLabel, putLabel, deleteLabel } from './actionsLabels'; 

let styles;

export const JournalPageList = React.createClass({
	propTypes: {
		allLabels: PropTypes.array,
		selectedLabels: PropTypes.array,
		pubId: PropTypes.number, // id of the pub the label is applied to
		journal: PropTypes.object,
		canEdit: PropTypes.bool,
		canSelect: PropTypes.bool,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			selectedLabels: [],
			editingLabelId: undefined,
			editingTitle: '',
			createOpen: false,
			creatingTitle: '',
		};
	},

	componentWillMount() {
		this.setState({ selectedLabels: this.props.selectedLabels });
	},

	selectLabel: function(label) {
		const selectedLabels = this.state.selectedLabels || [];
		const labelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});

		const newSelected = labelIds.includes(label.id)
			? selectedLabels.filter((labelItem)=> {
				return label.id !== labelItem.id;
			})
			: [...selectedLabels, label];
		
		this.setState({ selectedLabels: newSelected });

		// If we have dispatch and a pubId, save the result
		if (this.props.pubId && this.props.dispatch) {
			const action = labelIds.includes(label.id) ? deletePubLabel : postPubLabel;
			this.props.dispatch(action(this.props.pubId, label.id, this.props.journal.id));
		}
		
	},

	editClick: function(label, evt) {
		this.setState({ 
			editingLabelId: label.id,
			editingTitle: label.title,
		});
	},
	
	updateEditTitle: function(evt) {
		this.setState({ editingTitle: evt.target.value });
	},

	saveEdit: function() {
		this.props.dispatch(putLabel(this.props.journal.id, this.state.editingLabelId, this.state.editingTitle));
		this.setState({ editingLabelId: undefined });
	},
	cancelEdit: function() {
		this.setState({ editingLabelId: undefined });
	},
	deleteEdit: function() {
		this.props.dispatch(deleteLabel(this.props.journal.id, this.state.editingLabelId));
		this.setState({ editingLabelId: undefined });
	},

	
	updateCreateTitle: function(evt) {
		this.setState({ creatingTitle: evt.target.value });
	},
	saveCreate: function() {
		if (!this.state.creatingTitle) { return null; }
		this.props.dispatch(postLabel(this.props.journal.id, this.state.creatingTitle));
		return this.setState({
			createOpen: false,
			creatingTitle: ''
		});
	},
	toggleCreate: function() {
		this.setState({
			createOpen: !this.state.createOpen,
			creatingTitle: ''
		});
	},


	render() {
		const journal = this.props.journal || {};
		const allLabels = this.props.allLabels || [];
		
		const selectedLabels = this.state.selectedLabels || [];
		const selectedLabelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});

		// If we're using local labels, we want to use the color/title kept in allLabels in case they've been updated.
		const selectedLabelsRender = allLabels.filter((label)=> {
			return selectedLabelIds.includes(label.id);
		});

		// Define Popover content for labels button when we are using local (i.e. journal-owned) labels
		const localLabelsContent = (
			<div style={styles.popoverContentWrapper}>

				{/* Display all possible labels that can be applied. Provide options to edit */}
				{allLabels.sort((foo, bar)=> {
					if (foo.order < bar.order) { return -1; }
					if (foo.order > bar.order) { return 1; }
					return 0;
				}).map((label, index)=> {
					if (this.state.editingLabelId === label.id) {
						return (
							<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'} key={'publabeledit- ' + label.id}>
								<input type="text" className={'pt-input'} value={this.state.editingTitle} onChange={this.updateEditTitle} style={styles.labelEditInput} />

								<div className="pt-button-group pt-fill" style={styles.labelEditActions}>
									<button className="pt-button pt-minimal pt-icon-trash" onClick={this.deleteEdit} />
									<button className="pt-button" onClick={this.cancelEdit}>Cancel</button>
									<button className="pt-button pt-intent-primary" onClick={this.saveEdit}>Save Label</button>
								</div>
							</div>
						);
					}

					return (
						<div className="pt-button-group pt-fill pt-minimal" key={'publabel- ' + label.id}>
							<button className="pt-button pt-fill" style={styles.labelButton} onClick={this.selectLabel.bind(this, label)}>
								<span style={styles.labelColor} className={selectedLabelIds.includes(label.id) ? 'pt-icon-standard pt-icon-small-tick' : ''} /> {label.title}
							</button>
							{/*this.props.canEdit &&
								<button className="pt-button pt-icon-edit" onClick={this.editClick.bind(this, label)} />
							*/}
							
						</div>
					);
				})}

				{this.props.canEdit && !!allLabels.length &&
					<hr style={styles.localLabelSeparator} />
				}

				{/* Display interface for creating a new label */}
				{this.state.createOpen &&
					<div style={styles.labelEditCard} className={allLabels.length ? 'pt-card pt-elevation-2' : ''}>
						<input type="text" className={'pt-input'} value={this.state.creatingTitle} onChange={this.updateCreateTitle} placeholder={'Page Name'} style={styles.labelEditInput} />
						
						<div className="pt-button-group pt-fill" style={styles.labelEditActions}>
							<button className="pt-button" onClick={this.toggleCreate}>Cancel</button>
							<button className={this.state.creatingTitle ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.saveCreate}>Create Page</button>
						</div>
					</div>
				}

				{/* Display button to toggle Label creator */}
				{this.props.canEdit && !this.state.createOpen &&
					<Link to={{ pathname: this.props.pathname, query: { ...this.props.query, view: 'pages' } }} customDomain={journal.customDomain} className="pt-button pt-fill pt-minimal">
						Manage Pages
					</Link>
				}
				
			</div>
		);	

		return (
			<div style={styles.container}>
				{(this.props.canSelect || this.props.canEdit) && 
					<Popover 
						content={localLabelsContent}
						interactionKind={PopoverInteractionKind.CLICK}
						position={Position.BOTTOM_LEFT}
						transitionDuration={200}
					>
						<span className="pt-tag" style={styles.editLabelsButton}>
							Pages <span className="pt-icon-standard pt-icon-small-plus" style={styles.editLabelsButtonIcon} />
						</span>	
					</Popover>
				}

				{selectedLabelsRender.map((label, index)=> {
					const toObject = { pathname: `/${this.props.journal.slug}/page/${label.slug}` };

					return <Link to={toObject} customDomain={journal.customDomain} key={'label-' + index} className="pt-tag" style={[styles.label, { backgroundColor: label.color || '#CED9E0', color: label.color ? '#FFF' : '#293742' }]}>{label.title}</Link>;
				})}
					
			</div>
		);
	},


});

export default Radium(JournalPageList);

styles = {
	container: {
		padding: '0.5em 0em',
		// textAlign: 'right',
	},
	popoverContentWrapper: {
		padding: '0.5em',
		minWidth: '150px',
	},
	label: {
		backgroundColor: '#CED9E0', 
		margin: '0em .25em .25em 0em', 
		textDecoration: 'none',
	},
	editLabelsButton: {
		backgroundColor: 'transparent',
		boxShadow: 'inset 0px 0px 0px 1px #BBB',
		color: '#888',
		cursor: 'pointer',
		margin: '0em .25em .25em 0em',
	},
	editLabelsButtonIcon: {
		color: '#888',
	},
	labelEditCard: {
		padding: '1em 0.5em', 
		margin: '1em 0em',
	},
	labelEditInput: {
		width: '100%',
		marginBottom: '1em',
	},
	labelEditActions: {
		marginTop: '1em',
	},
	labelButton: {
		textAlign: 'left',
	},
	labelColor: {
		display: 'inline-block',
		width: '16px',
		height: '1em',
		borderRadius: '2px',
		verticalAlign: 'middle',
		textAlign: 'center',
		margin: 0,
		backgroundColor: '#CED9E0', 
		color: '#293742',
	},
	localLabelSeparator: {
		margin: '1em 0em .25em',
	},
	popoverSectionHeader: {
		fontWeight: 'bold',
		margin: '0.5em 0em',
	},
	emptyState: {
		textAlign: 'center',
		margin: '1em 0em',
		opacity: '0.75',
	},
	labelSearchWrapper: {
		position: 'relative',
	},
	labelSearchInput: { 
		width: '100%', 
		paddingRight: '25px', 
	},
	labelSearchLoader: {
		position: 'absolute',
		right: 0,
		top: '5px'
	},
};
