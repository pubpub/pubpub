import React, { useState } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';

import { Submission, Pub, PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { getDashUrl } from 'utils/dashboard';
import { usePendingChanges } from 'utils/hooks';

type Props = {
	onUpdatePub?: (pub: Partial<Pub>) => unknown;
	onUpdateSubmission?: (submission: Partial<Submission>) => unknown;
	pubData: PubPageData;
};

const TitleDescriptionAbstract = (props: Props) => {
	const { onUpdatePub, onUpdateSubmission } = props;
	const [pendingPubData, setPendingPubData] = useState({});
	const [isPersisting, setIsPersisting] = useState(false);
	const [persistedPubData, setPersistedPubData] = useState(props.pubData);

	const { pendingPromise } = usePendingChanges();

	console.log(onUpdatePub, onUpdateSubmission);

	const updatePubData = (values) => {
		setPendingPubData({ ...pendingPubData, ...values });
	};
	const handleSaveChanges = () => {
		setIsPersisting(true);
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
				setIsPersisting(false);
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
				setIsPersisting(false);
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
				<InputGroup id="text-input" placeholder="Enter description text here..." />
			</FormGroup>
			<br />
			Pub Content Enter your primary submission content in the pub body below by typing or by
			importing files in which you already have content prepared.
		</>
	);
};

export default TitleDescriptionAbstract;
