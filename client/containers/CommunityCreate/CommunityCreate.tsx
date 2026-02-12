import React, { useRef, useState } from 'react';

import { Button, Checkbox, Classes, NonIdealState } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';
import { Altcha, ColorInput, GridWrapper, Honeypot, ImageUpload, InputField } from 'components';
import { usePageContext } from 'utils/hooks';
import { slugifyString } from 'utils/strings';

import './communityCreate.scss';

const CommunityCreate = () => {
	const { loginData } = usePageContext();
	const altchaRef = useRef<import('components').AltchaRef>(null);
	const [subdomain, setSubdomain] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [heroLogo, setHeroLogo] = useState('');
	const [accentColorDark, setAccentColorDark] = useState('#2D2E2F');
	const [accentColorLight, setAccentColorLight] = useState('#FFFFFF');
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [createIsLoading, setCreateIsLoading] = useState(false);
	const [createError, setCreateError] = useState<string | undefined>(undefined);

	const onCreateSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		setCreateIsLoading(true);
		if (!acceptTerms) return false;
		const formData = new FormData(evt.currentTarget);
		const honeypot = (formData.get('website') as string) ?? '';
		const payload = {
			subdomain,
			title,
			description,
			headerLogo: heroLogo,
			heroLogo,
			accentColorLight,
			accentColorDark,
			_honeypot: honeypot,
		};
		const altchaPayload = await altchaRef.current?.verify();
		if (!altchaPayload) {
			setCreateIsLoading(false);
			return;
		}
		try {
			const newCommunity = await apiFetch.post<string>('/api/communities', {
				...payload,
				altcha: altchaPayload,
			});
			window.location.href = newCommunity;
			setCreateIsLoading(false);
		} catch (error) {
			setCreateIsLoading(false);
			setCreateError((error as Error).message);
			return;
		}
	};
	const onSubdomainChange = (evt) => {
		setSubdomain(slugifyString(evt.target.value));
	};

	const onTitleChange = (evt) => {
		setTitle(evt.target.value);
	};

	const onDescriptionChange = (evt) => {
		setDescription(evt.target.value.substring(0, 280).replace(/\n/g, ' '));
	};

	const onHeroHeaderLogoChange = (val) => {
		setHeroLogo(val);
	};

	return (
		<div id="community-create-container">
			<GridWrapper containerClassName="small">
				{!loginData.id && (
					<NonIdealState
						title="To create your community, create an account or login."
						// @ts-expect-error ts-migrate(2322) FIXME: Type '{ title: string; visual: string; action: Ele... Remove this comment to see the full error message
						visual="error"
						action={
							<a href="/login?redirect=/community/create" className={Classes.BUTTON}>
								Login or Signup
							</a>
						}
					/>
				)}
				{loginData.id && (
					<div>
						<h1>Create Community</h1>
						<p>
							PubPub is evolving, and we are currently only allowing new community
							creation for existing users with an explicit short-term need. Learn more
							by reading our announcement. If you are an existing user who needs to
							create a community, please{' '}
							<a
								href="mailto:partnerships@knowledgefutures.org?mailto=PubPub%20Legacy%20Community"
								target="_blank"
								rel="noreferrer"
							>
								get in touch
							</a>
							.
						</p>
						<form onSubmit={onCreateSubmit}>
							<Honeypot name="website" />
							<InputField
								label="URL"
								isRequired={true}
								value={subdomain}
								onChange={onSubdomainChange}
								helperText={`https://${subdomain || '[URL]'}.pubpub.org`}
							/>
							<InputField
								label="Title"
								isRequired={true}
								value={title}
								onChange={onTitleChange}
							/>
							<InputField
								label="Description"
								isTextarea={true}
								value={description}
								onChange={onDescriptionChange}
								helperText={`${description.length}/280 characters`}
							/>
							<ImageUpload
								htmlFor="large-header-logo-upload"
								label="Community Logo"
								defaultImage={heroLogo}
								height={60}
								width={150}
								onNewImage={onHeroHeaderLogoChange}
								helperText="Used on the landing page. Suggested height: 200px"
							/>
							<InputField label="Light Accent Color">
								<ColorInput
									value={accentColorLight}
									onChange={(val) => {
										setAccentColorLight(val.hex);
									}}
								/>
							</InputField>
							<InputField label="Dark Accent Color">
								<ColorInput
									value={accentColorDark}
									onChange={(val) => {
										setAccentColorDark(val.hex);
									}}
								/>
							</InputField>
							<InputField>
								<Checkbox
									checked={acceptTerms}
									onChange={() => {
										setAcceptTerms(!acceptTerms);
									}}
								>
									I have read and agree to the PubPub{' '}
									<a href="/legal/terms" target="_blank">
										Terms of Service
									</a>{' '}
									and{' '}
									<a href="/legal/privacy" target="_blank">
										Privacy Policy
									</a>
									.
								</Checkbox>
							</InputField>
							<Altcha ref={altchaRef} auto="onload" />
							<InputField
								error={
									createError
										? createError === 'URL already used'
											? 'URL already in use by another community'
											: 'Error Creating Community'
										: undefined
								}
							>
								<Button
									name="create"
									type="submit"
									className={`${Classes.BUTTON} ${Classes.INTENT_PRIMARY} create-account-button`}
									text="Create Community"
									disabled={!subdomain || !title || !acceptTerms}
									loading={createIsLoading}
								/>
							</InputField>
						</form>
					</div>
				)}
			</GridWrapper>
		</div>
	);
};

export default CommunityCreate;
