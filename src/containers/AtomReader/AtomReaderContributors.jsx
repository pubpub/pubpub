import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const AtomReaderContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		handleJournalSubmit: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: [],
		};
	},

	componentWillReceiveProps(nextProps) {
		const currentSubmitted = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const nextSubmitted = safeGetInToJS(nextProps.atomData, ['submittedData']) || [];
		if (currentSubmitted.length !== nextSubmitted.length) {
			this.setState({value: []});
		}
	},

	handleSelectChange: function(value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteJrnls?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
					label: item.jrnlName,
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
		const submittedData = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const featuredData = safeGetInToJS(this.props.atomData, ['featuredData']) || [];
		return (
			<div>
				<h2 className={'normalWeight'}>Contributors</h2>
			</div>
		);
	}
});

export default Radium(AtomReaderContributors);

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
