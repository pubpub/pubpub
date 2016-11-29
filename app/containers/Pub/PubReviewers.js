import React, { PropTypes } from 'react';
import Radium from 'radium';
import { AutocompleteBar } from 'components';
import request from 'superagent';

let styles;

export const PubReviewers = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newReviewer: null,
		};
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

	},

	render: function() {
		const reviewers = [];

		return (
			<div style={styles.container}>
				<h2>Reviewers</h2>

				<AutocompleteBar
					filterOptions={(options)=>{
						// Remove if invited, or if an existing contributor on the work.
						
						return options.filter((option)=>{
							for (let index = 0; index < reviewers.length; index++) {
								if (reviewers[index].userId === option.id) {
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
			</div>
		);
	}
});

export default PubReviewers;

styles = {
	container: {
		
	},
};
