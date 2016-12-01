import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import { Loader, ImageCropper } from 'components';
 
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import { putJournal } from './actions';

let styles = {};


export const JournalDetails = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			iconFile: null,
			slug: '',
			name: '',
			icon: undefined,
			shortDescription: '',
			longDescription: '',
			reviewDescription: '',
			website: '',
			twitter: '',
			facebook: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		const journal = nextProps.journal || {};
		// Initialize data once we have it.
		if (journal.id && this.state.icon === undefined) {
			this.setState({
				slug: journal.slug || '',
				name: journal.name || '',
				icon: journal.icon || 'https://assets.pubpub.org/_site/journal.png',
				shortDescription: journal.shortDescription || '',
				longDescription: journal.longDescription || '',
				reviewDescription: journal.reviewDescription || '',
				website: journal.website || '',
				twitter: journal.twitter || '',
				facebook: journal.facebook || '',
			});
		}

		// If the slug changed, redirect to new slug.
		const lastSlug = this.props.journal.slug;
		const nextSlug = nextProps.journal.slug;
		if (lastSlug && nextSlug && lastSlug !== nextSlug) {
			browserHistory.push('/' + nextSlug + '/details');
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

	shortDescriptionUpdate: function(evt) {
		const description = evt.target.value || '';
		this.setState({ shortDescription: description.substring(0, 140) });
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({ iconFile: evt.target.files[0] });
		}
	},

	cancelImageUpload: function() {
		this.setState({ iconFile: null });
	},

	imageUploaded: function(url) {
		this.setState({ iconFile: null, icon: url });
	},

	saveDetails: function(evt) {
		evt.preventDefault();
		const newJournalData = {
			slug: this.state.slug,
			name: this.state.name,
			icon: this.state.icon,
			shortDescription: this.state.shortDescription,
			longDescription: this.state.longDescription,
			reviewDescription: this.state.reviewDescription,
			website: this.state.website,
			twitter: this.state.twitter,
			facebook: this.state.facebook,
		};
		this.props.dispatch(putJournal(this.props.journal.id, newJournalData));
	},

	render: function() {
		const journal = this.props.journal || {};

		const metaData = {
			title: 'Details · ' + journal.name,
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;
		// TODO: handle error messages more gracefully (may need backend updates. e.g. if a duplicate slug is used)

		return (
			<div>
				<Helmet {...metaData} />


				<form onSubmit={this.saveDetails} style={styles.form}>
					<label style={styles.label} htmlFor={'name'}>
						<FormattedMessage {...globalMessages.JournalName} />
						<input id={'name'} name={'name'} type="text" style={styles.input} value={this.state.name} onChange={this.inputUpdate.bind(this, 'name')} />
					</label>

					<label style={styles.label} htmlFor={'slug'}>
						<FormattedMessage {...globalMessages.JournalURL} />
						<input id={'slug'} name={'slug'} type="text" style={styles.input} value={this.state.slug} onChange={this.inputUpdate.bind(this, 'slug')} />
					</label>

					<label style={styles.label} htmlFor={'shortDescription'}>
						Short Description
						<textarea id={'shortDescription'} name={'shortDescription'} type="text" style={[styles.input, styles.textarea]} onChange={this.shortDescriptionUpdate} value={this.state.shortDescription} />
						<div className={'light-color inputSubtext'}>
							{this.state.shortDescription.length} / 140
						</div>
					</label>


					<label htmlFor={'icon'}>
						<FormattedMessage {...globalMessages.JournalIcon} />
					
						<img role="presentation" style={styles.image} src={this.state.icon} />
						<input id={'icon'} name={'icon image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						<div className={'light-color inputSubtext'}>
							<FormattedMessage id="JournalProfileDetails.shortDescription" defaultMessage="Used as the Journal's preview image in search results and throughout the site."/>
						</div>
					</label>


					<label style={styles.label} htmlFor={'website'}>
						<FormattedMessage {...globalMessages.Website}/>
						<input id={'website'} name={'website'} type="text" style={styles.input} value={this.state.website} onChange={this.inputUpdate.bind(this, 'website')} />
					</label>

					<label htmlFor={'twitter'}>
						Twitter
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>@</div>
							<input id={'twitter'} name={'twitter'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.twitter} onChange={this.inputUpdate.bind(this, 'twitter')} />
						</div>
					</label>

					<label htmlFor={'facebook'}>
						Facebook
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>facebook.com/</div>
							<input id={'facebook'} name={'facebook'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.facebook} onChange={this.inputUpdate.bind(this, 'facebook')} />
						</div>
					</label>


					<label style={styles.label} htmlFor={'longDescription'}>
						Long Description
						<textarea id={'longDescription'} name={'longDescription'} type="text" style={[styles.input, styles.textarea]} value={this.state.longDescription} onChange={this.inputUpdate.bind(this, 'longDescription')} />
						<div className={'light-color inputSubtext'}>
							<FormattedMessage
									id="JournalProfileDetails.shortDescription2"
									defaultMessage={`Use to describe longer details about this journal. This text will appear at pubpub.org/{slug}/about.`}
									values={{ slug: journal.slug }}
							/>
						</div>
					</label>

					<label style={styles.label} htmlFor={'reviewDescription'}>
						Review Process
						<textarea id={'reviewDescription'} name={'reviewDescription'} type="text" style={[styles.input, styles.textarea]} value={this.state.reviewDescription} onChange={this.inputUpdate.bind(this, 'reviewDescription')} />
						<div className={'light-color inputSubtext'}>
							<FormattedMessage
									id="JournalProfileDetails.shortDescription3"
									defaultMessage={`Use to describe the review process and featuring standards of this journal. This text will appear at pubpub.org/{slug}/about.`}
									values={{ slug: journal.slug }}
							/>
						</div>
					</label>


					<button className={'pt-button pt-intent-primary'} onClick={this.saveDetails}>
						<FormattedMessage {...globalMessages.SaveDetails} />
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

				<div style={[styles.imageCropperWrapper, this.state.iconFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.iconFile} onCancel={this.cancelImageUpload} onUpload={this.imageUploaded}/>
					</div>
				</div>

			</div>
		);
	}

});

export default Radium(JournalDetails);

styles = {
	form: {
		width: '500px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
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
	image: {
		width: '100px',
		display: 'block',
	},
	textarea: {
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
