import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DashboardSide from 'components/DashboardSide/DashboardSide';

require('./dashboard.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Dashboard extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		const pages = [
	{
		title: 'About',
		slug: 'about',
		isPublic: true,
		id: 0,
	},
	{
		title: 'Guidelines',
		slug: 'guidelines',
		isPublic: true,
		id: 1,
	},
	{
		title: 'Pending Authors',
		slug: 'pending',
		isPublic: false,
		id: 2,
	}
];

const collections = [
	{
		title: 'Home',
		slug: 'home',
		isPublic: true,
		id: 3,
	},
	{
		title: 'Sensors',
		slug: 'sensors',
		isPublic: true,
		id: 4,
	},
	{
		title: 'Blockchain',
		slug: 'blockchain',
		isPublic: true,
		id: 5,
	},
	{
		title: 'Meeting Notes',
		slug: 'meeting-notes',
		isPublic: false,
		id: 6,
	},
	{
		title: 'Issue 2017',
		slug: '2017',
		isPublic: true,
		id: 7,
	},
	{
		title: 'Issue 2016',
		slug: '2016',
		isPublic: true,
		id: 8,
	},
	{
		title: 'Issue 2015',
		slug: '2015',
		isPublic: true,
		id: 9,
	},
	{
		title: 'Private Submissions',
		slug: 'private-submissions',
		isPublic: false,
		id: 10,
	},
	{
		title: 'Ideas',
		slug: 'ideas',
		isPublic: false,
		id: 11,
	},
	{
		title: 'Fresh Content',
		slug: 'fresh-content',
		isPublic: false,
		id: 12,
	},
];
		return (
			<div className={'dashboard'}>
				<Helmet>
					{/*<title>{appData.title}</title>
					<meta name="description" content={appData.description} />*/}
				</Helmet>

				<div className={'side-panel'}>
					<DashboardSide pages={pages} collections={collections} />
				</div>
				<div className={'content-panel'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<h1>Dashboard</h1>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
								<p>Here we are writing about a whole bunch of stuff that is fun and lots of fun. Wre writing about a whole bunch of stuff that is fun and lots of fun.</p>
							</div>
						</div>
					</div>
				</div>



			</div>
		);
	}
}

Dashboard.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(Dashboard));
