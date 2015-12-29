import React, { PropTypes } from 'react';
import Radium from 'radium';
import {JournalPreview} from '../../components/ItemPreviews';
import dateFormat from 'dateformat';
import {Autocomplete} from '../../containers';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaExperts = React.createClass({
	propTypes: {
		featuredIn: PropTypes.array,
		featuredInList: PropTypes.array,
		submittedTo: PropTypes.array,
		submittedToList: PropTypes.array,
		handleSubmitToJournal: PropTypes.func,
		isAuthor: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			featuredIn: [],
			featuredInList: [],
			submittedTo: [],
			submittedToList: [],
		};
	},

	submitToJournal: function(journalID) {
		return () => {
			this.props.handleSubmitToJournal(journalID);
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
		console.log(usedJournalsObject);

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
								
								<div style={styles.action} key={'featuredPubSearchAdd-' + index} onClick={this.submitToJournal(journal._id)}>submit</div>
							</div>
						);	
					})
				}
				{results.length === 0 || totalCount === 0
					? <div style={styles.noResults}>No Results</div>
					: null
				}
				
			</div>
		);
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div style={styles.sectionHeader}>Journal Submissions</div>
				{this.props.isAuthor
					? <div style={styles.searchWrapper}>
						<Autocomplete 
							autocompleteKey={'pubSubmitToJournalAutocomplete'} 
							route={'autocompleteJournals'} 
							placeholder="Search Journals to Submit to" 
							resultRenderFunction={this.renderJournalSearchResults}/>
					</div>
					: null
				}

				{this.props.submittedTo.map((journalItem, index)=>{
					return (
						<div key={'submittedTo-' + index}>
							<JournalPreview 
								journalData={journalItem.journal} 
								hideDetails={true} 
								customDetails={['Submitted On ' + dateFormat(journalItem.date, 'mm/dd/yy, h:MMTT')]} />
						</div>
					);
				})}

				<div style={styles.sectionHeader}>Journals Featured In</div>
				{this.props.featuredIn.map((journalItem, index)=>{
					return (
						<div key={'featuredIn-' + index}>
							<JournalPreview 
								journalData={journalItem.journal} 
								hideDetails={true} 
								customDetails={['Featured On ' + dateFormat(journalItem.date, 'mm/dd/yy, h:MMTT')]} />
						</div>
					);
				})}

					
			</div>
		);
	}
});

export default Radium(PubMetaExperts);

styles = {
	container: {
		padding: 15,
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
};
