import React, { PropTypes } from 'react';
import Radium from 'radium';
import Loader from 'components/Loader/Loader';
import ImageCropper from 'components/ImageCropper/ImageCropper';

import { globalStyles } from 'utils/globalStyles';

import { putUser } from './actionsSettings';
let styles;

export const UserSettingsProfile = React.createClass({
	propTypes: {
		user: PropTypes.object,
		ownProfile: PropTypes.bool,
		pathname: PropTypes.string, 
		query: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			userImageFile: null,
			userImageURL: 'https://assets.pubpub.org/_site/happyPub.png',
			firstName: '',
			lastName: '',
			bio: '',
			publicEmail: '',
			website: '',
			twitter: '',
			orcid: '',
			github: '',
			googleScholar: '',
			validationError: undefined,
		};
	},

	componentWillMount() {
		const user = this.props.user || {};
		this.setState({
			userImageURL: user.avatar,
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			bio: user.bio || '',
			publicEmail: user.publicEmail || '',
			website: user.website || '',
			twitter: user.twitter || '',
			orcid: user.orcid || '',
			github: user.github || '',
			googleScholar: user.googleScholar || '',
		});
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase() });
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

		// Check to make sure firstName exists
		if (!data.firstName || !data.firstName.length) {
			return { isValid: false, validationError: 'First Name required' };
		}

		// Check to make sure lastName exists
		if (!data.lastName || !data.lastName.length) {
			return { isValid: false, validationError: 'Last Name required' };
		}

		return { isValid: true, validationError: undefined };

	},

	putUserSubmit: function(evt) {
		evt.preventDefault();
		const user = this.props.user || {};
		const putAccountData = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			avatar: this.state.userImageURL,
			bio: this.state.bio,
			publicEmail: this.state.publicEmail,
			website: this.state.website,
			twitter: this.state.twitter,
			orcid: this.state.orcid,
			github: this.state.github,
			googleScholar: this.state.googleScholar,
		};
		const { isValid, validationError } = this.validate(putAccountData);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(putUser(user.id, putAccountData));	
		}
	},

	render() {
		const user = this.props.user || {};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error || this.state.validationError;

		return (
			<div style={styles.container}>
				<form onSubmit={this.putUserSubmit}>

					<label htmlFor={'firstName'}>
						First Name
						<input id={'firstName'} className={'pt-input margin-bottom'} name={'first name'} type="text" style={styles.input} value={this.state.firstName} onChange={this.inputUpdate.bind(this, 'firstName')} />
					</label>
					
					<label htmlFor={'lastName'}>
						Last Name
						<input id={'lastName'} className={'pt-input margin-bottom'} name={'last name'} type="text" style={styles.input} value={this.state.lastName} onChange={this.inputUpdate.bind(this, 'lastName')} />
					</label>
						
					<label htmlFor={'userImage'}>
						Profile Image
						<img role="presentation" style={styles.userImage} src={this.state.userImageURL} />
						<input id={'userImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</label>

					<label htmlFor={'bio'}>
						Bio
						<textarea id={'bio'} className={'pt-input margin-bottom'} name={'bio'} type="text" style={[styles.input, styles.bio]} value={this.state.bio} onChange={this.bioUpdate} />
						{/* <div className={'light-color inputSubtext'}>
							{this.state.bio.length} / 140
						</div> */}
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
						

					<button className={'pt-button pt-intent-primary'} onClick={this.putUserSubmit}>
						Save Profile
					</button>

					<div style={styles.loaderContainer}>
						<Loader loading={isLoading} showCompletion={!errorMessage} />
					</div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				<h2>Access Token</h2>
				<p>Use the following access token when using the PubPub API (<a href={'https://v2-dev-docs.pubpub.org'}>https://v2-dev-docs.pubpub.org</a>)</p>
				<input id={'accessToken'} className={'pt-input margin-bottom'} name={'access token'} type="text" disabled style={styles.input} value={user.accessToken} />

				<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded} />
					</div>
				</div>
			</div>
		);
	}
});

export default Radium(UserSettingsProfile);

styles = {
	container: {
		
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
