import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

require('./search.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Search extends Component {
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
						</div>
					</div>
				</div>

			</div>
		);
	}
}

Search.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app
}))(Search));
