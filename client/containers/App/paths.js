import React from 'react';
import {
	About,
	AdminDashboard,
	CommunityCreate,
	Dashboard,
	DashboardMembers,
	DashboardOverview,
	Explore,
	Landing,
	Login,
	NoMatch,
	Page,
	PasswordReset,
	Pricing,
	Privacy,
	Pub,
	Search,
	Signup,
	Terms,
	User,
	UserCreate,
} from 'containers';

export default (viewData, locationData, chunkName) => {
	const paths = {
		About: {
			activeComponent: () => <About {...viewData} />,
			hideNav: locationData.isBasePubPub,
		},
		AdminDashboard: {
			activeComponent: () => <AdminDashboard {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		CommunityCreate: {
			activeComponent: () => <CommunityCreate {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Dashboard: {
			activeComponent: () => <Dashboard {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		DashboardMembers: {
			activeComponent: () => <DashboardMembers {...viewData} />,
			isDashboard: true,
		},
		DashboardOverview: {
			activeComponent: () => <DashboardOverview {...viewData} />,
			isDashboard: true,
		},
		Login: {
			activeComponent: () => <Login {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Pub: {
			activeComponent: () => <Pub {...viewData} />,
		},
	};
	return paths[chunkName];
};
