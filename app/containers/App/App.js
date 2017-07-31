import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import { getAppData } from 'actions/app';

require('./blueprint.scss');
require('./app.scss');


const LandingMain = () => <Async load={import('containers/LandingMain/LandingMain')} />;
const LandingCommunity = () => <Async load={import('containers/LandingCommunity/LandingCommunity')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;


const propTypes = {
	dispatch: PropTypes.func.isRequired,
	appData: PropTypes.object.isRequired,
};

class App extends Component {
	componentWillMount() {
		// const hostname = 'viral.pubpub.org';
		const hostname = 'www.pubpub.org';
		this.props.dispatch(getAppData(hostname));
	}

	render() {
		const appData = this.props.appData;
		const title = appData.title || 'PubPub';
		const description = appData.description || 'Collaborative Community Publishing';
		const isMain = true; // window.location.hostname === 'www.pubpub.org';
		return (
			<div>
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Helmet>
				<style>{'.accent-background { background-color: #caff00; } .accent-color { color: black; }'}</style>

				<Header />

				<Switch>
					<Route exact path="/" component={isMain ? LandingMain : LandingCommunity} />
					<Route path="/*" component={NoMatch} />
				</Switch>
			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(App));
