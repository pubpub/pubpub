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
			value: null,
		};
	},
	
	componentWillReceiveProps(nextProps) {
		const currentAdmins = safeGetInToJS(this.props.jrnlData, ['adminsData']) || [];
		const nextAdmins = safeGetInToJS(nextProps.jrnlData, ['adminsData']) || [];
		if (currentAdmins.length !== nextAdmins.length) {
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
					slug: item.username,
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
		this.props.handleDeleteAdmin(adminID);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const adminsData = safeGetInToJS(this.props.jrnlData, ['adminsData']) || [];
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
				{
					adminsData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						const buttons = [ 
							{ type: 'button', text: 'Delete Admin', action: this.deleteAdmin.bind(this, item.source._id) },
						];
						return (
							<PreviewCard 
								key={'featured-' + index}
								type={'user'}
								image={item.source.image}
								title={item.source.name}
								slug={item.source.username}
								description={item.source.bio} 
								buttons={buttons} />
						);
					})
				}
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
