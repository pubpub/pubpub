import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

require('./search.scss');

const propTypes = {
	// dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	searchData: PropTypes.object.isRequired,
};

class Search extends Component {
	constructor(props) {
		super(props);
		const queryObject = queryString.parse(this.props.location.search);
		this.state = {
			searchQuery: queryObject.q,
		};
	}

	render() {
		return (
			<div className={'search'}>

				<Helmet>
					<title>Search</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Search</h1>
							{JSON.stringify(this.props.searchData.results)}
						</div>
					</div>
				</div>

			</div>
		);
	}
}

Search.propTypes = propTypes;
export default withRouter(connect(state => ({
	searchData: state.search
}))(Search));
