import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { AutocompleteBar } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postReviewer } from './actionsReviewers';

let styles;

export const PubReviewers = React.createClass({
	propTypes: {
		invitedReviewers: PropTypes.array,
		discussionsData: PropTypes.array,
		pubId: PropTypes.number,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newReviewer: null,
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
		const inviterJournalId = null;
		this.props.dispatch(postReviewer(email, name, this.props.pubId, this.state.newReviewer.id, inviterJournalId));
	},

	render: function() {
		const invitedReviewers = this.props.invitedReviewers || [];
		const discussionsData = this.props.discussionsData || [];
		return (
			<div style={styles.container}>
				<h2>Reviewers</h2>

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

				{invitedReviewers.map((reviewer, index)=> {
					const invitedUser = reviewer.invitedUser;
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
						<div key={'reviewer-' + reviewer.invitedUserId} style={styles.invitationWrapper}>
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
