import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { Loader, ImageUpload, ImageCropper, ColorPicker } from 'components';
import { Button, Dialog } from '@blueprintjs/core';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { updatePub, deletePub } from './actions';

let styles;

export const PubSettings = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			slug: '',
			title: '',
			description: '',
			avatar: '',
			imageFile: null,
			headerColor: '',
			headerImage: '',
			confirmDelete: false,
		};
	},

	componentWillMount() {
		const pub = this.props.pub;
		this.setState({
			slug: pub.slug,
			title: pub.title,
			description: pub.description,
			avatar: pub.avatar,
			headerColor: pub.headerColor || '#F3F3F4', 
			headerImage: pub.headerImage, 
		});
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldSlug = this.props.pub.slug;
		const nextSlug = nextProps.pub.slug;

		if (oldSlug !== nextSlug) {
			browserHistory.push('/pub/' + nextSlug + '/settings');
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

	headerColorChange: function(color) {
		console.log(color);
		this.setState({ headerColor: color.hex });
	},

	cancelImageUpload: function() {
		this.setState({ imageFile: null });
		document.getElementById('avatar').value = null;
	},

	imageUploaded: function(url) {
		this.setState({ imageFile: null, avatar: url });
		document.getElementById('avatar').value = null;
	},

	handleBackgroundImageChange: function(imageUrl) {
		this.setState({ headerImage: imageUrl, canSave: true });
	},

	validate: function(data) {
		// Check to make sure username exists
		if (!data.slug || !data.slug.length) {
			return { isValid: false, validationError: <FormattedMessage id="pubSettings.PubURLrequired" defaultMessage="Pub URL required" /> };
		}

		// Check to make sure firstName exists
		if (!data.title || !data.title.length) {
			return { isValid: false, validationError: <FormattedMessage id="pubSettings.Titlerequired" defaultMessage="Title required" /> };
		}

		return { isValid: true, validationError: undefined };

	},

	settingsSubmit: function(evt) {
		evt.preventDefault();
		const updateData = {
			slug: this.state.slug,
			title: this.state.title,
			description: this.state.description,
			avatar: this.state.avatar,
			headerColor: this.state.headerColor,
			headerImage: this.state.headerImage,
		};
		const { isValid, validationError } = this.validate(updateData);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(updatePub(this.props.pub.id, updateData));	
		}
	},

	confirmDelete: function() {
		this.setState({ confirmDelete: true });
	},
	cancelConfirmDelete: function() {
		this.setState({ confirmDelete: false });
	},

	deletePub: function() {
		this.props.dispatch(deletePub(this.props.pub.id));
	},

	render: function() {
		const pub = this.props.pub || {};
		if (!pub.canEdit) { return <div />; }
		
		// const pub = this.props.pub || {};
		const isLoading = this.props.isLoading;
		const serverErrors = {
			'Email already used': <FormattedMessage id="pubSettings.Emailalreadyused" defaultMessage="Email already used" />,
			'Username already used': <FormattedMessage id="pubSettings.Usernamealreadyused" defaultMessage="Username already used" />,
		};
		const errorMessage = serverErrors[this.props.error] || this.state.validationError;
		return (
			<div style={styles.container}>
				<h2>Settings</h2>

				<form onSubmit={this.settingsSubmit}>
					
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

					<label htmlFor={'avatar'}>
						<FormattedMessage {...globalMessages.Avatar} />
						<img role="presentation" style={styles.avatar} src={this.state.avatar} />
						<input id={'avatar'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</label>

					<ColorPicker color={this.state.headerColor} onChange={this.headerColorChange} />

					<ImageUpload 
						defaultImage={this.state.headerImage}
						userCrop={false}
						label={'Header Image'}
						tooltip={false} 
						containerStyle={styles.imageContainer}
						onNewImage={this.handleBackgroundImageChange}
						canClear={true} />

					<button className={'pt-button pt-intent-primary'} onClick={this.settingsSubmit}>
						Save Settings
					</button>

					<div style={styles.loaderContainer}>
						<Loader loading={isLoading} showCompletion={!errorMessage} />
					</div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				{!pub.isPublished && 
					<div>
						<div className={'pt-callout pt-intent-danger'}>
							<h5>Delete Pub</h5>
							<p>A pub cannot be deleted if it is published. Deleting a Pub is permanent.</p>
							<Button text={'Delete Pub'} onClick={this.confirmDelete} />
						</div>

						<Dialog
							iconName="delete"
							isOpen={this.state.confirmDelete}
							onClose={this.cancelConfirmDelete}
							title="Confirm Delete"
						>
							<div className="pt-dialog-body">
								Please confirm that you'd like to delete this pub. This action is permanent.
							</div>
							<div className="pt-dialog-footer">
								<div className="pt-dialog-footer-actions">
									<Button text="Cancel" onClick={this.cancelConfirmDelete} />
									<Button className={'pt-intent-danger'} onClick={this.deletePub} text="Delete Pub" loading={isLoading} />
								</div>
							</div>
						</Dialog>

					</div>
				}
				

				<div style={[styles.imageCropperWrapper, this.state.imageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.imageFile} onCancel={this.cancelImageUpload} onUpload={this.imageUploaded} />
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(PubSettings);

styles = {
	container: {
		// padding: '1.5em',
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

	avatar: {
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
		zIndex: 1,
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
