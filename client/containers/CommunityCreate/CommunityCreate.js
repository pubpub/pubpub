import React, { useState } from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { ColorInput, GridWrapper, InputField, ImageUpload } from 'components';
import { apiFetch, slugifyString } from 'utils';
import { usePageContext } from 'utils/hooks';

require('./communityCreate.scss');

const CommunityCreate = () => {
	const { loginData } = usePageContext();
	const [subdomain, subdomainSetter] = useState('');
	const [title, titleSetter] = useState('');
	const [description, descriptionSetter] = useState('');
	const [heroLogo, heroLogoSetter] = useState('');
	const [accentColorDark, accentColorDarkSetter] = useState('#2D2E2F');
	const [accentColorLight, accentColorLightSetter] = useState('#FFFFFF');
	const [createIsLoading, createIsLoadingSetter] = useState(false);
	const [createError, createErrorSetter] = useState(undefined);

	const onCreateSubmit = (evt) => {
		evt.preventDefault();
		createIsLoadingSetter(true);
		createErrorSetter(true);
		return apiFetch('/api/communities', {
			method: 'POST',
			body: JSON.stringify({
				subdomain: subdomain,
				title: title,
				description: description,
				headerLogo: heroLogo,
				heroLogo: heroLogo,
				accentColorLight: accentColorLight,
				accentColorDark: accentColorDark,
			}),
		})
			.then(() => {
				createIsLoadingSetter(false);
				createErrorSetter(undefined);

				window.location.href = `https://${subdomain}.pubpub.org`;
			})
			.catch((err) => {
				createIsLoadingSetter(false);
				createErrorSetter(err);
			});
	};
	const onSubdomainChange = (evt) => {
		subdomainSetter(slugifyString(evt.target.value));
	};

	const onTitleChange = (evt) => {
		titleSetter(evt.target.value);
	};

	const onDescriptionChange = (evt) => {
		descriptionSetter(evt.target.value.substring(0, 280).replace(/\n/g, ' '));
	};

	const onHeroHeaderLogoChange = (val) => {
		heroLogoSetter(val);
	};
	return (
		<div id="community-create-container">
			<GridWrapper containerClassName="small">
				{!loginData.id && (
					<NonIdealState
						title="To create your community, create an account or login."
						visual="error"
						action={
							<a href="/login?redirect=/community/create" className="bp3-button">
								Login or Signup
							</a>
						}
					/>
				)}
				{loginData.id && (
					<div>
						<h1>Create Community</h1>
						<form onSubmit={onCreateSubmit}>
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
										accentColorLightSetter(val.hex);
									}}
								/>
							</InputField>
							<InputField label="Dark Accent Color">
								<ColorInput
									value={accentColorDark}
									onChange={(val) => {
										accentColorDarkSetter(val.hex);
									}}
								/>
							</InputField>
							<InputField error={createError}>
								<Button
									name="create"
									type="submit"
									className="bp3-button bp3-intent-primary create-account-button"
									onClick={onCreateSubmit}
									text="Create Community"
									disabled={!subdomain || !title}
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
