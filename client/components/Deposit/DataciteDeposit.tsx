import { Button } from '@blueprintjs/core';
import React, { useCallback } from 'react';

import { Collection, Pub } from 'types';

import { apiFetch } from 'client/utils/apiFetch';

import './dataciteDeposit.scss';
import { DataciteDepositPreview } from './DataciteDepositPreview';

type Props = { pub: Pub } | { collection: Collection };

export default function DataciteDeposit(props: Props) {
	const depositUrl =
		'pub' in props
			? `/api/pub/${props.pub.id}/doi`
			: `/api/collection/${props.collection.id}/doi`;
	const previewUrl = `${depositUrl}/preview`;
	const handleDepositClick = useCallback(() => {
		apiFetch(depositUrl, { method: 'POST' })
			.then((json) => {
				console.log(json);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div className="datacite-deposit">
			<p>Expand the resource below to preview the Datacite deposit before it is submitted.</p>
			<DataciteDepositPreview previewUrl={previewUrl} />
			<Button onClick={handleDepositClick}>Deposit</Button>
		</div>
	);
}
