import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import { StickyContainer, Sticky } from 'react-sticky';
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
			canSave: false,
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
		this.setState({ [key]: value, canSave: true });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase(), canSave: true });
	},

	descriptionUpdate: function(evt) {
		const description = evt.target.value || '';
		this.setState({ description: description.substring(0, 140), canSave: true });
	},

	slugUpdate: function(evt) {
		const slug = evt.target.value || '';
		this.setState({ slug: slug.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase(), canSave: true });
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({ imageFile: evt.target.files[0] });
		}
	},

	headerColorChange: function(color) {
		this.setState({ headerColor: color.hex, canSave: true });
	},

	cancelImageUpload: function() {
		this.setState({ imageFile: null });
		document.getElementById('avatar').value = null;
	},

	imageUploaded: function(url) {
		this.setState({ imageFile: null, avatar: url, canSave: true });
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
		
		if (isValid) {
			this.setState({ canSave: false });
			this.props.dispatch(updatePub(this.props.pub.id, updateData));	
		} else {
			this.setState({ validationError: validationError });	
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

				<StickyContainer>
					<form onSubmit={this.settingsSubmit}>
						<Sticky>
							<div style={styles.buttonWrapper}>
								<Button 
									type="button" 
									className={'pt-intent-primary'} 
									disabled={!this.state.canSave} 
									onClick={this.settingsSubmit} 
									text={'Save Settings'} 
									loading={isLoading} />
								

								<div style={styles.errorMessage}>{errorMessage}</div>
							</div>

						</Sticky>

						<div style={styles.formContentWrapper}>
							<label style={styles.label} htmlFor={'title'}>
								<FormattedMessage {...globalMessages.Title} />
								<input id={'title'} className={'pt-input margin-bottom'} name={'title'} type="text" style={styles.input} value={this.state.title} onChange={this.inputUpdate.bind(this, 'title')} />
							</label>

							<label style={styles.label} htmlFor={'pubURL'}>
								<FormattedMessage {...globalMessages.PubURL} />
								<input id={'pubURL'} className={'pt-input margin-bottom'} name={'pubURL'} type="text" style={styles.input} value={this.state.slug} onChange={this.slugUpdate} />
								<div className={'light-color inputSubtext'}>
									pubpub.org/pub/<b>{this.state.slug || 'pubURL'}</b>
								</div>
							</label>		
								
							<label htmlFor={'description'}>
								<FormattedMessage {...globalMessages.Description} />
								<textarea id={'description'} className={'pt-input margin-bottom'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.descriptionUpdate} />
								<div className={'light-color inputSubtext'}>
									{this.state.description.length} / 140
								</div>
							</label>

							{/*<label htmlFor={'avatar'}>
								<FormattedMessage {...globalMessages.Avatar} />
								<img role="presentation" style={styles.avatar} src={this.state.avatar} />
								<input id={'avatar'} name={'user image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
							</label>*/}

							<ImageUpload 
									defaultImage={this.state.avatar}
									userCrop={true}
									label={'Pub Avatar'}
									tooltip={'Used in search results and profiles'} 
									containerStyle={styles.imageContainer}
									onNewImage={this.imageUploaded} />

							<ImageUpload 
								defaultImage={this.state.headerImage}
								userCrop={false}
								label={'Header Image'}
								tooltip={false} 
								containerStyle={styles.imageContainer}
								onNewImage={this.handleBackgroundImageChange}
								canClear={true} />

							<label style={styles.imageContainer}>
								<FormattedMessage {...globalMessages.BackgroundColor} />
								<div style={{ margin:'1em 0em', display: 'block' }}>
									<ColorPicker color={this.state.headerColor} onChange={this.headerColorChange} />	
								</div>
							</label>
						</div>

					</form>
				</StickyContainer>

				{!pub.isPublished && 
					<div style={styles.deleteBlock}>
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
	bio: {
		height: '4em',
	},
	formContentWrapper: {
		width: 'calc(100% - 200px)',
		// width: '500px',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	buttonWrapper: {
		position: 'absolute',
		right: 0,
	},

	avatar: {
		width: '100px',
		display: 'block',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	imageContainer: {
		marginRight: '3em',
		verticalAlign: 'top',
		display: 'inline-block',
	},
	deleteBlock: {
		padding: '1em 0em',
	},
};
