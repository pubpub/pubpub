import React, { PropTypes } from 'react';
import Radium from 'radium';
import {JournalPreview} from '../../components/ItemPreviews';
import dateFormat from 'dateformat';
import {Autocomplete} from '../../containers';
// import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const PubMetaExperts = React.createClass({
	propTypes: {
		featuredIn: PropTypes.array,
		featuredInList: PropTypes.array,
		submittedTo: PropTypes.array,
		submittedToList: PropTypes.array,
		handleSubmitToJournal: PropTypes.func,
		isAuthor: PropTypes.bool,
		intl: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			featuredIn: [],
			featuredInList: [],
			submittedTo: [],
			submittedToList: [],
		};
	},

	submitToJournal: function(journalData) {
		return () => {
			this.props.handleSubmitToJournal(journalData);
		};
	},

	renderJournalSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		const usedJournalsObject = {};
		for (let index = this.props.featuredInList.length; index--; ) {
			usedJournalsObject[this.props.featuredInList[index]] = true;
		}
		for (let index = this.props.submittedToList.length; index--; ) {
			usedJournalsObject[this.props.submittedToList[index]] = true;
		}

		return (
			<div style={styles.results}>
				{

					results.map((journal, index)=>{

						if (journal._id in usedJournalsObject) {
							return null;
						}

						totalCount++;
						return (
							<div key={'journalSearch-' + index} style={styles.result}>
								<div style={styles.resultDetails}>
									<JournalPreview journalData={journal}/>
								</div>
								
								<div style={styles.action} key={'featuredPubSearchAdd-' + index} onClick={this.submitToJournal(journal)}>
									<FormattedMessage {...globalMessages.submit} />
								</div>
							</div>
						);	
					})
				}
				{results.length === 0 || totalCount === 0
					? <div style={styles.noResults}>
						<FormattedMessage {...globalMessages.noResults} />
					</div>
					: null
				}
				
			</div>
		);
	},

	render: function() {
		const messages = defineMessages({
			searchJournals: {
				id: 'pub.searchJournals',
				defaultMessage: 'Search Journals to Submit to',
			},
		});

		return (
			<div style={styles.container}>

				<div style={styles.sectionHeader}>
					<FormattedMessage id="pub.journalSubmissions" defaultMessage="Journal Submissions"/>
				</div>
				{this.props.isAuthor
					? <div style={styles.searchWrapper}>
						<Autocomplete 
							autocompleteKey={'pubSubmitToJournalAutocomplete'} 
							route={'autocompleteJournals'} 
							placeholder={this.props.intl.formatMessage(messages.searchJournals)} 
							resultRenderFunction={this.renderJournalSearchResults}/>
					</div>
					: null
				}

				<div style={styles.journalListWrapper}>
					{this.props.submittedTo.map((journalItem, index)=>{
						return (
							<div key={'submittedTo-' + index}>
								{String(this.props.featuredInList).indexOf(journalItem.journal._id) > -1
									? null
									: <JournalPreview 
										journalData={journalItem.journal} 
										hideDetails={true} 
										customDetails={['Submitted On ' + dateFormat(journalItem.date, 'mmm dd, yyyy h:MMTT')]} />
								}
								
							</div>
						);
					})}
				</div>
				

				{this.props.submittedTo.length
					? null
					: <div style={styles.emptyBlock}>
						<FormattedMessage id="pub.noSubmissions" defaultMessage="Not submitted to any Journals"/>
					</div>
				}

				<div style={styles.sectionHeader}>
					<FormattedMessage id="pub.journalsFeaturedIn" defaultMessage="Journals Featured In"/>
				</div>
				<div style={styles.journalListWrapper}>
					{this.props.featuredIn.map((journalItem, index)=>{
						return (
							<div key={'featuredIn-' + index}>
								<JournalPreview 
									journalData={journalItem.journal} 
									hideDetails={true} 
									customDetails={['Featured On ' + dateFormat(journalItem.date, 'mmm dd, yyyy h:MMTT')]} />
							</div>
						);
					})}
				</div>
				
				{this.props.featuredIn.length
					? null
					: <div style={styles.emptyBlock}>
						<FormattedMessage id="pub.notFeatured" defaultMessage="Not featured in any Journals"/>
					</div>
				}

					
			</div>
		);
	}
});

export default injectIntl(Radium(PubMetaExperts));

styles = {
	container: {
		padding: 15,
	},
	sectionHeader: {
		fontSize: '25px',
		margin: '20px 0px',
	},
	journalListWrapper: {
		marginLeft: '30px',
	},
	searchWrapper: {
		margin: '0px 0px 25px 30px',
		width: '80%',
	},
	results: {
		boxShadow: '0px 0px 2px 2px #D7D7D7',
		width: 'calc(100% - 6px)',
		margin: '0 auto 5px auto',
		backgroundColor: 'white',

	},
	result: {
		padding: '5px 0px',
		// margin: '0px 5px',
		borderBottom: '1px solid #F0F0F0',
		display: 'table',
		tableLayout: 'fixed',
		width: '100%',
	},
	resultDetails: {
		display: 'table-cell',
		width: 'calc(100% - 80px)',
		padding: '5px 5px',
	},
	action: {
		display: 'table-cell',
		fontFamily: 'Courier',
		width: '80px',
		// backgroundColor: 'rgba(200,100,0,0.2)',
		verticalAlign: 'middle',
		userSelect: 'none',
		textAlign: 'center',
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
	noResults: {
		fontFamily: 'Courier',
		fontSize: '15px',
		height: 30,
		lineHeight: '30px',
		textAlign: 'center',
	},
	emptyBlock: {
		backgroundColor: '#f6f6f6',
		width: '75%',
		margin: '15px auto',
		height: '85px',
		lineHeight: '85px',
		textAlign: 'center',
		border: '1px solid rgba(0,0,0,0.05)',
		borderRadius: '2px',
	},
};
