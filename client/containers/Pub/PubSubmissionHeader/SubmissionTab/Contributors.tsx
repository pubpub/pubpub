import React, { useState } from 'react';
import { PubAttributionEditor } from 'components';

import { pubData, communityData } from 'utils/storybook/data';

const Contributors = () => {
	const [persistedPubData, setPersistedPubData] = useState(pubData);
	const updatePersistedPubData = (values) => {
		setPersistedPubData({ ...persistedPubData, ...values });
	};

	const renderAttributions = () => {
		return (
			<PubAttributionEditor
				pubData={pubData}
				communityData={communityData}
				updatePubData={updatePersistedPubData}
				canEdit={true}
			/>
		);
	};
	return <>{renderAttributions()}</>;
};

export default Contributors;
