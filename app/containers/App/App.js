import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import { getAppData } from 'actions/app';
import { contrastText, calculateHues } from 'utilities';

require('./app.scss');

const LandingMain = () => <Async load={import('containers/LandingMain/LandingMain')} />;
const LandingCommunity = () => <Async load={import('containers/LandingCommunity/LandingCommunity')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	appData: PropTypes.object.isRequired,
};

/* Dev Only */
const hostname = 'viral.pubpub.org';
// const hostname = 'www.pubpub.org';
/* ------- */

class App extends Component {
	componentWillMount() {
		this.props.dispatch(getAppData(hostname));
	}

	render() {
		const appData = this.props.appData;
		const title = appData.title || 'PubPub';
		const description = appData.description || 'Collaborative Community Publishing';
		const favicon = appData.avatar || '/icon.png';
		const isCommunity = hostname !== 'www.pubpub.org'; // window.location.hostname !== 'www.pubpub.org';
		const accentColor = appData.accentColor || 'transparent';
		const logo = appData.logo || 'https://assets.pubpub.org/_site/logo_dark.png';
		const accentTextColor = contrastText(accentColor);
		const accentHues = calculateHues(accentColor);
		return (
			<div>
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
					<link rel="icon" type="image/png" sizes="192x192" href={favicon} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={favicon} />
				</Helmet>
				{/* Create a Style component that has the below stuff 
				- and takes in accentColor, etc as props */}
				<style>{`
					.accent-background { background-color: ${accentColor}; } 
					.accent-color { color: ${accentTextColor}; }
					.pt-button.pt-intent-primary { background-color: ${accentHues[0]}; color: ${accentTextColor};}
					.pt-button.pt-intent-primary:hover { background-color: ${accentHues[1]}; color: ${accentTextColor};}
					.pt-button.pt-intent-primary:active, .pt-button.pt-intent-primary.pt-active { background-color: ${accentHues[2]}; color: ${accentTextColor};}
				`}</style>

				<Header isHome={false} logo={logo} />

				<Switch>
					<Route exact path="/" component={isCommunity ? LandingCommunity : LandingMain} />
					<Route path="/*" component={NoMatch} />
				</Switch>
			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(App));
