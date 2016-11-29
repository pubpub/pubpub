import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, NonIdealState } from 'components/Blueprint';
import { CirclePicker } from 'react-color';

let styles;

export const PubLabelList = React.createClass({
	propTypes: {
		allLabels: PropTypes.array,
		selectedLabels: PropTypes.array,
	},

	getInitialState() {
		return {
			selectedLabels: [],
			editingId: undefined,
			editingColorOpen: false,
			editingColor: undefined,
			editingTitle: undefined,
		};
	},

	selectLabel: function(label) {
		console.log('label', label);
		const selectedLabels = this.state.selectedLabels || [];
		console.log('selectedLabels', selectedLabels);
		const labelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});

		if (labelIds.includes(label.id)) {
			this.setState({
				selectedLabels: selectedLabels.filter((labelItem)=> {
					return label.id === labelItem.id ? false : true;
				})
			});
		} else {
			this.setState({
				selectedLabels: [...selectedLabels, label]
			});
		}
	},

	editClick: function(label, evt) {
		this.setState({ 
			editingId: label.id,
			editingColor: label.color,
			editingTitle: label.title,
		});
	},
	setEditColor: function(color) {
		this.setState({ editingColor: color.hex });
	},
	cancelEdit: function() {
		this.setState({ editingId: undefined });
	},

	render() {
		const allLabels = this.props.allLabels || [];
		// const selectedLabels = this.state.selectedLabels || this.props.selectedLabels || [];
		const selectedLabels = this.state.selectedLabels || [];
		const selectedLabelIds = selectedLabels.map((labelItem)=> {
			return labelItem.id;
		});
		return (
			<div style={styles.container}>
				{selectedLabels.map((label, index)=> {
					return <span key={'label-' + index} className="pt-tag" style={{ backgroundColor: label.color || '#CCC', marginRight: '.5em' }}>{label.title}</span>;
				})}

				<Popover 
					content={
						<div style={{padding: '.25em'}}>
							{allLabels.map((label, index)=> {
								if (this.state.editingId === label.id) {
									return (
										<div style={{padding: '1em 0.5em', margin: '1em 0em',}} className={'pt-card pt-elevation-2'}>
											<div>
												<span style={{backgroundColor: this.state.editingColor}}></span>
											</div>
											<input type="text" className={'pt-input'} defaultValue={label.title} style={{width: '100%'}}/>
											<div style={{ margin: '1em 0em' }}>
												<CirclePicker color={this.state.editingColor} onChange={this.setEditColor} colors={['#c0392b', '#e74c3c', '#d35400', '#f39c12', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50']} />
											</div>
											
											<div className="pt-button-group pt-fill">
												<button className="pt-button pt-minimal pt-icon-trash" />
												<button className="pt-button" onClick={this.cancelEdit}>Cancel</button>
												<button className="pt-button pt-intent-primary">Save Label</button>
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
							<button type="button" className="pt-button pt-fill pt-minimal">
								Create New Label
							</button>
						</div>
					}
					interactionKind={PopoverInteractionKind.CLICK}
					position={Position.BOTTOM_RIGHT}
					transitionDuration={200}
				>
					<span className="pt-tag" style={styles.editLabelsButton}>
						Labels <span className="pt-icon-standard pt-icon-small-plus" style={{ color: '#888' }}/>
					</span>	
					
				</Popover>
					
			</div>
		);
	},


});

export default Radium(PubLabelList);

styles = {
	container: {
		padding: '1.25em 0em',
		textAlign: 'right',
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
	},
};
