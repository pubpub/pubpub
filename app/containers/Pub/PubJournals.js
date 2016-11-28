import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { AutocompleteBar } from 'components';
import request from 'superagent';
import { postJournalSubmit } from './actionsJournals';

let styles;

export const PubJournals = React.createClass({
	propTypes: {
		pubSubmits: PropTypes.array,
		pubFeatures: PropTypes.array,
		pubId: PropTypes.number,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newSubmission: null,
		};
	},

	componentWillReceiveProps(nextProps) {
		const prevSubmits = this.props.pubSubmits || [];
		const nextSubmits = nextProps.pubSubmits || [];

		if (prevSubmits.length < nextSubmits.length) {
			this.setState({ newSubmission: null });
		}
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
		this.props.dispatch(postJournalSubmit(this.props.pubId, this.state.newSubmission.id));
	},

	render: function() {
		const pubSubmits = this.props.pubSubmits || [];
		const pubFeatures = this.props.pubFeatures || [];
		
		return (
			<div style={styles.container}>
				<h2>Journals</h2>

				<AutocompleteBar
					filterOptions={(options)=>{
						return options.filter((option)=>{
							for (let index = 0; index < pubSubmits.length; index++) {
								if (pubSubmits[index].journal.id === option.id) {
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

				{!!pubSubmits.length && 
					<div>
						<h2>Submissions</h2>
						{pubSubmits.map((submit, index)=> {
							const journal = submit.journal;
							return (
								<div key={'pubSubmit-' + index}>
									<img alt={journal.name} src={'https://jake.pubpub.org/unsafe/50x50/' + journal.icon} style={{verticalAlign: 'middle', paddingRight: '1em'}}/>
									<Link to={'/' + journal.slug}><h4 style={{display: 'inline-block'}}>{journal.name}</h4></Link>
								</div>
							);
						})}
					</div>
				}
				
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
