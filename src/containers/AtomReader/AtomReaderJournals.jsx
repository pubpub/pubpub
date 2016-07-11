import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';

export const AtomReaderJournals = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
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
				};
			});
			callback(null, { options: options });
		});
	},

	render: function() {

		return (
			<div>
				
				<h2>Journals</h2>
				Journals serve as curators. Pubs can be featured in multiple journals.

				<h3>Submit to Journals</h3>

				<Select.Async
				    name="form-field-name"
				    value={this.state.value}
				    loadOptions={this.loadOptions}
				    multi={true}
				    placeholder={<span>Hey there - enter</span>}
				    onChange={this.handleSelectChange}
				/>

			</div>
		);
	}
});

export default Radium(AtomReaderJournals);
