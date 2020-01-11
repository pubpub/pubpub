import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button, NonIdealState, Checkbox } from '@blueprintjs/core';
import { GridWrapper, InputField, ImageUpload, Icon } from 'components';
import { apiFetch } from 'utils';
import { gdprCookiePersistsSignup, getGdprConsentElection } from 'utils/gdprConsent';

require('./userCreate.scss');

const propTypes = {
	signupData: PropTypes.object.isRequired,
};

const UserCreate = (props) => {
	const { signupData } = props;
	const [postUserIsLoading, postUserIsLoadingSetter] = useState(false);
	const [postUserError, postUserErrorSetter] = useState(undefined);
	const [subscribed, subscribedSetter] = useState(false);
	const [firstName, firstNameSetter] = useState('');
	const [lastName, lastNameSetter] = useState('');
	const [password, passwordSetter] = useState('');
	const [title, titleSetter] = useState('');
	const [bio, bioSetter] = useState('');
	const [avatar, avatarSetter] = useState(undefined);
	const [location, locationSetter] = useState('');
	const [website, websiteSetter] = useState('');
	const [orcid, orcidSetter] = useState('');
	const [github, githubSetter] = useState('');
	const [twitter, twitterSetter] = useState('');
	const [facebook, facebookSetter] = useState('');
	const [googleScholar, googleScholarSetter] = useState('');
	const [showLocation, showLocationSetter] = useState(false);
	const [showWebsite, showWebsiteSetter] = useState(false);
	const [showOrcid, showOrcidSetter] = useState(false);
	const [showGithub, showGithubSetter] = useState(false);
	const [showTwitter, showTwitterSetter] = useState(false);
	const [showFacebook, showFacebookSetter] = useState(false);
	const [showGoogleScholar, showGoogleScholarSetter] = useState(false);
	const onCreateSubmit = (evt) => {
		evt.preventDefault();
		postUserIsLoadingSetter(true);
		postUserErrorSetter(undefined);

		return apiFetch('/api/users', {
			method: 'POST',
			body: JSON.stringify({
				email: signupData.email,
				hash: signupData.hash,
				subscribed: subscribed,
				firstName: firstName,
				lastName: lastName,
				password: SHA3(password).toString(encHex),
				avatar: avatar,
				title: title,
				bio: bio,
				location: location,
				website: website,
				orcid: orcid,
				github: github,
				twitter: twitter,
				facebook: facebook,
				googleScholar: googleScholar,
				gdprConsent: gdprCookiePersistsSignup() ? getGdprConsentElection() : null,
			}),
		})
			.then(() => {
				window.location.href = '/';
			})
			.catch((err) => {
				postUserIsLoadingSetter(false);
				postUserErrorSetter(err);
			});
	};
	const onSubscribedChange = () => {
		subscribedSetter(!subscribed);
	};

	const onFirstNameChange = (evt) => {
		firstNameSetter(evt.target.value);
	};

	const onLastNameChange = (evt) => {
		lastNameSetter(evt.target.value);
	};

	const onPasswordChange = (evt) => {
		passwordSetter(evt.target.value);
	};

	const onTitleChange = (evt) => {
		titleSetter(evt.target.value.substring(0, 70).replace(/\n/g, ' '));
	};

	const onBioChange = (evt) => {
		bioSetter(evt.target.value.substring(0, 280).replace(/\n/g, ' '));
	};

	const onAvatarChange = (val) => {
		avatarSetter(val);
	};
	const expandables = [
		{
			label: 'Location',
			showTextOnButton: true,
			icon: <Icon icon="map-marker" />,
			action: () => {
				showLocationSetter(true);
			},
			isVisible: showLocation,
			value: location,
			onChange: (evt) => {
				locationSetter(evt.target.value);
			},
		},
		{
			label: 'Website',
			showTextOnButton: true,
			icon: <Icon icon="link" />,
			action: () => {
				showWebsiteSetter(true);
			},
			isVisible: showWebsite,
			value: website,
			onChange: (evt) => {
				websiteSetter(evt.target.value);
			},
		},
		{
			label: 'Orcid',
			icon: <Icon icon="orcid" />,
			action: () => {
				showOrcidSetter(true);
			},
			isVisible: showOrcid,
			helperText: `https://orcid.org/${orcid}`,
			value: orcid,
			onChange: (evt) => {
				orcidSetter(evt.target.value);
			},
		},
		{
			label: 'Github',
			icon: <Icon icon="github" />,
			action: () => {
				showGithubSetter(true);
			},
			helperText: `https://github.com/${github}`,
			isVisible: showGithub,
			value: github,
			onChange: (evt) => {
				githubSetter(evt.target.value);
			},
		},
		{
			label: 'Twitter',
			icon: <Icon icon="twitter" />,
			action: () => {
				showTwitterSetter(true);
			},
			helperText: `https://twitter.com/${twitter}`,
			isVisible: showTwitter,
			value: twitter,
			onChange: (evt) => {
				twitterSetter(evt.target.value);
			},
		},
		{
			label: 'Facebook',
			icon: <Icon icon="facebook" />,
			action: () => {
				showFacebookSetter(true);
			},
			helperText: `https://facebook.com/${facebook}`,
			isVisible: showFacebook,
			value: facebook,
			onChange: (evt) => {
				facebookSetter(evt.target.value);
			},
		},
		{
			label: 'Google Scholar',
			icon: <Icon icon="google-scholar" />,
			action: () => {
				showGoogleScholarSetter(true);
			},
			helperText: `https://scholar.google.com/citations?user=${googleScholar}`,
			isVisible: showGoogleScholar,
			value: googleScholar,
			onChange: (evt) => {
				googleScholarSetter(evt.target.value);
			},
		},
	];
	return (
		<div id="user-create-container">
			{signupData.hashError && (
				<NonIdealState
					title="Signup URL Invalid"
					description={
						<div className="success">
							<p>This URL cannot be used to signup.</p>
							<p>Click below to restart the signup process.</p>
						</div>
					}
					visual="error"
					action={
						<a href="/signup" className="bp3-button">
							Signup
						</a>
					}
				/>
			)}

			{!signupData.hashError && (
				<GridWrapper containerClassName="small">
					<h1>Create Account</h1>
					<form onSubmit={onCreateSubmit}>
						<InputField label="Email" isDisabled={true} value={signupData.email} />
						<InputField
							label="First Name"
							isRequired={true}
							value={firstName}
							onChange={onFirstNameChange}
						/>
						<InputField
							label="Last Name"
							isRequired={true}
							value={lastName}
							onChange={onLastNameChange}
						/>
						<InputField
							label="Password"
							type="password"
							isRequired={true}
							value={password}
							onChange={onPasswordChange}
						/>
						<ImageUpload
							htmlFor="avatar-upload"
							label="Avatar Image"
							onNewImage={onAvatarChange}
							useCrop={true}
						/>
						<InputField
							label="Title"
							value={title}
							onChange={onTitleChange}
							helperText={`${title.length}/70 characters. Displayed by your name on discussions.`}
						/>
						<InputField
							label="Bio"
							isTextarea={true}
							value={bio}
							onChange={onBioChange}
							helperText={`${bio.length}/280 characters`}
						/>
						{expandables
							.filter((item) => {
								return item.isVisible;
							})
							.map((item) => {
								return (
									<InputField
										key={`input-field-${item.label}`}
										label={item.label}
										value={item.value}
										onChange={item.onChange}
										helperText={item.helperText}
									/>
								);
							})}

						{!!expandables.filter((item) => !item.isVisible).length && (
							<InputField label="Add More">
								<div className="bp3-button-group">
									{expandables
										.filter((item) => {
											return !item.isVisible;
										})
										.map((item) => {
											return (
												<button
													type="button"
													key={`button-${item.label}`}
													className="bp3-button expandable"
													onClick={item.action}
												>
													{item.icon}
													{item.showTextOnButton ? item.label : ''}
												</button>
											);
										})}
								</div>
							</InputField>
						)}

						<InputField wrapperClassName="bp3-callout" label="Stay Up To Date">
							<Checkbox
								label="Subscribe to our feature release & community newsletter."
								checked={subscribed}
								onChange={onSubscribedChange}
							/>
							<p className="notice">
								<em>
									We use a third party provider, Mailchimp, to deliver
									newsletters. We never share your data with anyone, and you can
									unsubscribe using the link at the bottom of every email. Learn
									more by visiting your&nbsp;
									<a href="/privacy">privacy settings</a>.
								</em>
							</p>
						</InputField>

						<InputField error={postUserError && 'Error Creating User'}>
							<Button
								name="create"
								type="submit"
								className="bp3-button bp3-intent-primary create-account-button"
								onClick={onCreateSubmit}
								text="Create Account"
								disabled={!firstName || !lastName || !password}
								loading={postUserIsLoading}
							/>
						</InputField>
					</form>
				</GridWrapper>
			)}
		</div>
	);
};

UserCreate.propTypes = propTypes;
export default UserCreate;
