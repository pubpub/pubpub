import React, { useEffect, useState } from 'react';

import Doi from 'client/containers/DashboardSettings/PubSettings/Doi';
import { Collection, DepositTarget, InitialCommunityData, Pub } from 'types';
import { assert } from 'utils/assert';
import DataciteDeposit from './DataciteDeposit';
import { Resource } from 'deposit/resource';
import { apiFetch } from 'client/utils/apiFetch';
import { Callout } from '@blueprintjs/core';

import './deposit.scss';

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

function isSupplementTo(resource: Resource) {
	return resource.relationships.some(
		(relationship) => relationship.relation === 'Supplement' && relationship.isParent,
	);
}

export default function Deposit(props: Props) {
	const { depositTarget } = props;
	const [resource, setResource] = useState<Resource>();

	useEffect(() => {
		if ('pub' in props) {
			apiFetch(`/api/pub/${props.pub.id}/resource`, { method: 'GET' }).then((resource) => {
				setResource(resource);
			});
		}
	}, []);

	let deposit: React.ReactNode;

	if (depositTarget?.service === 'datacite') {
		deposit = <DataciteDeposit {...props} />;
	} else {
		assert('pub' in props);
		deposit = (
			<Doi
				canIssueDoi={props.canIssueDoi}
				communityData={props.communityData}
				updatePubData={props.updatePub}
				pubData={props.pub}
				depositTarget={props.depositTarget}
			/>
		);
	}

	return (
		<div className="deposit">
			{resource && isSupplementTo(resource) && (
				<Callout intent="warning">
					The DOI for this Pub is not editable because it is a <strong>Supplement</strong>{' '}
					to another Pub.
				</Callout>
			)}
			{deposit}
		</div>
	);
}
