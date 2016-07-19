import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard, SelectValue, SelectOption} from 'components';
import dateFormat from 'dateformat';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileAdmins = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleAddAdmin: PropTypes.func,
		handleDeleteAdmin: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: {},
		};
	},
	
	componentWillReceiveProps(nextProps) {
		const currentSubmitted = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const nextSubmitted = safeGetInToJS(nextProps.atomData, ['submittedData']) || [];
		if (currentSubmitted.length !== nextSubmitted.length) {
			this.setState({value: {}});
		}
	},

	handleSelectChange: function(value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteUsers?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
					label: item.name,
					image: item.image,
					id: item._id,
				};
			});
			callback(null, { options: options });
		});
	},

	addAdmin: function() {
		if (!this.state.value.id) { return undefined; }
		this.props.handleAddAdmin(this.state.value.id);
	},

	deleteAdmin: function(adminID) {
		if (!adminID) { return undefined; }
		this.props.handleAddAdmin(adminID);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const submittedData = safeGetInToJS(this.props.jrnlData, ['submittedData']) || [];
		const metaData = {
			title: 'Admins · ' + jrnlData.jrnlName,
		};

		return (
			<div>
				<Helmet {...metaData} />				

				<Select.Async
					name="form-field-name"
					autoload={false}
					value={this.state.value}
					loadOptions={this.loadOptions}
					placeholder={<span>Add new admins</span>}
					onChange={this.handleSelectChange} 
					optionComponent={SelectOption}
					valueComponent={SelectValue}/>

				<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.id) && styles.submitButtonActive]} onClick={this.addAdmin}>Add Admin</div>
					
				<h3>Admins</h3>
			</div>
		);
	}
});

export default Radium(JrnlProfileAdmins);

styles = {
	submitButton: {
		fontSize: '0.9em',
		margin: '1em 0em',
		pointerEvents: 'none',
		opacity: 0.5,
	},
	submitButtonActive: {
		pointerEvents: 'auto',
		opacity: 1,
	},
};
