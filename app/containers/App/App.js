import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import CommunityHeader from 'components/CommunityHeader/CommunityHeader';
import PubPreview from 'components/PubPreview/PubPreview';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import NavBar from 'components/NavBar/NavBar';
import Footer from 'components/Footer/Footer';
import { getAppData } from 'actions/app';

require('./app.scss');

const LandingMain = () => <Async load={import('containers/LandingMain/LandingMain')} />;
const LandingCommunity = () => <Async load={import('containers/LandingCommunity/LandingCommunity')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;

const navItems = [
	{
		slug: '/home',
		title: 'Home',
		id: 1,
	},
	{
		slug: '/sensors',
		title: 'Sensors',
		id: 2,
	},
	{
		id: 3.5,
		title: 'Issues',
		children: [
			{
				slug: '/2017',
				title: '2017',
				id: 21,
			},
			{
				slug: '/2016',
				title: '2016',
				id: 22,
			},
			{
				slug: '/2018',
				title: 'Super Long 2018 Edition Extravaganza',
				id: 23,
			},
		]
	},
	{
		slug: '/meeting-notes',
		title: 'Meeting-Notes',
		id: 3,
	},
	{
		slug: '/blockchain',
		title: 'Blockchain',
		id: 4,
	},
	{
		slug: '/new-ideas',
		title: 'New Ideas',
		id: 5,
	},
	{
		slug: '/bad-ideas',
		title: 'Bad-Ideas',
		id: 6,
	},
	{
		slug: '/submissions',
		title: 'Submissions',
		id: 7,
	},
	{
		slug: '/about',
		title: 'About',
		id: 8,
	},
];

const contributors = [1, 2, 3, 4, 5];
const authors = [
	{
		id: 0,
		userInitials: 'TR',
		userAvatar: '/dev/trich.jpg',
	},
	{
		id: 1,
		userInitials: 'MW',
	},
	{
		id: 2,
		userInitials: 'TW',
		userAvatar: '/dev/tomer.jpg',
	},
];

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class App extends Component {
	static logoutHandler() {
		console.log('Logout');
	}

	componentWillMount() {
		this.hostname = window.location.hostname === 'localhost' || window.location.hostname === 'v4test.netlify.com'
			? 'viral.pubpub.org' // Set whatever hostname you want to develop with
			: window.location.hostname; // In production, use the real hostname

		this.props.dispatch(getAppData(this.hostname));
	}

	render() {
		const appData = {
			title: 'PubPub',
			description: 'Collaborative Community Publishing',
			avatar: '/icon.png',
			accentColor: undefined,
			logo: 'https://assets.pubpub.org/_site/logo_dark.png',
			...this.props.appData // Override defaults with real community data
		};

		const isCommunity = this.hostname !== 'www.pubpub.org';

		return (
			<div>
				<Helmet>
					<title>{appData.title}</title>
					<meta name="description" content={appData.description} />
					<link rel="icon" type="image/png" sizes="192x192" href={appData.avatar} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={appData.avatar} />
				</Helmet>

				<AccentStyle
					accentColor={'#D13232'}
					accentTextColor={'#FFF'}
					accentActionColor={'#A72828'}
					accentHoverColor={'#BC2D2D'}
					accentMinimalColor={'rgba(209, 50, 50, 0.15)'}
				/>

				<Header
					userName={'Maggie Farnkrux'}
					userSlug={'maggiefarn'}
					userAvatar={'/dev/maggie.jpg'}
					userIsAdmin={true}
					pageSlug={this.props.location.pathname.substring(1, this.props.location.pathname.length)}
					pageBackground={'/dev/homeBackground.png'}
					appLogo={'/dev/viralLogo.png'}
					logoutHandler={App.logoutHandler}
				/>

				{this.props.location.pathname.substring(1, this.props.location.pathname.length) === '' &&
					<CommunityHeader
						logo={'/dev/viralLogo.png'}
						description={'Group publications and research docs from around the world all situated here in this little community.'}
						backgroundImage={'/dev/homeBackground.png'}
					/>
				}

				<NavBar navItems={navItems} />
				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner1.jpg'}
								isLarge={true}
								publicationDate={String(new Date())}
								contributors={contributors}
								authors={authors}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner1.jpg'}
								isLarge={false}
								publicationDate={String(new Date())}
								contributors={contributors}
								authors={authors}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner2.jpg'}
								isLarge={false}
								publicationDate={String(new Date())}
								contributors={[]}
								authors={[authors[2]]}
							/>
						</div>
					</div>
				</div>

				{/*<Switch>
					<Route exact path="/" component={isCommunity ? LandingCommunity : LandingMain} />
					<Route path="/*" component={NoMatch} />
				</Switch>*/}

				<Footer />
			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(App));
