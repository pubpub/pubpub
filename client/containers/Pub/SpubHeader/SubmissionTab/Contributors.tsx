import React, { useState } from 'react';
import { PubAttributionEditor } from 'components';

import { pubData, communityData } from 'utils/storybook/data';

const Contributors = () => {
	const [persistedPubData, setPersistedPubData] = useState(pubData);
	const updatePersistedPubData = (values) => {
		setPersistedPubData({ ...persistedPubData, ...values });
	};

	return (
		<div>
			<p>
				Add the names, roles & affiliations of other people who have a part to play in the
				creation of this submission’s content.
			</p>
			<PubAttributionEditor
				pubData={pubData}
				communityData={communityData}
				updatePubData={updatePersistedPubData}
				canEdit
			/>
		</div>
	);
};

export default Contributors;
