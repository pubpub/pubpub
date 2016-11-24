import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';

import { Loader, ImageCropper } from 'components';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { createPub } from './actions';

let styles;

export const CreatePub = React.createClass({
	propTypes: {
		createPubData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			slug: '',
			title: '',
			description: '',
			imageFile: null,
			imageURL: 'https://assets.pubpub.org/_site/pub.png',

		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.createPubData.loading;
		const nextLoading = nextProps.createPubData.loading;
		const nextError = nextProps.createPubData.error;

		if (oldLoading && !nextLoading && !nextError) {
			browserHistory.push('/pub/' + nextProps.createPubData.newPubSlug);
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase() });
	},

	descriptionUpdate: function(evt) {
		const description = evt.target.value || '';
		this.setState({ description: description.substring(0, 140) });
	},

	slugUpdate: function(evt) {
		const slug = evt.target.value || '';
		this.setState({ slug: slug.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase() });
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({ imageFile: evt.target.files[0] });
		}
	},

	cancelImageUpload: function() {
		this.setState({ imageFile: null });
		document.getElementById('previewImage').value = null;
	},

	imageUploaded: function(url) {
		this.setState({ imageFile: null, imageURL: url });
		document.getElementById('previewImage').value = null;
	},

	validate: function(data) {
		// Check to make sure username exists
		if (!data.slug || !data.slug.length) {
			return { isValid: false, validationError: <FormattedMessage id="createPub.PubURLrequired" defaultMessage="Pub URL required" /> };
		}

		// Check to make sure firstName exists
		if (!data.title || !data.title.length) {
			return { isValid: false, validationError: <FormattedMessage id="createPub.Titlerequired" defaultMessage="Title required" /> };
		}

		return { isValid: true, validationError: undefined };

	},

	createSubmit: function(evt) {
		evt.preventDefault();
		const createData = {
			slug: this.state.slug,
			title: this.state.title,
			description: this.state.description,
			previewImage: this.state.imageURL,
		};
		const { isValid, validationError } = this.validate(createData);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(createPub(createData));	
		}
	},
	render() {
		const createPubData = this.props.createPubData;
		
		const isLoading = createPubData.loading;
		const serverErrors = {
			'Email already used': <FormattedMessage id="createPub.Emailalreadyused" defaultMessage="Email already used" />,
			'Username already used': <FormattedMessage id="createPub.Usernamealreadyused" defaultMessage="Username already used" />,
		};
		const errorMessage = serverErrors[createPubData.error] || this.state.validationError;
		return (
			<div style={styles.container}>
				<Helmet title={'Create Pub · PubPub'} />
				
				
				<h1>Create Pub</h1>
				<p>A pub contains all of the content needed to document and reproduce your research.</p>
				<p>Pubs maintain full revision histories, can have collaborators, and provide a platform for review and discussion.</p>

				<hr />
				<form onSubmit={this.createSubmit}>
					
					<label style={styles.label} htmlFor={'title'}>
						<FormattedMessage {...globalMessages.Title} />
						<input id={'title'} name={'title'} type="text" style={styles.input} value={this.state.title} onChange={this.inputUpdate.bind(this, 'title')} />
					</label>

					<label style={styles.label} htmlFor={'pubURL'}>
						<FormattedMessage {...globalMessages.PubURL} />
						<input id={'pubURL'} name={'pubURL'} type="text" style={styles.input} value={this.state.slug} onChange={this.slugUpdate} />
						<div className={'light-color inputSubtext'}>
							pubpub.org/pub/<b>{this.state.slug || 'pubURL'}</b>
						</div>
					</label>		
						
					<label htmlFor={'description'}>
						<FormattedMessage {...globalMessages.Description} />
						<textarea id={'description'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.descriptionUpdate} />
						<div className={'light-color inputSubtext'}>
							{this.state.description.length} / 140
						</div>
					</label>

					<label htmlFor={'previewImage'}>
						<FormattedMessage {...globalMessages.PreviewImage} />
						<img role="presentation" style={styles.previewImage} src={this.state.imageURL} />
						<input id={'previewImage'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</label>

					<button className={'pt-button pt-intent-primary'} onClick={this.createSubmit}>
						Create pub
					</button>

					<div style={styles.loaderContainer}>
						<Loader loading={isLoading} showCompletion={!errorMessage} />
					</div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				<div style={[styles.imageCropperWrapper, this.state.imageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.imageFile} onCancel={this.cancelImageUpload} onUpload={this.imageUploaded} />
					</div>
				</div>

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		createPubData: state.createPub.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(CreatePub));

styles = {
	container: {
		width: '600px',
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

	previewImage: {
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
