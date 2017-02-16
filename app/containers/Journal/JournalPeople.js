import React, { PropTypes } from 'react';
import Radium from 'radium';
import ReactMarkdown from 'react-markdown';
import AutocompleteBar from 'components/AutocompleteBar/AutocompleteBar';
import PreviewUser from 'components/PreviewUser/PreviewUser';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postJournalAdmin, deleteJournalAdmin } from './actionsAdmins';
import { NonIdealState, Button } from '@blueprintjs/core';
import { putJournal } from './actions';
import Textarea from 'react-textarea-autosize';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalPeople = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newAdmin: null,
		};
	},

	componentWillReceiveProps(nextProps) {
		const prevJournal = this.props.journal || {};
		const nextJournal = nextProps.journal || {};
		const prevAdmins = prevJournal.admins || [];
		const nextAdmins = nextJournal.admins || [];

		if (prevAdmins.length < nextAdmins.length) {
			this.setState({ newAdmin: null });
		}
	},

	loadOptions: function(input, callback) {
		if (input.length < 3) {
			callback(null, { options: null });
		}
		request.get('/api/search/user?q=' + input).end((err, response)=>{
			const responseArray = (response && response.body) || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.username,
					label: item.firstName + ' ' + item.lastName,
					slug: item.username,
					image: item.image,
					id: item.id,
				};
			});
			callback(null, { options: options });
		});
	},
	
	handleSelectChange: function(value) {
		this.setState({ newAdmin: value });
	},

	addAdmin: function() {
		this.props.dispatch(postJournalAdmin(this.props.journal.id, this.state.newAdmin.id));
	},

	deleteAdmin: function(journalAdminId) {
		this.props.dispatch(deleteJournalAdmin(this.props.journal.id, journalAdminId));
	},


	render() {
		const journal = this.props.journal || {};
		const admins = journal.admins || [];

		return (
			<div style={styles.container}>

				<h2><FormattedMessage {...globalMessages.Admins} /></h2>
				{journal.isAdmin &&
					<p>Admins are displayed publicly and can feature pubs, organize pages, and add admins.</p>
				}
				
				{journal.isAdmin &&
					<AutocompleteBar
						filterOptions={(options)=>{
							return options.filter((option)=>{
								for (let index = 0; index < admins.length; index++) {
									if (admins[index].userId === option.id) {
										return false;
									}
								}
								return true;
							});
						}}
						placeholder={'Find New Admin'}
						loadOptions={this.loadOptions}
						value={this.state.newAdmin}
						onChange={this.handleSelectChange}
						onComplete={this.addAdmin}
						completeDisabled={!this.state.newAdmin || !this.state.newAdmin.id}
						completeString={'Add'}
					/>	
				}

				{admins.map((admin)=> {
					const user = admin.user || {};
					return (
						<PreviewUser 
							key={'admin-' + admin.id}
							user={user} 
							details={<span>Added: {dateFormat(admin.createdAt, 'mmmm dd, yyyy')}</span>}
							rightContent={journal.isAdmin ? <button type="button" className="pt-button pt-intent-danger pt-minimal" style={{ whiteSpace: 'nowrap' }} onClick={this.deleteAdmin.bind(this, admin.id)}>Remove Admin</button> : null} />
					);
				})}
			</div>
		);
	}
});

export default Radium(JournalPeople);

styles = {
	container: {
		
	},
	aboutContent: {
		margin: '2em 0em',
	},
	outLink: {
		paddingRight: '2em',
	},
	loaderContainer: {
		float: 'left',
		position: 'relative',
		left: '-5px',
		top: '-5px',
	},
};
