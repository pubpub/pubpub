import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Spinner } from '@blueprintjs/core';
import { PreviewUser, PreviewPub, PreviewJournal, NavContentWrapper } from 'components';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { search } from './actions';

let styles;

export const Search = React.createClass({
	propTypes: {
		searchData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	// statics: {
	// 	readyOnActions: function(dispatch, params, location) {
	// 		return Promise.all([
	// 			dispatch(search(location.query.q))
	// 		]);
	// 	}
	// },

	componentWillMount() {
		this.props.dispatch(search(this.props.location.query.q));
		this.setState({ searchString: this.props.location.query.q });
	},

	getInitialState() {
		return {
			searchString: '',
		};
	},

	// componentWillMount() {
		
	// },

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.query.q !== this.state.searchString) {
			this.setState({ searchString: nextProps.location.query.q });	
		}
		const searchData = nextProps.searchData.results || {};
		const pubs = searchData.pubs || [];
		const users = searchData.users || [];
		const journals = searchData.journals || [];
		const labels = searchData.labels || [];
		const query = nextProps.location.query;
		const pathname = nextProps.location.pathname;
		const mode = query.mode;

		const currentModeCount = mode ? searchData[mode].length : 0;
		const finishedLoading = this.props.searchData.loading && !nextProps.searchData.loading;
		if (finishedLoading && currentModeCount === 0) {
			let nextMode;
			if (labels.length) { nextMode = 'labels'; }
			if (journals.length) { nextMode = 'journals'; }
			if (users.length) { nextMode = 'users'; }
			if (pubs.length) { nextMode = 'pubs'; }
			browserHistory.replace({ pathname: pathname, query: { ...query, mode: nextMode } });
		}
	},

	searchUpdate: function(evt) {
		const value = evt.target.value || '';
		this.setState({ searchString: value });
	},

	searchSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(search(this.state.searchString));	
		const query = this.props.location.query;
		browserHistory.push({ pathname: '/search', query: { ...query, q: this.state.searchString } });
	},
	
	render() {
		const searchData = this.props.searchData.results || {};
		const pubs = searchData.pubs || [];
		const users = searchData.users || [];
		const journals = searchData.journals || [];
		const labels = searchData.labels || [];

		const query = this.props.location.query;
		const pathname = this.props.location.pathname;

		const mode = this.props.searchData.loading ? 'loading' : query.mode || 'pubs';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: ' ', link: { pathname: pathname, query: { ...query, mode: undefined } } },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu} />, action: undefined },
		];

		const navItems = [
			{ type: 'link', text: <FormattedMessage {...globalMessages.Pubs} />, count: pubs.length, link: { pathname: pathname, query: { ...query, mode: undefined } }, active: mode === 'pubs' || !mode },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Users} />, count: users.length, link: { pathname: pathname, query: { ...query, mode: 'users' } }, active: mode === 'users' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Journals} />, count: journals.length, link: { pathname: pathname, query: { ...query, mode: 'journals' } }, active: mode === 'journals' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Labels} />, count: labels.length, link: { pathname: pathname, query: { ...query, mode: 'labels' } }, active: mode === 'labels' },
		];
		
		return (
			<div style={styles.container}>
				<Helmet title={'Search · PubPub'} />
				
				{/*<form onSubmit={this.searchSubmit} style={styles.searchForm}>
					<span className="pt-icon pt-icon-search" style={styles.searchIcon} />
					<input type="text" value={this.state.searchString} onChange={this.searchUpdate} placeholder={'Type to search'} style={styles.searchInput} />
					<button className="pt-button pt-intent-primary" onClick={this.searchSubmit} style={styles.searchButton}>Search</button>
				</form>*/}

				<form onSubmit={this.searchSubmit} style={{marginBottom: '2em'}}>
					<div className="pt-control-group pt-large" style={{justifyContent: 'center'}}>
						<div className="pt-input-group pt-large">
							<span className="pt-icon pt-icon-search" />
							<input type="text" className="pt-input pt-large" value={this.state.searchString} onChange={this.searchUpdate} placeholder="Search" style={{minWidth: '400px'}} />
						</div>
						<button className="pt-button pt-intent-primary pt-large" onClick={this.searchSubmit}>Search</button>
					</div>
				</form>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>

					{mode === 'pubs' && 
						pubs.map((pub, index)=> {
							return <PreviewPub key={'resultPub-' + index} pub={pub} />;
						})
					}

					{mode === 'users' && 
						users.map((user, index)=> {
							return <PreviewUser key={'resultUser-' + index} user={user} />;
						})
					}
					
					{mode === 'journals' && 
						journals.map((journal, index)=> {
							return <PreviewJournal key={'resultJournal-' + index} journal={journal} />;
						})
					}

					{mode === 'labels' && 
						labels.map((label, index)=> {
							return <div key={'resultLabel-' + index}>{label.title}</div>;
						})
					}

					{mode === 'loading' && 
						<Spinner />
					}

				</NavContentWrapper>

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		searchData: state.search.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Search));

styles = {
	container: {
		padding: '2em 1em',
	},
	// searchForm: {
	// 	position: 'relative',
	// 	display: 'table',
	// },
	// searchIcon: {
	// 	position: 'absolute',
	// },
	// searchInput: {
	// 	fontSize: '2.5em',
	// 	width: 'calc(100% - 4px)',
	// 	paddingLeft: '50px',
	// 	display: 'table-cell',
	// },
	// searchButton: {
	// 	display: 'table-cell',
	// 	width: '1%',
	// },
};
