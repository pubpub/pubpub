import React from 'react';

import Doi from 'client/containers/DashboardSettings/PubSettings/Doi';
import { Collection, DepositTarget, InitialCommunityData, Pub } from 'types';
import { assert } from 'utils/assert';
import AssignDoi from '../AssignDoi/AssignDoi';
import DataciteDeposit from './DataciteDeposit';

type Props = {
	canIssueDoi: boolean;
	communityData: InitialCommunityData;
	depositTarget: DepositTarget;
} & (
	| {
			pubData: Pub;
			updatePubData: (...args: any[]) => any;
	  }
	| {
			collectionData: Collection;
			updateCollectionData: (...args: any[]) => any;
	  }
);

export default function Deposit(props: Props) {
	const { depositTarget } = props;
	if (depositTarget?.service === 'datacite') {
		return <DataciteDeposit {...props} />;
	}
	assert('pubData' in props);
	return (
		<Doi
			canIssueDoi={props.canIssueDoi}
			communityData={props.communityData}
			updatePubData={props.updatePubData}
			pubData={props.pubData}
			depositTarget={props.depositTarget}
		/>
	);
}
