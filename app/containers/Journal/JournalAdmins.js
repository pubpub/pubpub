import React, { PropTypes } from 'react';
import Radium from 'radium';
import { AutocompleteBar, PreviewUser } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postJournalAdmin, deleteJournalAdmin } from './actionsAdmins';
let styles;

export const JournalAdmins = React.createClass({
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
				<h2>Admins</h2>
				<p>Admins are displayed publicly and can feature pubs, organize collections, and add admins.</p>

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

				{admins.map((admin)=> {
					const user = admin.user || {};
					return (
						<PreviewUser 
							user={user} 
							details={<span>Added: {dateFormat(admin.createdAt, 'mmmm dd, yyyy')}</span>}
							rightContent={<button type="button" className="pt-button pt-intent-danger pt-minimal" style={{ whiteSpace: 'nowrap' }} onClick={this.deleteAdmin.bind(this, admin.id)}>Delete Admin</button>} />
					);
				})}
			</div>
		);
	}
});

export default Radium(JournalAdmins);

styles = {
	container: {
		padding: '1.5em',
	},
	adminWrapper: {
		margin: '2em 0em',
	},
	detailsWrapper: {
		display: 'inline-block',
	},
	adminImage: {
		verticalAlign: 'top',
		paddingRight: '1em',
	},
	adminName: {
		fontSize: '1.25em',
		display: 'inline-block',
		verticalAlign: 'middle',
		paddingRight: '1em',
	},
	adminAction: {
		display: 'inline-block',
		paddingRight: '2em',
	},
	menuSubText: {
		maxWidth: '300px',
		marginBottom: 0,
		fontSize: '0.85em',
		whiteSpace: 'normal',
	},
	role: {
		display: 'inline-block',
		border: '1px solid #CCC',
		fontSize: '.85em',
		padding: '0em .5em',
		marginRight: '1em',
	},
};
