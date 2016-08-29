import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import {PreviewCard} from 'components';

let styles;

export const AtomJournals = React.createClass({
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
		request.get('/api/autocompleteJournals?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
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
		const submittedData = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const featuredData = safeGetInToJS(this.props.atomData, ['featuredData']) || [];
		const permissionType = safeGetInToJS(this.props.atomData, ['atomData', 'permissionType']) || [];
		return (
			<div style={styles.container}>
				
				Journals serve as curators. Pubs can be featured in multiple journals.

				{permissionType === 'author' &&
					<div>
						<h3>Add Submissions</h3>

						<Select.Async
							name="form-field-name"
							minimumInput={1}
							value={this.state.value}
							loadOptions={this.loadOptions}
							multi={true}
							placeholder={<span>Choose one or more journals for submission</span>}
							onChange={this.handleSelectChange} />

						<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.length) && styles.submitButtonActive]} onClick={this.submitToJournals}>Submit To Journals</div>

						<h3>Submitted to</h3>
						{
							submittedData.sort((foo, bar)=>{
								// Sort so that most recent is first in array
								if (foo.createDate > bar.createDate) { return -1; }
								if (foo.createDate < bar.createDate) { return 1; }
								return 0;
							}).map((item, index)=>{
								return (
									<div style={[item.inactive && styles.inactive]} key={'submitted-' + index}>
										<PreviewCard 
											type={'journal'}
											image={item.destination.icon}
											title={item.destination.journalName}
											slug={item.destination.slug}
											description={item.destination.description}
											footer={
												<div>
													<div>Submitted on {dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</div>
													<div style={[!item.inactive && {display: 'none'}]}><span style={styles.inactiveNote}>{item.inactiveNote}</span> on {dateFormat(item.inactiveDate, 'mmm dd, yyyy h:MM TT')}</div>
												</div>
											} />
									</div>
									);
							})
						}

					</div>
				}

				<h3>Featured by</h3>
				{
					featuredData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						return (
							<div style={[item.inactive && styles.inactive]} key={'submitted-' + index}>
								<PreviewCard 
									type={'journal'}
									image={item.source.icon}
									title={item.source.journalName}
									slug={item.source.slug}
									description={item.source.description}
									footer={
										<div>
											<div>Featured on {dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</div>
										</div>
									} />
							</div>
							);
					})
				}

			</div>
		);
	}
});

export default Radium(AtomJournals);

styles = {
	container: {
		marginTop: '1em',
	},
	inactive: {
		opacity: '0.5',
	},
	inactiveNote: {
		textTransform: 'capitalize',
	},
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
