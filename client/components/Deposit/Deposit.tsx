import React from 'react';

import Doi from 'client/containers/DashboardSettings/PubSettings/Doi';
import { Collection, DepositTarget, InitialCommunityData, Pub } from 'types';
import { assert } from 'utils/assert';
import DataciteDeposit from './DataciteDeposit';

type PubProps = {
	pub: Pub;
	updatePub: (...args: any[]) => any;
};

type CollectionProps = {
	collection: Collection;
	updateCollection: (...args: any[]) => any;
};

type Props = {
	canIssueDoi: boolean;
	communityData: InitialCommunityData;
	depositTarget?: DepositTarget;
} & (PubProps | CollectionProps);

export default function Deposit(props: Props) {
	const { depositTarget } = props;
	if (depositTarget?.service === 'datacite') {
		return <DataciteDeposit {...props} />;
	}
	assert('pub' in props);
	return (
		<Doi
			canIssueDoi={props.canIssueDoi}
			communityData={props.communityData}
			updatePubData={props.updatePub}
			pubData={props.pub}
			depositTarget={props.depositTarget}
		/>
	);
}
