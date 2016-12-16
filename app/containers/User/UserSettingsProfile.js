import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Loader, ImageCropper } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

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
			userImageURL: user.image,
			firstName: user.firstName,
			lastName: user.lastName,
			bio: user.bio,
			publicEmail: user.publicEmail,
			website: user.website,
			twitter: user.twitter,
			orcid: user.orcid,
			github: user.github,
			googleScholar: user.googleScholar,
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
		this.setState({ bio: bio.substring(0, 140) });
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
			return { isValid: false, validationError: <FormattedMessage { ...globalMessages.FirstNamerequired } /> };
		}

		// Check to make sure lastName exists
		if (!data.lastName || !data.lastName.length) {
			return { isValid: false, validationError: <FormattedMessage { ...globalMessages.LastNamerequired } /> };
		}

		return { isValid: true, validationError: undefined };

	},

	putUserSubmit: function(evt) {
		evt.preventDefault();
		const user = this.props.user || {};
		const putAccountData = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			image: this.state.userImageURL,
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
						<FormattedMessage {...globalMessages.FirstName} />
						<input id={'firstName'} name={'first name'} type="text" style={styles.input} value={this.state.firstName} onChange={this.inputUpdate.bind(this, 'firstName')} />
					</label>
					
					<label htmlFor={'lastName'}>
						<FormattedMessage {...globalMessages.LastName} />
						<input id={'lastName'} name={'last name'} type="text" style={styles.input} value={this.state.lastName} onChange={this.inputUpdate.bind(this, 'lastName')} />
					</label>
						
					<label htmlFor={'userImage'}>
						<FormattedMessage {...globalMessages.ProfileImage} />
						<img role="presentation" style={styles.userImage} src={this.state.userImageURL} />
						<input id={'userImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</label>

					<label htmlFor={'bio'}>
						<FormattedMessage {...globalMessages.Bio} />
						<textarea id={'bio'} name={'bio'} type="text" style={[styles.input, styles.bio]} value={this.state.bio} onChange={this.bioUpdate} />
						<div className={'light-color inputSubtext'}>
							{this.state.bio.length} / 140
						</div>
					</label>

					<label htmlFor={'publicEmail'}>
						<FormattedMessage {...globalMessages.PublicEmail} />
						<input id={'publicEmail'} name={'publicEmail'} type="text" style={styles.input} value={this.state.publicEmail} onChange={this.inputUpdate.bind(this, 'publicEmail')} />
					</label>

					<label htmlFor={'website'}>
						<FormattedMessage {...globalMessages.Website} />
						<input id={'website'} name={'website'} type="text" style={styles.input} value={this.state.website} onChange={this.inputUpdate.bind(this, 'website')} />
					</label>

					<label htmlFor={'twitter'}>
						Twitter
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>@</div>
							<input id={'twitter'} name={'twitter'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.twitter} onChange={this.inputUpdate.bind(this, 'twitter')} />
						</div>
					</label>

					<label htmlFor={'orcid'}>
						ORCID
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>orcid.org/</div>
							<input id={'orcid'} name={'orcid'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.orcid} onChange={this.inputUpdate.bind(this, 'orcid')} />
						</div>
					</label>
						
					<label htmlFor={'github'}>
						Github
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>github.com/</div>
							<input id={'github'} name={'github'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.github} onChange={this.inputUpdate.bind(this, 'github')} />
						</div>
					</label>
						
					<label htmlFor={'googleScholar'}>
						Google Scholar
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>scholar.google.com/citations?user=</div>
							<input id={'googleScholar'} name={'google scholar'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.googleScholar} onChange={this.inputUpdate.bind(this, 'googleScholar')} />
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
	prefixedInputWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1.2em',
	},
	prefix: {
		display: 'table-cell',
		backgroundColor: '#F3F3F4',
		verticalAlign: 'middle',
		textAlign: 'center',
		padding: '4px 10px',
		borderWidth: '2px 0px 2px 2px',
		borderStyle: 'solid',
		borderColor: '#BBBDC0',
		borderRadius: '1px 0px 0px 1px',
		width: '1%',
		fontSize: '0.9em',
		whiteSpace: 'nowrap',
	},
	prefixedInput: {
		display: 'table-cell',
		marginBottom: 0,
		borderRadius: '0px 1px 1px 0px',
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
