import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Tabs, Tab, TabList, TabPanel, Spinner } from '@blueprintjs/core';

// import { globalStyles } from 'utils/globalStyles';
// import { globalMessages } from 'utils/globalMessages';
// import { FormattedMessage } from 'react-intl';

import { search } from './actions';

let styles;

export const Search = React.createClass({
	propTypes: {
		searchData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	statics: {
		readyOnActions: function(dispatch, params, location) {
			return Promise.all([
				dispatch(search(location.query.q))
			]);
		}
	},

	componentDidMount() {
		this.props.dispatch(search(this.props.location.query.q));
	},

	getInitialState() {
		return {
			searchString: '',
		};
	},

	componentWillMount() {
		this.setState({ searchString: this.props.location.query.q });
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.query.q !== this.state.searchString) {
			this.setState({ searchString: nextProps.location.query.q });	
		}
	},

	searchUpdate: function(evt) {
		const value = evt.target.value || '';
		this.setState({ searchString: value });
	},

	searchSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(search(this.state.searchString));	
		browserHistory.push('/search?q=' + this.state.searchString);
	},
	render() {
		const searchData = this.props.searchData || {};
		
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
							<input type="text" className="pt-input pt-large" value={this.state.searchString} onChange={this.searchUpdate} placeholder="Search" style={{minWidth: '400px'}}/>
						</div>
						<button className="pt-button pt-intent-primary pt-large" onClick={this.searchSubmit}>Search</button>
					</div>
				</form>


				{this.props.searchData.loading &&
					<Spinner />
				}

				{!this.props.searchData.loading &&
					<p>{JSON.stringify(searchData.results)}</p>
				}

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
