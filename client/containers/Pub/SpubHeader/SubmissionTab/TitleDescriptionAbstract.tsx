import React, { useState } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';

import { PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { getDashUrl } from 'utils/dashboard';
import { usePendingChanges } from 'utils/hooks';

type Props = {
	pubData: PubPageData;
};

const TitleDescriptionAbstract = (props: Props) => {
	const [pendingPubData, setPendingPubData] = useState({});
	const [persistedPubData, setPersistedPubData] = useState(props.pubData);

	const { pendingPromise } = usePendingChanges();

	const updatePubData = (values) => {
		setPendingPubData({ ...pendingPubData, ...values });
	};
	const handleSaveChanges = () => {
		return pendingPromise(
			apiFetch('/api/pubs', {
				method: 'PUT',
				body: JSON.stringify({
					...pendingPubData,
					pubId: props.pubData.id,
					communityId: props.pubData.communityId,
				}),
			}),
		)
			.then(() => {
				const nextPubData = { ...persistedPubData, ...pendingPubData };
				setPendingPubData({});
				setPersistedPubData(nextPubData);
				if (persistedPubData.slug !== nextPubData.slug) {
					window.location.href = getDashUrl({
						pubSlug: nextPubData.slug,
						mode: 'settings',
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<>
			The information you enter in this form and pub body below will be used to create a
			submission pub, which you can preview at any time before making your final submission.
			<br />
			<br />
			<FormGroup label="Title of your submission pub " labelFor="text-input">
				<InputGroup
					id="text-input"
					placeholder="Enter pub title here..."
					onChange={(evt) => updatePubData({ title: evt.target.value })}
					onKeyPress={(evt) => evt.key === 'Enter' && handleSaveChanges()}
				/>
			</FormGroup>
			<br />
			<FormGroup label="Abstract Description " labelFor="text-input">
				<InputGroup id="text-input" placeholder="Enter abstruct here..." />
			</FormGroup>
			<br />
			<FormGroup label=" Description " labelFor="text-input">
				<InputGroup
					id="text-input"
					placeholder="Enter description text here..."
					onChange={(evt) => updatePubData({ description: evt.target.value })}
					onKeyPress={(evt) => evt.key === 'Enter' && handleSaveChanges()}
				/>
			</FormGroup>
			<br />
			Pub Content Enter your primary submission content in the pub body below by typing or by
			importing files in which you already have content prepared.
		</>
	);
};

export default TitleDescriptionAbstract;
