import React, { PropTypes } from 'react';
import Radium from 'radium';
import { AutocompleteBar, PreviewJournal } from 'components';
import request from 'superagent';
import dateFormat from 'dateformat';
import { postJournalSubmit, putFeature, putPubContext } from './actionsJournals';

let styles;

export const PubJournals = React.createClass({
	propTypes: {
		pubSubmits: PropTypes.array,
		pubFeatures: PropTypes.array,
		pubDefaultContext: PropTypes.number,
		pubId: PropTypes.number,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			newSubmission: null,
			// featureStates: {},
			// defaultContext: undefined,
		};
	},

	componentWillMount() {
		// const features = this.props.pubFeatures || [];
		// const featureStates = {};
		// features.map((feature)=> {
		// 	featureStates[feature.journalId] = {
		// 		isDisplayed: feature.isDisplayed || false,
		// 	};
		// });
		// this.setState({ 
		// 	featureStates: featureStates,
		// 	defaultContext: this.props.pubDefaultContext
		// });
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
	setDisplayed: function(journalId, evt) {
		// this.setState({ 
		// 	featureStates: {
		// 		...this.state.featureStates,
		// 		[journalId]: {
		// 			...this.state.featureStates[journalId],
		// 			isDisplayed: evt.target.checked
		// 		}
		// 	} 
		// });
		this.props.dispatch(putFeature(this.props.pubId, journalId, evt.target.checked));
	},
	setContext: function(journalId, evt) {
		// this.setState({ 
		// 	defaultContext: journalId
		// });
		if (journalId === this.props.pubDefaultContext) {
			return this.props.dispatch(putPubContext(this.props.pubId, null));
		}
		return this.props.dispatch(putPubContext(this.props.pubId, journalId));
	},

	render: function() {
		const pubSubmits = this.props.pubSubmits || [];
		const pubFeatures = this.props.pubFeatures || [];

		const featuredIds = {};
		pubFeatures.map((feature)=> {
			featuredIds[feature.journalId] = feature;
		});
		
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
				
				{!!pubFeatures.length && 
					<div style={styles.section}>
						<h2>Features</h2>
						{pubFeatures.sort((foo, bar)=> {
							// Sort so that most recent is first in array
							if (foo.createdAt > bar.createdAt) { return -1; }
							if (foo.createdAt < bar.createdAt) { return 1; }
							return 0;
						}).map((feature, index)=> {
							const journal = feature.journal;
							const isDisplayed = feature.isDisplayed;
							const isContext = feature.journalId === this.props.pubDefaultContext;
							return (
								<div key={'pubFeature-' + index}>
									<PreviewJournal 
										journal={journal} 
										rightContent={
											<div style={styles.rightContent}>
												<div>Featured: {dateFormat(feature.createdAt, 'mmm dd, yyyy')}</div>
											</div>
										} 
										bottomContent={
											<div>
												<label style={styles.contributorAction} className={'pt-control pt-checkbox'}>
													<input type="checkbox" checked={isDisplayed} onChange={this.setDisplayed.bind(this, feature.journalId)} />
													<span className="pt-control-indicator" />
													Display in Header
												</label>
												<label style={styles.contributorAction} className="pt-control pt-checkbox">
													<input type="checkbox" checked={isContext} onChange={this.setContext.bind(this, feature.journalId)} />
													<span className="pt-control-indicator" />
													Set as Default Context
												</label>
											</div>
										} />	
								</div>
								
							);
						})}
					</div>
				}

				{!!pubSubmits.length && 
					<div style={styles.section}>
						<h2>Submissions</h2>
						{pubSubmits.sort((foo, bar)=> {
							// Sort so that most recent is first in array
							if (foo.createdAt > bar.createdAt) { return -1; }
							if (foo.createdAt < bar.createdAt) { return 1; }
							return 0;
						}).map((submit, index)=> {
							const journal = submit.journal;
							const feature = featuredIds[journal.id];
							const wrapperStyle = feature ? styles.dimItem : {};
							return (
								<div key={'pubSubmit-' + index} style={wrapperStyle}>
									<PreviewJournal 
										journal={journal} 
										rightContent={
											<div style={styles.rightContent}>
												<div>Submitted: {dateFormat(submit.createdAt, 'mmm dd, yyyy')}</div>
												{!!feature &&
													<div>Featured: {dateFormat(feature.createdAt, 'mmm dd, yyyy')}</div>
												}
											</div>
										} />	
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
	section: {
		margin: '2em 0em',
	},
	// disabled: {
	// 	pointerEvents: 'none',
	// 	opacity: '0.5',
	// },
	dimItem: {
		opacity: '0.35',
	},
	rightContent: {
		paddingRight: '1em',
		color: '#666',
		textAlign: 'right',
	},
	contributorAction: {
		display: 'inline-block',
		paddingRight: '2em',
	},
};
