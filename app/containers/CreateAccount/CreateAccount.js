import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Button } from '@blueprintjs/core';
import Loader from 'components/Loader/Loader';
import ImageCropper from 'components/ImageCropper/ImageCropper';
import { globalStyles } from 'utils/globalStyles';

import { getSignUpData, createAccount } from './actions';

let styles;

export const CreateAccount = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		this.props.dispatch(getSignUpData(this.props.params.hash));
	},

	getInitialState() {
		return {
			userImageFile: null,
			userImageURL: 'https://assets.pubpub.org/_site/happyPub.png',
			username: '',
			firstName: '',
			lastName: '',
			password: '',
			bio: '',
			publicEmail: '',
			website: '',
			twitter: '',
			orcid: '',
			github: '',
			googleScholar: '',
			validationError: undefined,
			userEditedUsername: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.accountData.createAccountLoading;
		const nextLoading = nextProps.accountData.createAccountLoading;
		const nextError = nextProps.accountData.createAccountError;

		if (oldLoading && !nextLoading && !nextError) {
			const redirectRoute = this.props.location.query && this.props.location.query.redirect;
			browserHistory.push(redirectRoute || '/');
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		const firstName = key === 'firstName' ? value : this.state.firstName;
		const lastName = key === 'lastName' ? value : this.state.lastName;
		this.setState({ 
			[key]: value,
			username: !this.state.userEditedUsername ? `${firstName.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase()}${lastName ? '-' : ''}${lastName.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase()}` : this.state.username,
		});
	},

	inputUpdateUsername: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ 
			[key]: value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase(),
			userEditedUsername: true 
		});
	},

	bioUpdate: function(evt) {
		const bio = evt.target.value || '';
		// this.setState({ bio: bio.substring(0, 140) });
		this.setState({ bio: bio });
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({ userImageFile: evt.target.files[0] });
		}
	},

	cancelImageUpload: function() {
		this.setState({ userImageFile: null });
		document.getElementById('userImage').value = null;
	},

	userImageUploaded: function(url) {
		this.setState({ userImageFile: null, userImageURL: url });
		document.getElementById('userImage').value = null;
	},

	validate: function(data) {
		// Check to make sure username exists
		if (!data.username || !data.username.length) {
			return { isValid: false, validationError: 'Username required' };
		}

		// Check to make sure firstName exists
		if (!data.firstName || !data.firstName.length) {
			return { isValid: false, validationError: 'First Name required' };
		}

		// Check to make sure lastName exists
		if (!data.lastName || !data.lastName.length) {
			return { isValid: false, validationError: 'Last Name required' };
		}

		// Check to make sure email exists
		if (!data.email || !data.email.length) {
			return { isValid: false, validationError: 'Email required' };
		}

		// Check to make sure email is lightly valid (complete validation is impossible in JS - so just check for the most common error)
		const regexTest = /\S+@\S+/;
		if (!regexTest.test(data.email)) {
			return { isValid: false, validationError: 'Email is invalid' };
		}

		// Check to make sure password exists
		if (!data.password || data.password.length < 8) {
			return { isValid: false, validationError: 'Password too short' };
		}

		return { isValid: true, validationError: undefined };

	},

	createAccountSubmit: function(evt) {
		evt.preventDefault();
		const accountData = this.props.accountData || {};
		const user = accountData.user || {};
		const createAccountData = {
			email: user.email.trim(),
			hash: this.props.params.hash,
			username: this.state.username.trim(),
			firstName: this.state.firstName.trim(),
			lastName: this.state.lastName.trim(),
			password: this.state.password,
			avatar: this.state.userImageURL,
			bio: this.state.bio.trim(),
			publicEmail: this.state.publicEmail.trim(),
			website: this.state.website.trim(),
			twitter: this.state.twitter.trim(),
			orcid: this.state.orcid.trim(),
			github: this.state.github.trim(),
			googleScholar: this.state.googleScholar.trim(),
		};
		const { isValid, validationError } = this.validate(createAccountData);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(createAccount(createAccountData));
		}
	},
	render() {
		const accountData = this.props.accountData || {};
		const user = accountData.user || {};
		const isLoading = accountData.createAccountLoading;
		const errorMessage = accountData.createAccountError || this.state.validationError;
		return (
			<div style={styles.container}>
				<Helmet title={'Create Account · PubPub'} />
				{accountData.error &&
					<div>
						<h1>Invalid Hash</h1>
						This account has either already been created or the hash is invalid
						<p>To signup please begin at <Link to={'/signup'}>Sign Up</Link></p>
					</div>
				}
				
				{accountData.loading &&
					<div>Loading</div>
				}
				
				{user.email &&
					<div>

						<h1>Create your Account</h1>
						<p>Welcome! You've signed up using <b>{user.email}</b>. A few last steps are needed to create your account.</p>

						<form onSubmit={this.createAccountSubmit}>
							
							<label htmlFor={'firstName'}>
								First Name
								<input id={'firstName'} className={'pt-input margin-bottom'} name={'first name'} type="text" style={styles.input} value={this.state.firstName} onChange={this.inputUpdate.bind(this, 'firstName')} />
							</label>

							<label htmlFor={'lastName'}>
								Last Name
								<input id={'lastName'} className={'pt-input margin-bottom'} name={'last name'} type="text" style={styles.input} value={this.state.lastName} onChange={this.inputUpdate.bind(this, 'lastName')} />
							</label>

							<label htmlFor={'username'}>
								Username
								<input id={'username'} className={'pt-input margin-bottom'} name={'username'} type="text" style={styles.input} value={this.state.username} onChange={this.inputUpdateUsername.bind(this, 'username')} />
								<div className={'light-color inputSubtext'}>
									pubpub.org/user/<b>{this.state.username || 'username'}</b>
								</div>
							</label>

							<label htmlFor={'password'}>
								Password
								<input id={'password'} className={'pt-input margin-bottom'} name={'password'} type="password" style={styles.input} value={this.state.password} onChange={this.inputUpdate.bind(this, 'password')} />
								<div className={'light-color inputSubtext'}>
									Must be at least 8 characters
								</div>
							</label>

							<label htmlFor={'userImage'}>
								Profile Image
								<img role="presentation" style={styles.userImage} src={this.state.userImageURL} />
								<input id={'userImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
							</label>

							<label htmlFor={'bio'}>
								Bio
								<textarea id={'bio'} className={'pt-input margin-bottom'} name={'bio'} type="text" style={[styles.input, styles.bio]} value={this.state.bio} onChange={this.bioUpdate} />
								{/*<div className={'light-color inputSubtext'}>
									{this.state.bio.length} / 140
								</div>*/}
							</label>

							<label htmlFor={'publicEmail'}>
								Public Email
								<input id={'publicEmail'} className={'pt-input margin-bottom'} name={'publicEmail'} type="text" style={styles.input} value={this.state.publicEmail} onChange={this.inputUpdate.bind(this, 'publicEmail')} />
							</label>

							<label htmlFor={'website'}>
								Website
								<input id={'website'} className={'pt-input margin-bottom'} name={'website'} type="text" style={styles.input} value={this.state.website} onChange={this.inputUpdate.bind(this, 'website')} />
							</label>

							<label htmlFor={'twitter'}>
								Twitter
								<div className="pt-control-group prefixed-group margin-bottom">
									<div className={'pt-button pt-disabled input-prefix'}>@</div>
									<input id={'twitter'} className={'pt-input prefixed-input'} name={'twitter'} type="text" style={styles.input} value={this.state.twitter} onChange={this.inputUpdate.bind(this, 'twitter')} />
								</div>
							</label>

							<label htmlFor={'orcid'}>
								ORCID
								<div className="pt-control-group prefixed-group margin-bottom">
									<div className={'pt-button pt-disabled input-prefix'}>orcid.org/</div>
									<input id={'orcid'} className={'pt-input prefixed-input'} name={'orcid'} type="text" style={styles.input} value={this.state.orcid} onChange={this.inputUpdate.bind(this, 'orcid')} />
								</div>
							</label>
								
							<label htmlFor={'github'}>
								Github
								<div className="pt-control-group prefixed-group margin-bottom">
									<div className={'pt-button pt-disabled input-prefix'}>github.com/</div>
									<input id={'github'} className={'pt-input prefixed-input'} name={'github'} type="text" style={styles.input} value={this.state.github} onChange={this.inputUpdate.bind(this, 'github')} />
								</div>
							</label>
								
							<label htmlFor={'googleScholar'}>
								Google Scholar
								<div className="pt-control-group prefixed-group margin-bottom">
									<div className={'pt-button pt-disabled input-prefix'}>scholar.google.com/citations?user=</div>
									<input id={'googleScholar'} className={'pt-input prefixed-input'} name={'google scholar'} type="text" style={styles.input} value={this.state.googleScholar} onChange={this.inputUpdate.bind(this, 'googleScholar')} />
								</div>
							</label>
								

							<Button 
								className={'pt-intent-primary'} 
								onClick={this.createAccountSubmit}
								text={'Sign Up'}
								loading={isLoading} />

							<div style={styles.errorMessage}>{errorMessage}</div>

						</form>

						<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
							<div style={styles.imageCropper}>
								<ImageCropper height={500} width={500} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded} />
							</div>
						</div>

					</div>
				}

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(CreateAccount));

styles = {
	container: {
		width: '500px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	bio: {
		height: '4em',
	},

	userImage: {
		width: '100px',
		display: 'block',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	imageCropperWrapper: {
		height: '100vh',
		width: '100vw',
		backgroundColor: 'rgba(255,255,255,0.75)',
		position: 'fixed',
		top: 0,
		left: 0,
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',
		display: 'flex',
		justifyContent: 'center',
	},
	imageCropperWrapperVisible: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	imageCropper: {
		height: '270px',
		width: '450px',
		alignSelf: 'center',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px #808284',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			height: 'auto',
			left: 0,
		},
	},
	
};
