import React, {PropTypes} from 'react';
import {pushState} from 'redux-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {ImageCropper} from 'components';
import {Link} from 'react-router';
import {Loader} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpDetails = React.createClass({
	propTypes: {
		submitHandler: PropTypes.func,
		errorMessage: PropTypes.string,
		isLoading: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			userImageFile: null,
			userImageURL: 'https://jake.pubpub.org/unsafe/100x100/https://assets.pubpub.org/happyPub.png',
		};
	},

	detailsSubmit: function(evt) {
		evt.preventDefault();
		const detailsData = {
			image: this.state.userImageURL,
			bio: this.refs.detailsBio.value,
			website: this.refs.detailsWebsite.value,
			twitter: this.refs.detailsTwitter.value,
			orcid: this.refs.detailsOrcid.value,
			github: this.refs.detailsGithub.value,
			googleScholar: this.refs.detailsGoogleScholar.value,
		};
		console.log(detailsData);
		// this.props.submitHandler(detailsData);	
	},

	handleFileSelect: function(evt) {
		console.log('wasd');
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
		const metaData = {
			title: 'PubPub | Add Details',
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.errorMessage;

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Welcome to PubPub!</h1>
				<p style={styles.subHeader}>We've sent you a verification email. Please click the link there to verify your account!</p>

				<h2>About You</h2>
				<p style={styles.subHeader}>Add details to identify yourself to the community and to be rewarded for your contributions!</p>
				
				<form onSubmit={this.detailsSubmit}>
					<div>
						<label style={styles.label} htmlFor={'userImage'}>
							<FormattedMessage id="details.Image" defaultMessage="Image"/>
						</label>
						<img style={styles.userImage} src={this.state.userImageURL} />
						<input id={'userImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						
					</div>

					<div>
						<label style={styles.label} htmlFor={'bio'}>
							<FormattedMessage {...globalMessages.Bio}/>
						</label>
						<textarea ref={'detailsBio'} id={'bio'} name={'bio'} type="text" style={styles.input}></textarea>
					</div>

					<div>
						<label style={styles.label} htmlFor={'website'}>
							<FormattedMessage {...globalMessages.Website}/>
						</label>
						<input ref={'detailsWebsite'} id={'website'} name={'website'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'twitter'}>
							Twitter
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>@</div>
							<input ref={'detailsTwitter'} id={'twitter'} name={'twitter'} type="text" style={[styles.input, styles.prefixedInput]}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'orcid'}>
							ORCID
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>http://orcid.org/</div>
							<input ref={'detailsOrcid'} id={'orcid'} name={'orcid'} type="text" style={[styles.input, styles.prefixedInput]}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'github'}>
							Github
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>https://github.com/</div>
							<input ref={'detailsGithub'} id={'github'} name={'github'} type="text" style={[styles.input, styles.prefixedInput]}/>	
						</div>
					</div>

					<div>
						<label style={styles.label} htmlFor={'googleScholar'}>
							Google Scholar
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>http://scholar.google.com/citations?user=</div>
							<input ref={'detailsGoogleScholar'} id={'googleScholar'} name={'google scholar'} type="text" style={[styles.input, styles.prefixedInput]}/>	
						</div>
					</div>

					<button className={'button'} onClick={this.detailsSubmit}>
						Save Details
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={150} width={150} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded}/>
					</div>
				</div>
				
			</div>
		);
	}

});

export default Radium(SignUpDetails);

styles = {
	subHeader: {  
		margin: '-20px 0px 20px 0px',
		fontSize: '0.9em',
	},
	userImage: {
		width: '100px',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	prefixedInputWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1.2em',
	},
	prefix: {
		display: 'table-cell',
		backgroundColor: '#F3F3F4',
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

	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
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
