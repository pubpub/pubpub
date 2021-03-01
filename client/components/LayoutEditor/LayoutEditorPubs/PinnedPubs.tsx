import React from 'react';

import { OrderPicker } from 'components';
import { Pub } from 'utils/types';

type Props = {
	collectionIds: string[];
	pubIds: string[];
	pubsInBlock: Pub[];
	onPubIds: (nextPubIds: string[]) => unknown;
};

const PinnedPubs = (props: Props) => {
	const { pubIds, collectionIds, pubsInBlock, onPubIds } = props;
	return (
		<OrderPicker
			selectedItems={(pubIds || []).map((pubId) => pubsById[pubId]).filter((x) => x)}
			allItems={availablePubs}
			onChange={setPubIds}
			uniqueId={String(layoutIndex)}
			selectedTitle="Pinned Pubs"
			availableTitle="Available Pubs"
			selectedTitleTooltip="Pinned pubs will be displayed first, followed by newest pubs."
		/>
	);
};

export default PinnedPubs;
