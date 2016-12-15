import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position, Spinner } from '@blueprintjs/core';
import { CirclePicker } from 'react-color';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
import request from 'superagent';
import { postPubLabel, deletePubLabel } from './actionsPubLabels';
import { postLabel, putLabel, deleteLabel } from './actionsLabels'; 

let styles;

export const PubLabelList = React.createClass({
	propTypes: {
		allLabels: PropTypes.array,
		selectedLabels: PropTypes.array,
		onChange: PropTypes.func,
		pubId: PropTypes.number, // id of the pub the label is applied to
		rootPubId: PropTypes.number, // id of the pub owning the labels, in case of discussion labels
		globalLabels: PropTypes.bool,
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
			editingColor: undefined,
			editingTitle: '',
			createOpen: false,
			creatingColor: '#c0392b',
			creatingTitle: '',
			asyncLabels: [],
			asyncLabelsCache: {},
			asyncLabelsLoading: false,
			asyncLabelsInput: '',
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
			this.props.dispatch(action(this.props.pubId, label.id));
		}

		// If onChange is supplied, call it with new labels
		if (this.props.onChange) {
			this.props.onChange(newSelected);	
		}
		
	},

	editClick: function(label, evt) {
		this.setState({ 
			editingLabelId: label.id,
			editingColor: label.color,
			editingTitle: label.title,
		});
	},
	
	setEditColor: function(color) {
		this.setState({ editingColor: color.hex });
	},
	updateEditTitle: function(evt) {
		this.setState({ editingTitle: evt.target.value });
	},

	saveEdit: function() {
		this.props.dispatch(putLabel(this.props.rootPubId, this.state.editingLabelId, this.state.editingTitle, this.state.editingColor));
		this.setState({ editingLabelId: undefined });
	},
	cancelEdit: function() {
		this.setState({ editingLabelId: undefined });
	},
	deleteEdit: function() {
		this.props.dispatch(deleteLabel(this.props.rootPubId, this.state.editingLabelId));
		this.setState({ editingLabelId: undefined });
	},

	setCreateColor: function(color) {
		this.setState({ creatingColor: color.hex });
	},
	updateCreateTitle: function(evt) {
		this.setState({ creatingTitle: evt.target.value });
	},
	saveCreate: function() {
		if (!this.state.creatingTitle) { return null; }
		this.props.dispatch(postLabel(this.props.rootPubId, this.state.creatingTitle, this.state.creatingColor));
		return this.setState({
			createOpen: false,
			creatingColor: '#c0392b',
			creatingTitle: ''
		});
	},
	toggleCreate: function() {
		this.setState({
			createOpen: !this.state.createOpen,
			creatingColor: '#c0392b',
			creatingTitle: ''
		});
	},

	loadOptions: function(evt) {
		const input = evt.target.value.trim();
		if (!input) { 
			return this.setState({
				asyncLabelsInput: evt.target.value,
			});
		}
		if (input in this.state.asyncLabelsCache) {
			return this.setState({
				asyncLabelsInput: evt.target.value,
				asyncLabels: this.state.asyncLabelsCache[input]
			});
		}

		request.get('/api/search/label?q=' + input).end((err, response)=>{
			const responseArray = (response && response.body) || [];
			this.setState({
				asyncLabelsLoading: false,
				asyncLabels: responseArray,
				asyncLabelsCache: { 
					...this.state.asyncLabelsCache,
					[input]: responseArray,
				}
			});
		});

		return this.setState({ 
			asyncLabelsLoading: true,
			asyncLabelsInput: evt.target.value
		});
		
	},

	render() {
		const allLabels = this.props.allLabels || [];
		
		const selectedLabels = this.state.selectedLabels || [];
		const selectedLabelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});

		// If we're using local labels, we want to use the color/title kept in allLabels in case they've been updated.
		const selectedLabelsRender = this.props.globalLabels
			? selectedLabels
			: allLabels.filter((label)=> {
				return selectedLabelIds.includes(label.id);
			});

		// Define Popover content for labels button when we are using local (i.e. pub-owned) labels
		const localLabelColors = ['#c0392b', '#e74c3c', '#d35400', '#f39c12', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50'];
		const localLabelsContent = (
			<div style={styles.popoverContentWrapper}>

				{/* Display all possible labels that can be applied. Provide options to edit */}
				{allLabels.map((label, index)=> {
					if (this.state.editingLabelId === label.id) {
						return (
							<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'} key={'publabeledit- ' + label.id}>
								<input type="text" className={'pt-input'} value={this.state.editingTitle} onChange={this.updateEditTitle} style={styles.labelEditInput} />
								
								<CirclePicker 
									color={this.state.editingColor} 
									onChange={this.setEditColor} 
									colors={localLabelColors} />

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
								<span style={[styles.labelColor, { backgroundColor: label.color }]} className={selectedLabelIds.includes(label.id) ? 'pt-icon-standard pt-icon-small-tick' : ''}/> {label.title}
							</button>
							{this.props.canEdit &&
								<button className="pt-button pt-icon-edit" onClick={this.editClick.bind(this, label)} />
							}
							
						</div>
					);
				})}

				{this.props.canEdit && 
					<hr style={styles.localLabelSeparator} />
				}

				{/* Display interface for creating a new label */}
				{this.state.createOpen &&
					<div style={styles.labelEditCard} className={'pt-card pt-elevation-2'}>
						<input type="text" className={'pt-input'} value={this.state.creatingTitle} onChange={this.updateCreateTitle} style={styles.labelEditInput} />
						
						<CirclePicker 
							color={this.state.creatingColor} 
							onChange={this.setCreateColor} 
							colors={localLabelColors} />
						
						<div className="pt-button-group pt-fill" style={styles.labelEditActions}>
							<button className="pt-button" onClick={this.toggleCreate}>Cancel</button>
							<button className={this.state.creatingTitle ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.saveCreate}>Create Label</button>
						</div>
					</div>
				}

			{/* Display button to toggle Label creator */}
				{this.props.canEdit && !this.state.createOpen &&
					<button type="button" className="pt-button pt-fill pt-minimal" onClick={this.toggleCreate}>
						Create New Label
					</button>
				}
				
			</div>
		);

		// Define Popover content for labels button when we are using global labels
		const globalLabelsContent = (
			<div style={styles.popoverContentWrapper}>

				{/* Search Labels Input and Results*/}
				<div style={styles.popoverSectionHeader}>
					Search Labels
				</div>

				<div style={styles.labelSearchWrapper}>
					<input style={styles.labelSearchInput} type="text" onChange={this.loadOptions} value={this.state.asyncLabelsInput}/>
					{!!this.state.asyncLabelsLoading &&
						<div style={styles.labelSearchLoader}><Spinner className={'pt-small'} /></div>
					}	
				</div>
				
				{this.state.asyncLabels.map((label, index)=> {
					return (
						<div className="pt-button-group pt-fill pt-minimal" key={'publabel- ' + label.id}>
							<button className="pt-button pt-fill" style={styles.labelButton} onClick={this.selectLabel.bind(this, label)}>
								<span style={[styles.labelColor, styles.globalLabelColor]} className={selectedLabelIds.includes(label.id) ? 'pt-icon-standard pt-icon-small-tick' : ''}/> {label.title}
							</button>
						</div>
					);
				})}
				
				{!this.state.asyncLabels.length && this.state.asyncLabelsInput && !this.state.asyncLabelsLoading && 
					<div style={styles.emptyState}>
						No labels match your search yet
					</div>
				}

				<hr />

				{/* Selected Labels */}
				<div style={styles.popoverSectionHeader}>
					Selected Labels
				</div>

				{selectedLabels.map((label, index)=> {
					return (
						<div className="pt-button-group pt-fill pt-minimal" key={'publabel- ' + label.id}>
							<button className="pt-button pt-fill" style={styles.labelButton} onClick={this.selectLabel.bind(this, label)}>
								<span style={[styles.labelColor, styles.globalLabelColor]} className={'pt-icon-standard pt-icon-small-tick'}/> {label.title}
							</button>
						</div>
					);
				})}

				{!selectedLabels.length &&
					<div style={styles.emptyState}>
						No labels added yet
					</div>
				}
				
			</div>
		);

		return (
			<div style={styles.container}>
				{(this.props.canSelect || this.props.canEdit) && 
					<Popover 
						content={this.props.globalLabels ? globalLabelsContent : localLabelsContent}
						interactionKind={PopoverInteractionKind.CLICK}
						position={Position.BOTTOM_LEFT}
						transitionDuration={200}
					>
						<span className="pt-tag" style={styles.editLabelsButton}>
							Labels <span className="pt-icon-standard pt-icon-small-plus" style={styles.editLabelsButtonIcon}/>
						</span>	
					</Popover>
				}

				{selectedLabelsRender.map((label, index)=> {
					const toObject = this.props.globalLabels
						? { pathname: '/label/' + label.title, query: {} }
						: { pathname: this.props.pathname, query: { ...this.props.query, label: label.title, path: undefined, author: undefined, sort: undefined, discussion: undefined } };

					return <Link to={toObject} key={'label-' + index} className="pt-tag" style={[styles.label, { backgroundColor: label.color || '#CED9E0', color: label.color ? '#FFF' : '#293742' }]}>{label.title}</Link>;
				})}
					
			</div>
		);
	},


});

export default Radium(PubLabelList);

styles = {
	container: {
		padding: '0.25em 0em',
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
		color: 'white',
		textAlign: 'center',
		margin: 0,
	},
	globalLabelColor: {
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
