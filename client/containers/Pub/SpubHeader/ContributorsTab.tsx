import React from 'react';
import { Label } from '@blueprintjs/core';

import { PubAttributionEditor } from 'components';
import { usePageContext } from 'utils/hooks';
import { Callback, Pub } from 'types';

import SpubHeaderTab from './SpubHeaderTab';

require('./contributorsTabComponent.scss');

type Props = {
	pubData: Pub;
	onUpdatePub: Callback<Partial<Pub>>;
};

const ContributorsTab = (props: Props) => {
	const { onUpdatePub, pubData } = props;
	const { communityData } = usePageContext();
	const contributorCount = pubData.attributions.length;

	return (
		<SpubHeaderTab className="contributors-tab-component">
			<Label>
				<h2 className="contributors-header">
					Contributors {contributorCount && `(${contributorCount})`}
				</h2>
				<PubAttributionEditor
					pubData={pubData}
					communityData={communityData}
					updatePubData={onUpdatePub}
					canEdit
				/>
			</Label>
		</SpubHeaderTab>
	);
};

export default ContributorsTab;
