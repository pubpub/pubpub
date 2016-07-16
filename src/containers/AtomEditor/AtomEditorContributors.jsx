import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

let styles;

const optionRendererComponent = (props) => (<div>{props.option.title}</div>);

export const AtomEditorContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		handleJournalSubmit: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: [],
		};
	},

	handleSelectChange: function(value) {
		this.setState({ value });
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

	removeUser: function(user) {
		console.log(user);
	},

	render: function() {
		const contributorData = safeGetInToJS(this.props.atomEditData, ['contributorData']) || [];

/*
image: PropTypes.string,
title: PropTypes.string,
description: PropTypes.string,
slug: PropTypes.string,
// onFollowHandler: PropTypes.func,
// showEdit: PropTypes.bool,
buttons: PropTypes.array,
header: PropTypes.object,
footer: PropTypes.object,
*/

	const authorOptions = [
		{value: 'author', label: 'author'},
		{value: 'editor', label: 'editor'},
		{value: 'contributor', label: 'contributor'},
	];

		return (
			<div>
				<h2>Contributors</h2>
				{contributorData.map((user, index)=>{
					const buttons = [
						(<Select name="form-field-name" clearable={false} value="author" options={authorOptions} />),
						{text: 'Remove', action: this.removeUser.bind(this, user)}
					];
					return (<PreviewCard type="atom" buttons={buttons} image={user.source.image} title={user.source.name} description={user.source.bio} />);
				})}

				<h3>Add Users</h3>

				<Select.Async
					name="form-field-name"
					value={this.state.value}
					loadOptions={this.loadOptions}
					multi={true}
					optionRenderer={(option) => (<span><img style={{height: '1em'}} src={option.image}/>{option.value}</span>)}
					placeholder={<span>Choose an author as a person to upload.</span>}
					onChange={this.handleSelectChange} />

				<Select name="form-field-name" clearable={false} value="author" options={authorOptions} />
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
