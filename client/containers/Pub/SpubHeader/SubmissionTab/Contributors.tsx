import React from 'react';
import { PubAttributionEditor } from 'components';

import { usePageContext } from 'utils/hooks';
import { PubPageData } from 'types';

type Props = {
	pubData: PubPageData;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
};

const Contributors = (props: Props) => {
	const { onUpdatePub, pubData } = props;
	const { communityData } = usePageContext();

	return (
		<div>
			<p>
				Add the names, roles & affiliations of other people who have a part to play in the
				creation of this submission's content.
			</p>
			<PubAttributionEditor
				pubData={pubData}
				communityData={communityData}
				updatePubData={onUpdatePub}
				canEdit
			/>
		</div>
	);
};

export default Contributors;
