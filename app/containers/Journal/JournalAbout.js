import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { AutocompleteBar, PreviewUser, Loader } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postJournalAdmin, deleteJournalAdmin } from './actionsAdmins';
import { NonIdealState } from '@blueprintjs/core';
import { putJournal } from './actions';
import Textarea from 'react-textarea-autosize';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalAbout = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newAdmin: null,
			editorOpen: false,
			editorContent: undefined,
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

		const prevLoading = this.props.isLoading;
		const nextLoading = nextProps.isLoading;
		const nextError = nextProps.error;
		if (prevLoading && !nextLoading && !nextError) {
			this.setState({
				editorOpen: false,
				editorContent: undefined
			});
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

	openEditor: function() {
		this.setState({
			editorOpen: true,
			editorContent: this.props.journal.longDescription || ''
		});
	},
	closeEditor: function() {
		this.setState({
			editorOpen: false,
			editorContent: undefined
		});
	},
	saveEditor: function() {
		const newJournalData = { longDescription: this.state.editorContent };
		this.props.dispatch(putJournal(this.props.journal.id, newJournalData));
		
		// Need to actually do this in the willreceive
		// this.setState({
		// 	editorOpen: false,
		// 	editorContent: undefined
		// });
		

	},

	detailsChanged: function(evt) {
		this.setState({ editorContent: evt.target.value });
	},

	render() {
		const journal = this.props.journal || {};
		const admins = journal.admins || [];

		return (
			<div style={styles.container}>
				
				<h2>About {journal.name}</h2>
				{/*<div style={styles.linksSection}>
					{journal.website &&
						<Link to={journal.website} style={styles.outLink}>{journal.website}</Link>
					}
					{journal.twitter &&
						<Link to={'https://twitter.com/' + journal.twitter} style={styles.outLink}>@{journal.twitter}</Link>
					}
					{journal.facebook &&
						<Link to={'https://facebook.com/' + journal.facebook} style={styles.outLink}>facebook.com/{journal.facebook}</Link>
					}
				</div>*/}

				<div style={styles.aboutContent}>
					{!journal.longDescription && !this.state.editorOpen &&
						<NonIdealState
							action={<button className={'pt-button pt-icon-edit'} role="button" onClick={this.openEditor}>Add Details</button>}
							description={'Details about this journal have not yet been added. You can use this space to describe the journal\'s vision, review process, or mission.'}
							title={'No Content Yet'}
							visual={'annotation'} />
					}

					{journal.longDescription && !this.state.editorOpen &&
						<div className="journal-about-content">
							<div style={{float: 'right'}}>
								<button className={'pt-button pt-icon-edit'} role="button" onClick={this.openEditor}>Edit Details</button>
							</div>
							<ReactMarkdown source={journal.longDescription} />
						</div>	
					}
					{this.state.editorOpen &&
						<div>
							<div>
								
								<div style={{float: 'right'}}>
									<div style={styles.loaderContainer}><Loader loading={this.props.isLoading} showCompletion={!this.props.error} /></div>
									<button className={'pt-button'} role="button" onClick={this.closeEditor} style={{marginRight: '0.5em'}}>Cancel</button>
									<button className={'pt-button pt-intent-primary'} role="button" onClick={this.saveEditor}>Save Details</button>
								</div>
								<p style={{paddingTop: '8px'}}><a href={'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'} target={'_blank'}>Markdown supported</a></p>
							</div>
							
							<Textarea onChange={this.detailsChanged} value={this.state.editorContent} minRows={3} style={{width: '100%', border: '1px solid #CCC', resize: 'none'}} />
						</div>	
					}
					
				</div>
			

				<h2><FormattedMessage {...globalMessages.Admins} /></h2>
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
							key={'admin-' + admin.id}
							user={user} 
							details={<span>Added: {dateFormat(admin.createdAt, 'mmmm dd, yyyy')}</span>}
							rightContent={<button type="button" className="pt-button pt-intent-danger pt-minimal" style={{ whiteSpace: 'nowrap' }} onClick={this.deleteAdmin.bind(this, admin.id)}>Delete Admin</button>} />
					);
				})}
			</div>
		);
	}
});

export default Radium(JournalAbout);

styles = {
	container: {
		maxWidth: '800px',
		margin: '0 auto',
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
