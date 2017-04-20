import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import Link from 'components/Link/Link';
import dateFormat from 'dateformat';
import { InputGroup, NonIdealState } from '@blueprintjs/core';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';

import JournalPageList from './JournalPageList';

let styles = {};


export const JournalFeatures = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,
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
			title: 'Featured · ' + journal.title,
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
					}).filter((item)=> {
						const pub = item.pub || {};
						return pub.slug !== 'designandsciencej';
					}).map((pubFeature, index)=> {
						const pub = pubFeature.pub || {};
						const labels = pub.labels || [];
						const pubPages = labels.filter((label)=> {
							return label.journalId === journal.id;
						});
						return (
							<div key={'feature-' + index} style={styles.featureWrapper}>
								<div style={styles.featureTable}>
									<div style={styles.imageWrapper}>
										<Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>
											<img src={pub.avatar} style={styles.featureImage} />
										</Link>
									</div>
									
									<div style={styles.featureDetails}>
										<h4><Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>{pub.title}</Link></h4>
										<p>{pub.description}</p>	
										<p>Featured on {dateFormat(pubFeature.updatedAt, 'mmmm dd, yyyy')}</p>	
									</div>
								</div>
								<JournalPageList 
									allLabels={journal.pages} 
									selectedLabels={pubPages} 
									pubId={pub.id} 
									journal={journal}
									canEdit={journal.isAdmin} 
									canSelect={journal.isAdmin} 
									pathname={this.props.pathname} 
									query={this.props.query} 
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
