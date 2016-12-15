import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link, browserHistory } from 'react-router';
import dateFormat from 'dateformat';
import { InputGroup, NonIdealState } from '@blueprintjs/core';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import JournalCollectionList from './JournalCollectionList';

let styles = {};


export const JournalFeatures = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	// getInitialState: function() {
	// 	return {
	// 		confirmFeature: undefined,
	// 		confirmReject: undefined,
	// 	};
	// },
	getInitialState() {
		return {
			search: '',
		};
	},
	
	componentWillReceiveProps(nextProps) {
		// if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
		// 	this.setState({ confirmReject: undefined });	
		// 	this.setState({ confirmFeature: undefined });	
		// }
	},

	inputUpdate: function(evt) {
		const value = evt.target.value || '';
		this.setState({ search: value });
	},

	searchSubmited: function(evt) {
		evt.preventDefault();
		browserHistory.push('/search?q=' + this.state.search);
		this.setState({ search: '' });
	},

	render: function() {
		const journal = this.props.journal || {};
		const pubFeatures = journal.pubFeatures || [];
		const metaData = {
			title: 'Featured · ' + journal.name,
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		return (
			<div>
				<Helmet {...metaData} />

				{!pubFeatures.length &&
					<NonIdealState
						action={
							<form onSubmit={this.searchSubmited}>
								<InputGroup leftIconName="search" placeholder={'Search...'} value={this.state.search} onChange={this.inputUpdate}/>
							</form>
						}
						description={'This journal has not yet featured any pubs. Search for pubs to feature below.'}
						title={'No Featured Pubs'}
						visual={'application'} />
				}

				{
					pubFeatures.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createdAt > bar.createdAt) { return -1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						return 0;
					}).map((pubFeature, index)=> {
						const pub = pubFeature.pub;
						const pubCollections = pub.labels.filter((label)=> {
							return label.journalId === journal.id;
						});
						return (
							<div key={'feature-' + index} style={styles.featureWrapper}>
								<div style={styles.featureTable}>
									<div style={styles.imageWrapper}>
										<Link to={'/pub/' + pub.slug}>
											<img src={pub.previewImage} style={styles.featureImage} />
										</Link>
									</div>
									
									<div style={styles.featureDetails}>
										<h4><Link to={'/pub/' + pub.slug}>{pub.title}</Link></h4>
										<p>{pub.description}</p>	
										<p>Featured on {dateFormat(pubFeature.updatedAt, 'mmmm dd, yyyy')}</p>	
									</div>
								</div>
								<JournalCollectionList 
									allLabels={journal.collections} 
									selectedLabels={pubCollections} 
									pubId={pub.id} 
									journalId={journal.id} 
									canEdit={true} 
									canSelect={true} 
									pathname={''} 
									query={{}} 
									dispatch={this.props.dispatch} />
							</div>
						);
					})
				}


			</div>
		);
	}

});

export default Radium(JournalFeatures);

styles = {
	featureWrapper: {
		// padding: '0em 0em 1em',
		margin: '0em 0em 1em 0em',
		borderBottom: '1px solid #CCC',
	},
	featureTable: {
		display: 'table',
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		width: '100px',
	},
	featureImage: {
		width: '100px',
		paddingRight: '1em',
	},
	featureDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttons: {
		display: 'table-cell',
		width: '1%',
	},
	loaderContainer: {
		display: 'inline-block',
		margin: 'auto 0',
	},
	
};
