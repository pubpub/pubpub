import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, NonIdealState } from 'components/Blueprint';
import { CirclePicker } from 'react-color';
import { postPubLabel, deletePubLabel } from './actionsPubLabels';
import { postLabel, putLabel, deleteLabel } from './actionsLabels'; 

let styles;

export const PubLabelList = React.createClass({
	propTypes: {
		allLabels: PropTypes.array,
		selectedLabels: PropTypes.array,
		onChange: PropTypes.func,
		pubId: PropTypes.number, // id of the pub the label is applied to
		rootPubId: PropTypes.number, // id of the pub owning the labels
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
				return label.id === labelItem.id ? false : true;
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
		this.setState({
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

	render() {
		const allLabels = this.props.allLabels || [];
		
		// const selectedLabels = this.state.selectedLabels || this.props.selectedLabels || [];
		const selectedLabels = this.state.selectedLabels || [];
		const selectedLabelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});
		const selectedLabelsRender = allLabels.filter((label)=> {
			return selectedLabelIds.includes(label.id);
		});

		return (
			<div style={styles.container}>
				
				<Popover 
					content={
						<div style={{padding: '.25em'}}>
							{allLabels.map((label, index)=> {
								if (this.state.editingLabelId === label.id) {
									return (
										<div style={{padding: '1em 0.5em', margin: '1em 0em',}} className={'pt-card pt-elevation-2'} key={'publabeledit- ' + label.id}>
											<div>
												<span style={{backgroundColor: this.state.editingColor}}></span>
											</div>
											<input type="text" className={'pt-input'} value={this.state.editingTitle} onChange={this.updateEditTitle} style={{width: '100%'}}/>
											<div style={{ margin: '1em 0em' }}>
												<CirclePicker color={this.state.editingColor} onChange={this.setEditColor} colors={['#c0392b', '#e74c3c', '#d35400', '#f39c12', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50']} />
											</div>
											
											<div className="pt-button-group pt-fill">
												<button className="pt-button pt-minimal pt-icon-trash" onClick={this.deleteEdit}/>
												<button className="pt-button" onClick={this.cancelEdit}>Cancel</button>
												<button className="pt-button pt-intent-primary" onClick={this.saveEdit}>Save Label</button>
											</div>
										</div>
									);
								}
								return (
									<div className="pt-button-group pt-fill pt-minimal" key={'publabel- ' + label.id}>
										<button className="pt-button pt-fill" style={{textAlign: 'left'}} onClick={this.selectLabel.bind(this, label)}>
											<span style={[styles.labelColor, { backgroundColor: label.color }]} className={selectedLabelIds.includes(label.id) ? 'pt-icon-standard pt-icon-small-tick' : ''}/> {label.title}
										</button>
										<button className="pt-button pt-icon-edit" onClick={this.editClick.bind(this, label)} />
									</div>
								);
							})}
							<hr style={{ margin: '1em 0em .25em' }}/>
							{this.state.createOpen &&
								<div style={{padding: '1em 0.5em', margin: '1em 0em',}} className={'pt-card pt-elevation-2'}>
									<div>
										<span style={{backgroundColor: this.state.creatingColor}}></span>
									</div>
									<input type="text" className={'pt-input'} value={this.state.creatingTitle} onChange={this.updateCreateTitle} style={{width: '100%'}}/>
									<div style={{ margin: '1em 0em' }}>
										<CirclePicker color={this.state.creatingColor} onChange={this.setCreateColor} colors={['#c0392b', '#e74c3c', '#d35400', '#f39c12', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50']} />
									</div>
									
									<div className="pt-button-group pt-fill">
										<button className="pt-button" onClick={this.toggleCreate}>Cancel</button>
										<button className={this.state.creatingTitle ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.saveCreate}>Create Label</button>
									</div>
								</div>
							}
							{!this.state.createOpen &&
								<button type="button" className="pt-button pt-fill pt-minimal" onClick={this.toggleCreate}>
									Create New Label
								</button>
							}
							
						</div>
					}
					interactionKind={PopoverInteractionKind.CLICK}
					position={Position.BOTTOM_LEFT}
					transitionDuration={200}
				>
					<span className="pt-tag" style={styles.editLabelsButton}>
						Labels <span className="pt-icon-standard pt-icon-small-plus" style={{ color: '#888' }}/>
					</span>	
					
				</Popover>

				{selectedLabelsRender.map((label, index)=> {
					return <span key={'label-' + index} className="pt-tag" style={{ backgroundColor: label.color || '#CCC', marginLeft: '.5em' }}>{label.title}</span>;
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
	editLabelsButton: {
		backgroundColor: 'transparent',
		boxShadow: 'inset 0px 0px 0px 1px #BBB',
		color: '#888',
		cursor: 'pointer',
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
};
