import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>Pub</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>

							<h1>Here is a title</h1>
							<Link className={'pt-button pt-intent-primary'} to={'/pub/my-article/edit'}>Collaborate</Link>
							{/*
								Pub Header
								Pub Contributors
								Pub Content
								Pub License
							*/}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(PubPresentation));
