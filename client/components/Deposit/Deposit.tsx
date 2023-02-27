import React, { useEffect, useState } from 'react';

import Doi from 'client/containers/DashboardSettings/PubSettings/Doi';
import { Collection, DepositTarget, InitialCommunityData, Pub } from 'types';
import { assert } from 'utils/assert';
import DataciteDeposit from './DataciteDeposit';
import { Resource } from 'deposit/resource';
import { apiFetch } from 'client/utils/apiFetch';
import { Callout } from '@blueprintjs/core';

import './deposit.scss';
import { UpdateDoi } from './UpdateDoi';
import { PUBPUB_DOI_PREFIX } from 'utils/crossref/communities';

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

function extractDoiSuffix(doi: string, depositTarget?: DepositTarget) {
	const prefix = depositTarget?.doiPrefix ?? PUBPUB_DOI_PREFIX;
	return doi.replace(`${prefix}/`, '');
}

export default function Deposit(props: Props) {
	const { depositTarget } = props;
	const [resource, setResource] = useState<Resource>();
	const [doiSuffix, setDoiSuffix] = useState('');
	const [justSetDoi, setJustSetDoi] = useState(false);
	const doiPrefix = depositTarget?.doiPrefix ?? PUBPUB_DOI_PREFIX;
	const fetchResource = async () => {
		if ('pub' in props) {
			await apiFetch(`/api/pub/${props.pub.id}/resource`, { method: 'GET' }).then(
				(resource: Resource) => {
					const doi = resource.identifiers.find(
						(identifier) => identifier.identifierKind === 'DOI',
					);
					const doiSuffix = doi?.identifierValue.split('/')[1] ?? '';
					setResource(resource);
					setDoiSuffix(doiSuffix);
				},
			);
		} else {
			await apiFetch(`/api/collection/${props.collection.id}/resource`, {
				method: 'GET',
			}).then((resource: Resource) => {
				const doi = resource.identifiers.find(
					(identifier) => identifier.identifierKind === 'DOI',
				);
				const doiSuffix = doi?.identifierValue.split('/')[1] ?? '';
				setResource(resource);
				setDoiSuffix(doiSuffix);
			});
		}
	};
	const persistDoi = async (doi: string) => {
		if ('pub' in props) {
			const pubData = await apiFetch(`/api/pubs`, {
				method: 'PUT',
				body: JSON.stringify({
					doi,
					pubId: props.pub.id,
					communityId: props.communityData.id,
				}),
			});
			props.updatePub(pubData);
		} else {
			const collectionData = await apiFetch(`/api/collections`, {
				method: 'PUT',
				body: JSON.stringify({
					doi,
					id: props.collection.id,
					communityId: props.communityData.id,
				}),
			});
			props.updateCollection(collectionData);
		}
		await fetchResource();
	};
	const onDelete = async () => {
		await persistDoi('');
		setDoiSuffix('');
	};
	const onGenerate = async () => {
		const params = new URLSearchParams({
			target: 'pub',
			communityId: props.communityData.id,
		});

		if ('pub' in props) {
			params.append('pubId', props.pub.id);
		} else {
			params.append('collectionId', props.collection.id);
		}

		// Fetch a DOI preview which contains a newly generated DOI.
		const { dois } = await apiFetch(`/api/generateDoi?${params.toString()}`);
		const doi = 'pub' in props ? dois.pub : dois.collection;

		setDoiSuffix(extractDoiSuffix(doi, depositTarget));
	};
	const onUpdate = (doiSuffix: string) => {
		setDoiSuffix(doiSuffix);
	};
	const onSave = async () => {
		const doi = `${doiPrefix}/${doiSuffix}`;
		await persistDoi(doi);
	};
	const onDepositSuccess = () => {
		setJustSetDoi(true);
	};

	useEffect(() => {
		fetchResource();
	}, []);

	let deposit: React.ReactNode;

	if (depositTarget?.service === 'datacite') {
		deposit = <DataciteDeposit {...props} onDepositSuccess={onDepositSuccess} />;
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

	const disabledDueToNoReleases = 'pub' in props && props.pub.releases.length === 0;
	const crossrefDepositRecordId =
		'pub' in props
			? props.pub.crossrefDepositRecordId
			: props.collection.crossrefDepositRecordId;

	return (
		<div className="deposit">
			{disabledDueToNoReleases && (
				<Callout intent="warning">
					This Pub cannot be deposited because it has no published releases.
				</Callout>
			)}
			{resource && isSupplementTo(resource) && (
				<Callout intent="warning">
					The DOI for this Pub is not editable because it is a <strong>Supplement</strong>{' '}
					to another Pub.
				</Callout>
			)}
			{resource && (
				<UpdateDoi
					doiSuffix={doiSuffix}
					doiPrefix={doiPrefix}
					editable={!isSupplementTo(resource) && !crossrefDepositRecordId && !justSetDoi}
					onDelete={onDelete}
					onGenerate={onGenerate}
					onUpdate={onUpdate}
					onSave={onSave}
				/>
			)}
			{deposit}
		</div>
	);
}
