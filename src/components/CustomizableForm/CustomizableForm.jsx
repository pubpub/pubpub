import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles;

export const CustomizableForm = React.createClass({
	propTypes: {
		formData: PropTypes.object,
		onUpdate: PropTypes.func,
		// formWidth: PropTypes.number,
	},

	getInitialState() {
		return {
			addField: '',
		};
	},

	onChange: function(evt) {
		const key = evt.target.id;
		const newFormData = {
			...this.props.formData,
			[key]: {
				title: this.props.formData[key].title, 
				value: evt.target.value
			}
		};
		this.props.onUpdate(newFormData);
	},

	addFieldChange: function(evt) {
		this.setState({addField: evt.target.value});
	},

	addField: function(evt) {
		evt.preventDefault();
		if (!this.state.addField) { return; }

		const title = this.state.addField;
		const key = title.toLowerCase().replace(' ', '');

		const newFormData = {
			...this.props.formData,
			[key]: { 
				title: title,  
				value: undefined 
			}
		};
		this.props.onUpdate(newFormData);
		this.setState({addField: ''});
	},

	removeField: function(key) {
		const newFormData = this.props.formData;
		delete newFormData[key];
		this.props.onUpdate(newFormData);
	},	

	render: function() {
		return (
			<div style={styles.container}>
				
				{Object.keys(this.props.formData || {}).map((key, index)=>{
					return (
						<div key={key + '-input'}>
							<label htmlFor={key}>
								{this.props.formData[key].title}
							</label>
							<input id={key} name={this.props.formData[key].title} type="text" style={styles.input} value={this.props.formData[key].value || ''} onChange={this.onChange}/>
							<div className={'underlineOnHover'} onClick={this.removeField.bind(this, key)} style={styles.removeButton}>Remove</div>
						</div>
					);
				})}

				<form onSubmit={this.addField} style={styles.addFieldForm}>
					<input type="text" style={[styles.input, styles.addFieldInput]} value={this.state.addField} onChange={this.addFieldChange}/> 
					<div className={'button'} onClick={this.addField} style={styles.addFieldButton}>Add Field</div>
				</form>
				
			</div>
		);
	}
});

export default Radium(CustomizableForm);

styles = {
	container: {
		width: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	removeButton: {
		cursor: 'pointer',
		display: 'inline-block',
		position: 'relative',
		top: '-1.5em',
		fontSize: '0.8em',
		color: '#808284',
	},
	addFieldForm: {
		marginBottom: '1.2em',
		display: 'table',
	},
	addFieldInput: {
		display: 'table-cell',
		marginBottom: '0em',
		width: 'calc(100% - 20px - 2px)',
		borderRight: '0px solid black',
	},
	addFieldButton: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
	},


};
