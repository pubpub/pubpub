import React, { useState } from 'react';

import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';

import GlobalControlsButton from './GlobalControlsButton';
import { client } from 'utils/api/router';

const CreatePubButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { communityData } = usePageContext();

	const handleCreatePub = () => {
		setIsLoading(true);
		return client
			.post('/api/pubs', { body: { communityId: communityData.id } })
			.then((newPub) => {
				console.log('using new thing');
				window.location.href = `/pub/${newPub.slug}`;
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(false);
			});
	};

	return (
		<GlobalControlsButton
			loading={isLoading}
			aria-label="Create Pub"
			onClick={handleCreatePub}
			desktop={{ text: 'Create Pub' }}
			mobile={{ icon: 'pubDocNew' }}
		/>
	);
};

export default CreatePubButton;
