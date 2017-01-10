import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { AutocompleteBar, DropdownButton } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postReviewer } from './actionsReviewers';
import { Menu } from '@blueprintjs/core';

let styles;

export const PubReviewers = React.createClass({
	propTypes: {
		invitedReviewers: PropTypes.array,
		accountUser: PropTypes.object,
		discussionsData: PropTypes.array,
		pubId: PropTypes.number,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newReviewer: null,
			newReviewerEmail: '',
			newReviewerName: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		const prevReviewers = this.props.invitedReviewers || [];
		const nextReviewers = nextProps.invitedReviewers || [];

		if (prevReviewers.length < nextReviewers.length) {
			this.setState({ newReviewer: null });
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
		this.setState({ newReviewer: value });
	},

	inviteReviewer: function() {
		const email = null;
		const name = null;
		const inviterJournal = this.state.inviterJournal || {};
		const inviterJournalId = inviterJournal.id || null;
		this.props.dispatch(postReviewer(email, name, this.props.pubId, this.state.newReviewer.id, inviterJournalId));
	},

	newReviewerEmailChange: function(evt) {
		this.setState({ newReviewerEmail: evt.target.value });
	},
	newReviewerNameChange: function(evt) {
		this.setState({ newReviewerName: evt.target.value });
	},

	handleEmailInvite: function(evt) {
		evt.preventDefault();
		// console.log('sending invite to ', this.state.newReviewerEmail);
		const email = this.state.newReviewerEmail;
		const name = this.state.newReviewerName;
		const inviterJournal = this.state.inviterJournal || {};
		const inviterJournalId = inviterJournal.id || null;
		const invitedUserId = null;
		this.props.dispatch(postReviewer(email, name, this.props.pubId, invitedUserId, inviterJournalId));
	},
	setJournal: function(journal) {
		this.setState({ inviterJournal: journal });
	},

	render: function() {
		const invitedReviewers = this.props.invitedReviewers || [];
		const discussionsData = this.props.discussionsData || [];
		const accountUser = this.props.accountUser || {};
		const accountJournalAdmins = accountUser.journalAdmins || [];
		const accountJournals = accountJournalAdmins.map((journalAdmin)=> {
			return journalAdmin.journal;
		});
		const inviterJournal = this.state.inviterJournal || {};

		return (
			<div style={styles.container}>
				<h2>Reviewers</h2>

				<p>Inviting as: <img src={accountUser.image} style={{ width: '35px' }} /></p>
				{!!accountJournals.length &&
					<div>
						<DropdownButton 
							content={
								<Menu>
									<li key={'authorFilter-null'} onClick={this.setJournal.bind(this, undefined)} className="pt-menu-item pt-popover-dismiss">None</li>
									{accountJournals.map((journal, index)=> {
										return (
											<li key={'authorFilter-' + index} onClick={this.setJournal.bind(this, journal)} className="pt-menu-item pt-popover-dismiss">{journal.name}</li>
										);
									})}
								</Menu>
							} 
							title={
								<span>
									Inviting on behalf of {inviterJournal.name}
								</span>
							} 
							position={0} />
					</div>	
				}
				

				<AutocompleteBar
					filterOptions={(options)=>{
						// Remove if invited, or if an existing contributor on the work.

						return options.filter((option)=>{
							for (let index = 0; index < invitedReviewers.length; index++) {
								if (invitedReviewers[index].invitedUserId === option.id) {
									return false;
								}
							}
							return true;
						});
					}}
					placeholder={'Find New Reviewer'}
					loadOptions={this.loadOptions}
					value={this.state.newReviewer}
					onChange={this.handleSelectChange}
					onComplete={this.inviteReviewer}
					completeDisabled={!this.state.newReviewer || !this.state.newReviewer.id}
					completeString={'Invite'}
				/>

				<form onSubmit={this.handleEmailInvite}>
					<label htmlFor={'email'}>
						Email
						<input className={'pt-input margin-bottom'} id={'email'} name={'email'} type="email" style={styles.input} value={this.state.newReviewerEmail} onChange={this.newReviewerEmailChange} placeholder={'example@email.com'}/>
					</label>
					<label htmlFor={'name'}>
						name
						<input className={'pt-input margin-bottom'} id={'name'} name={'name'} type="text" style={styles.input} value={this.state.newReviewerName} onChange={this.newReviewerNameChange} placeholder={'Jane Doe'}/>
					</label>
					<button className={'pt-button pt-intent-primary'} name={'login'} onClick={this.handleEmailInvite}>
						Invite by Email
					</button>
					<div style={styles.errorMessage}>{false}</div>
				</form>

				{invitedReviewers.map((reviewer, index)=> {
					const invitedUser = reviewer.invitedUser || {
						firstName: reviewer.name,
						lastName: '',
						image: 'http://icons.iconarchive.com/icons/uiconstock/socialmedia/256/Email-icon.png',
					};
					const inviterUser = reviewer.inviterUser;
					const discussionCount = discussionsData.reduce((previous, current)=> {
						const children = current.children || [];
						const discussionAuthors = [
							current.contributors[0].user.username,
							...children.map((child)=> {
								return child.contributors[0].user.username;
							})
						];
						return previous + Number(discussionAuthors.includes(invitedUser.username));
					}, 0);

					return (
						<div key={'reviewer-' + index} style={styles.invitationWrapper}>
							<div style={styles.invitedReviewerWrapper}>
								<div style={styles.reviewerImageWrapper}>
									<Link to={'/user/' + invitedUser.username}>
										<img alt={invitedUser.firstName + ' ' + invitedUser.lastName} src={'https://jake.pubpub.org/unsafe/50x50/' + invitedUser.image} />	
									</Link>
								</div>
								
								<div style={styles.reviewerDetails}>
									<div style={styles.reviewerName}>
										<Link to={'/user/' + invitedUser.username}>{invitedUser.firstName + ' ' + invitedUser.lastName}</Link>
									</div>
									<div>Invited on {dateFormat(reviewer.createdAt, 'mmm dd, yyyy')} · <Link to={{ pathname: this.props.pathname, query: { ...this.props.query, panel: undefined, label: undefined, sort: undefined, author: invitedUser.username } }}>{discussionCount} discussions</Link> </div>
								</div>
							</div>
							<div>
								<Link to={'/user/' + inviterUser.username}>
									<img alt={inviterUser.firstName + ' ' + inviterUser.lastName} src={'https://jake.pubpub.org/unsafe/50x50/' + inviterUser.image} style={styles.inviterImage} />	
								</Link>
								Invited by <Link to={'/user/' + inviterUser.username}>{inviterUser.firstName + ' ' + inviterUser.lastName}</Link>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
});

export default Radium(PubReviewers);

styles = {
	container: {
		
	},
	invitationWrapper: {
		padding: '0em 0em 1em',
		borderBottom: '1px solid #CCC',
		margin: '0em 0em 1em',
	},
	invitedReviewerWrapper: {
		display: 'table',
		width: '100%',
	},
	reviewerImageWrapper: {
		width: '50px',
		display: 'table-cell',
	},
	reviewerDetails: {
		display: 'table-cell',
		padding: '0em .25em',
		verticalAlign: 'top',
	},
	reviewerName: {
		padding: '.25em 0em',
		fontWeight: 'bold',
	},
	inviterImage: {
		width: '25px',
		verticalAlign: 'middle',
		padding: '.25em 0em',
		marginRight: '.25em',
	},
};
