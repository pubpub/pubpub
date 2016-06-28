import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

import {safeGetInToJS} from 'utils/safeParse';
import {Loader, ImageCropper} from 'components';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

export const UserSettingsProfile = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		loginData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
	},

	getInitialState: function() {
		return {
			userImageFile: null,
			userImageURL: undefined,
			bio: '',
		};
	},

	componentWillMount() {
		const userData = safeGetInToJS(this.props.loginData, ['userData']) || {};
		this.setState({bio: userData.bio || ''});
	},

	saveSubmit: function(evt) {
		evt.preventDefault();
		this.props.saveSettingsHandler({
			firstName: this.refs.firstName.value,
			lastName: this.refs.lastName.value,
			image: this.state.userImageURL,
			bio: this.refs.bio.value,
			website: this.refs.website.value,
			twitter: this.refs.twitter.value,
			orcid: this.refs.orcid.value,
			github: this.refs.github.value,
			googleScholar: this.refs.googleScholar.value,
		});
	},

	bioUpdate: function() {
		this.setState({bio: this.refs.bio.value.substring(0, 140)});
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({userImageFile: evt.target.files[0]});
		}
	},

	cancelImageUpload: function() {
		this.setState({userImageFile: null});
	},

	userImageUploaded: function(url) {
		this.setState({userImageFile: null, userImageURL: url});
	},

	render: function() {
		const isLoading = this.props.settingsData && this.props.settingsData.get('loading');
		const errorMessage = this.props.settingsData && this.props.settingsData.get('error');
		const userData = safeGetInToJS(this.props.loginData, ['userData']) || {};

		return (
			<div>
				
				<form onSubmit={this.saveSubmit} style={styles.form}>
					<div>
						<label style={styles.label} htmlFor={'firstName'}>
							<FormattedMessage id="signup.FirstName" defaultMessage="First Name"/>
						</label>
						<input ref={'firstName'} id={'firstName'} name={'first name'} type="text" style={styles.input} defaultValue={userData.firstName}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'lastName'}>
							<FormattedMessage id="signup.LastName" defaultMessage="Last Name"/>
						</label>
						<input ref={'lastName'} id={'lastName'} name={'last name'} type="text" style={styles.input} defaultValue={userData.lastName}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'userImage'}>
							<FormattedMessage {...globalMessages.ProfileImage}/>
						</label>
						<img style={styles.userImage} src={this.state.userImageURL || 'https://jake.pubpub.org/unsafe/100x100/' + userData.image} />
						<input id={'userImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						
					</div>

					<div>
						<label style={styles.label} htmlFor={'bio'}>
							<FormattedMessage {...globalMessages.Bio}/>
						</label>
						<textarea ref={'bio'} id={'bio'} name={'bio'} type="text" style={[styles.input, styles.bio]} onChange={this.bioUpdate} value={this.state.bio}></textarea>
						<div className={'light-color inputSubtext'} to={'/resetpassword'}>
							{this.state.bio.length} / 140
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'website'}>
							<FormattedMessage {...globalMessages.Website}/>
						</label>
						<input ref={'website'} id={'website'} name={'website'} type="text" style={styles.input} defaultValue={userData.website}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'twitter'}>
							Twitter
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>@</div>
							<input ref={'twitter'} id={'twitter'} name={'twitter'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={userData.twitter}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'orcid'}>
							ORCID
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>orcid.org/</div>
							<input ref={'orcid'} id={'orcid'} name={'orcid'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={userData.orcid}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'github'}>
							Github
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>github.com/</div>
							<input ref={'github'} id={'github'} name={'github'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={userData.github}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'googleScholar'}>
							Google Scholar
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>scholar.google.com/citations?user=</div>
							<input ref={'googleScholar'} id={'googleScholar'} name={'google scholar'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={userData.googleScholar}/>	
						</div>
					</div>


					<button className={'button'} onClick={this.saveSubmit}>
						Save Profile
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded}/>
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(UserSettingsProfile);

styles = {
	form: {
		width: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	userImage: {
		width: '100px',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	bio: {
		height: '4em',
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
