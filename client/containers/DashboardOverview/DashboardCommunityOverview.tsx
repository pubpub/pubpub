import React from 'react';

import { DashboardFrame } from 'components';
import { Collection, Pub, DefinitelyHas } from 'utils/types';

type Props = {
	overviewData: {
		collections: Collection[];
		pub: DefinitelyHas<Pub, 'attributions'>[];
	};
};

const DashboardCommunityOverview = () => {
	return <DashboardFrame title="Overview">Hello there</DashboardFrame>;
};

export default DashboardCommunityOverview;
