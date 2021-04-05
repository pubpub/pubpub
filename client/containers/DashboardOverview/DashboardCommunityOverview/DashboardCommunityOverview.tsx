import React from 'react';

import { DashboardFrame } from 'components';
import { Collection, Pub, DefinitelyHas } from 'utils/types';
import CommunityItems from './CommunityItems';

type Props = {
	overviewData: {
		collections: Collection[];
		pubs: DefinitelyHas<Pub, 'attributions'>[];
	};
};

const DashboardCommunityOverview = (props: Props) => {
	const { overviewData } = props;
	const { pubs, collections } = overviewData;
	return (
		<DashboardFrame title="Overview">
			<CommunityItems initialPubs={pubs} collections={collections} />
		</DashboardFrame>
	);
};

export default DashboardCommunityOverview;
