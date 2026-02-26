import type * as types from 'types';

import React, { useCallback, useRef, useState } from 'react';

import { apiFetch } from 'client/utils/apiFetch';
import { Altcha, Honeypot } from 'components';
import { usePageContext } from 'utils/hooks';

import GlobalControlsButton from './GlobalControlsButton';

const CreatePubButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const altchaRef = useRef<import('components').AltchaRef>(null);
	const { communityData } = usePageContext();

	const handleCreatePub = useCallback(
		async (evt: React.FormEvent<HTMLFormElement>) => {
			evt.preventDefault();
			const formData = new FormData(evt.currentTarget);
			const honeypot = (formData.get('description') as string) ?? '';
			setIsLoading(true);
			try {
				const altchaPayload = await altchaRef.current?.verify();
				if (!altchaPayload) return;
				const newPub = await apiFetch.post<types.Pub>('/api/pubs/fromForm', {
					communityId: communityData.id,
					altcha: altchaPayload,
					_honeypot: honeypot,
				});
				window.location.href = `/pub/${newPub.slug}`;
			} catch (error) {
				console.error('Error in handleCreatePub', error);
			} finally {
				setIsLoading(false);
			}
		},
		[communityData.id],
	);

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<form
			onSubmit={handleCreatePub}
			ref={formRef}
			// only relevant in dev
			style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
		>
			<Altcha
				ref={altchaRef}
				onStateChange={(state) => {
					if (!isLoading) {
						setIsLoading(true);
					}
					// 	@ts-ignore
					if (state.detail.state === 'verified') {
						setIsLoading(false);
					}
				}}
			/>
			<Honeypot name="description" />
			<GlobalControlsButton
				loading={isLoading}
				aria-label="Create Pub"
				type="submit"
				desktop={{ text: 'Create Pub' }}
				mobile={{ icon: 'pubDocNew' }}
			/>
		</form>
	);
};

export default CreatePubButton;
