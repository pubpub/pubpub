import React, { PropTypes } from 'react';
import Radium from 'radium';
import { AutocompleteBar } from 'components';
import request from 'superagent';

let styles;

export const PubJournals = React.createClass({
	propTypes: {
		journalsSubmitted: PropTypes.array,
		journalsFeatured: PropTypes.array,
	},

	getInitialState: function() {
		return {
			newSubmission: null,
		};
	},

	loadOptions: function(input, callback) {
		if (input.length < 3) {
			callback(null, { options: null });
		}
		request.get('/api/search/journal?q=' + input).end((err, response)=>{
			const responseArray = (response && response.body) || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
					label: item.name,
					image: item.icon,
					slug: item.slug,
					id: item.id,
				};
			});
			callback(null, { options: options });
		});
	},
	handleSelectChange: function(value) {
		this.setState({ newSubmission: value });
	},
	createSubmission: function() {

	},

	render: function() {
		const journalsSubmitted = this.props.journalsSubmitted || [];
		const journalsFeatured = this.props.journalsFeatured || [];
		
		return (
			<div style={styles.container}>
				<h2>Journals</h2>

				<AutocompleteBar
					filterOptions={(options)=>{
						return options.filter((option)=>{
							for (let index = 0; index < journalsSubmitted.length; index++) {
								if (journalsSubmitted[index].id === option.id) {
									return false;
								}
							}
							return true;
						});
					}}
					placeholder={'Submit to new journal'}
					loadOptions={this.loadOptions}
					value={this.state.newSubmission}
					onChange={this.handleSelectChange}
					onComplete={this.createSubmission}
					completeDisabled={!this.state.newSubmission || !this.state.newSubmission.id}
					completeString={'Submit Pub'}
				/>
				
			</div>
		);
	}
});

export default Radium(PubJournals);

styles = {
	container: {
		padding: '1.5em',
	},
};
