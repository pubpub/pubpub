import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';

import { GridWrapper } from 'components';
import { DefinitelyHas, LandingPageFeature } from 'types';

import LandingPageFeaturesType from './LandingPageFeatures';
import Spam from './Spam';

require('./superAdminDashboard.scss');

type Props = {
	landingPageFeatures: DefinitelyHas<LandingPageFeature, 'pub' | 'community'>[];
};

const SuperAdminDashboard = (props: Props) => {
	const { landingPageFeatures } = props;
	return (
		<GridWrapper columnClassName="superadmin-dashboard-component">
			<h1>Superadmin Dashboard</h1>
			<p>Warning! Danger! etc.</p>
			<Tabs id="superadmin-dashboard" large>
				<Tab
					id="features"
					title="Landing Page"
					panel={<LandingPageFeaturesType features={landingPageFeatures} />}
				/>
				<Tab id="spam" title="Spam" panel={<Spam />} />
			</Tabs>
		</GridWrapper>
	);
};

export default SuperAdminDashboard;
