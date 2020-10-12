import React from 'react';

import { DashboardFrame, SettingsSection, LayoutEditor } from 'components';
import { usePageContext } from 'utils/hooks';
import { Collection, Pub } from 'utils/types';

type Props = {
	collection: Collection;
	pubs: Pub[];
};

const DashboardCollectionLayout = (props: Props) => {
	const { collection, pubs } = props;
	const { communityData } = usePageContext();

	return (
		<DashboardFrame
			className="dashboard-collection-layout-container"
			title="Layout"
			details="Change how this Collection is presented to readers."
		>
			<SettingsSection title="Blocks">
				<LayoutEditor
					initialLayout={[] as any[]}
					pubs={pubs}
					collectionId={collection.id}
					communityData={communityData}
					onChange={() => {}}
				/>
			</SettingsSection>
		</DashboardFrame>
	);
};
export default DashboardCollectionLayout;
