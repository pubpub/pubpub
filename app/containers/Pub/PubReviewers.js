import React, { PropTypes } from 'react';
import Radium from 'radium';
import { AutocompleteBar } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postReviewer } from './actionsReviewers';

let styles;

export const PubReviewers = React.createClass({
	propTypes: {
		invitedReviewers: PropTypes.array,
		pubId: PropTypes.number,
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
					return (
						<div>
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + invitedUser.image} style={{ width: '50px' }} />	
							<div style={styles.discussionItemName}>
								{invitedUser.firstName + ' ' + invitedUser.lastName} · {dateFormat(reviewer.createdAt, 'mmm dd, yyyy')}
							</div>
							{/* Provide links to view all the posts by the user. Give a count (4 posts), and then link to the discussions filtered to that author */}
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
};
