import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard, SelectValue, SelectOption} from 'components';

let styles;

const optionRendererComponent = (props) => (<div>{props.option.title}</div>);

export const AtomEditorContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		handleJournalSubmit: PropTypes.func,
	},

	getInitialState: function() {
		return {
			addUser: null,
			addRole: 'author',
		};
	},

	handleSelectChange: function(value) {
		console.log('got change');
		console.log(value);
		this.setState({ addUser: value });
	},


	handleRoleChange: function(value) {
		console.log('got role');
		console.log(value);
		this.setState({ addRole: value.value });
	},




	loadOptions: function(input, callback) {
		request.get('/api/autocompleteUsers?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					image: item.image,
					value: item.name,
					label: item.name,
					id: item._id,
				};
			});
			callback(null, { options: options });
		});
	},

	submitToJournals: function() {
		const journalIDs = this.state.value.map((item)=>{
			return item.id;
		});
		this.props.handleJournalSubmit(journalIDs);
	},

	modifyUser: function(user, oldRole, newRole){
		const collaboratorAction = {type: 'modify', userId: user, fromRole: oldRole, toRole: newRole.value};
		this.props.updateAtomContributorsHandler([collaboratorAction]);
	},

	removeUser: function(user, role) {
		const collaboratorAction = {type: 'remove', userId: user._id, fromRole: role};
		this.props.updateAtomContributorsHandler([collaboratorAction]);
	},

	submitUser: function() {
		const collaboratorAction = {type: 'new', userId: this.state.addUser.id, toRole: this.state.addRole};
		this.props.updateAtomContributorsHandler([collaboratorAction]);
	},

	render: function() {
		const contributorData = safeGetInToJS(this.props.atomEditData, ['contributorData']) || [];

	const authorOptions = [
		{value: 'author', label: 'author'},
		{value: 'editor', label: 'editor'},
		{value: 'contributor', label: 'contributor'},
	];

	console.log(contributorData);
		return (
			<div>
				<h2>Contributors</h2>
				{contributorData.map((link, index)=>{
					const buttons = [
						(<Select
						name="form-field-name"
						onChange={this.modifyUser.bind(this, link.source, link.type)}
						clearable={false}
						value={link.type}
						options={authorOptions} />),
						{text: 'Remove', action: this.removeUser.bind(this, link.source, link.type)}
					];
					return (<PreviewCard type="atom" buttons={buttons} image={link.source.image} title={link.source.name} description={link.source.bio} />);
				})}

				<h3>Add Users</h3>

				<Select.Async
					name="form-field-name"
					autoload={false}
					value={this.state.addUser}
					loadOptions={this.loadOptions}
					multi={false}
					placeholder={<span>Choose an author as a person to upload.</span>}
					onChange={this.handleSelectChange}
					optionComponent={SelectOption}
					valueComponent={SelectValue}
					 />

				 <Select name="form-field-name" ref="addRole" clearable={false} value={this.state.addRole} options={authorOptions} onChange={this.handleRoleChange} />

				 <div className={'button'} onClick={this.submitUser}>Save</div>

			</div>
		);

	}
});

export default Radium(AtomEditorContributors);

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
