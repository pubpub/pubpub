import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';

export const AtomReaderJournals = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	getInitialState: function() {
		return {
			value: [],
		};
	},

	logChange: function(val) {
	    console.log("Selected: " + val);
	},
	handleSelectChange (value) {
		console.log('You\'ve selected:', value);
		this.setState({ value });
	},

	render: function() {
		const options = [
			{ value: 'one', label: 'One' },
			{ value: 'two', label: 'Two' },
			{ value: 'three', label: 'three' },
			{ value: 'fou', label: 'fou' },
			{ value: 'fish', label: 'fish' },
			{ value: 'dish', label: 'dish' },
		];

		return (
			<div>
				
				<h2>Journals</h2>
				Journals serve as curators. Pubs can be featured in multiple journals.

				<h3>Submit to Journals</h3>

				<Select
				    name="form-field-name"
				    value={this.state.value}
				    options={options}
				    multi={true}
				    placeholder={<span>Hey there - enter</span>}
				    onChange={this.handleSelectChange}
				/>

			</div>
		);
	}
});

export default Radium(AtomReaderJournals);
