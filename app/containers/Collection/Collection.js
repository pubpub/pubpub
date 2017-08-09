import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import PubPreview from 'components/PubPreview/PubPreview';
import Footer from 'components/Footer/Footer';

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Collection extends Component {

	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		// On appdata load - get a list of all pages - so we can show titles and check slugs immediately.

		if (this.props.match.params.slug === undefined) {
			console.log('On Home page');
		}

		return (
			<div>
				<Helmet>
					{/*<title>{appData.title}</title>
					<meta name="description" content={appData.description} />*/}
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>{this.props.match.params.slug}</h1>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(Collection));
