import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const AtomReaderJournals = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		handleJournalSubmit: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: [],
		};
	},

	handleSelectChange (value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteJournals?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.subdomain,
					label: item.journalName,
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

	render: function() {
		const submittedData = safeGetInToJS(this.props.atomData, ['submittedData']) || {};
		const featuredData = safeGetInToJS(this.props.atomData, ['featuredData']) || {};
		return (
			<div>
				
				<h2>Journals</h2>
				Journals serve as curators. Pubs can be featured in multiple journals.

				<h3>Add Submissions</h3>

				<Select.Async
					name="form-field-name"
					value={this.state.value}
					loadOptions={this.loadOptions}
					multi={true}
					placeholder={<span>Choose one or more journals for submission</span>}
					onChange={this.handleSelectChange} />

				<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.length) && styles.submitButtonActive]} onClick={this.submitToJournals}>Submit To Journals</div>

				<h3>Submitted to</h3>
					{submittedData.map((item, index)=>{
						return <div key={'submitted-' + index}>{item.createDate} to {item.destination.journalName}</div>;
					})}

				<h3>Featured by</h3>
					{featuredData.map((item, index)=>{
						return <div key={'featured-' + index}>{item.journalName}</div>;
					})}


			</div>
		);
	}
});

export default Radium(AtomReaderJournals);

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
