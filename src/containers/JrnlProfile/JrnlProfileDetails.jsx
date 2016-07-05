import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {Loader, ImageCropper} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileDetails = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleUpdateJrnl: PropTypes.func,
	},

	getInitialState: function() {
		return {
			iconFile: null,
			iconURL: undefined,
			description: '',
			about: ''
		};
	},

	componentWillMount() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		this.setState({
			description: jrnlData.description || '',
			about: jrnlData.about || '',
			iconURL: jrnlData.icon || 'https://assets.pubpub.org/_site/journal.png',
		});
	},

	descriptionUpdate: function() {
		this.setState({description: this.refs.description.value.substring(0, 140)});
	},

	aboutUpdate: function() {
		this.setState({about: this.refs.about.value});
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({iconFile: evt.target.files[0]});
		}
	},

	cancelImageUpload: function() {
		this.setState({iconFile: null});
	},

	imageUploaded: function(url) {
		this.setState({iconFile: null, iconURL: url});
	},

	saveDetails: function(evt) {
		evt.preventDefault();
		const newJrnlData = {
			jrnlName: this.refs.jrnlName.value,
			description: this.state.description,
			icon: this.state.iconURL,
			website: this.refs.website.value,
			twitter: this.refs.twitter.value,
			facebook: this.refs.facebook.value,
			about: this.state.about,
		};
		this.props.handleUpdateJrnl(newJrnlData);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {
			title: 'Details · ' + jrnlData.jrnlName,
		};
		const isLoading = this.props.jrnlData && this.props.jrnlData.get('saveLoading');
		const errorMessage = this.props.jrnlData && this.props.jrnlData.get('saveError');

		return (
			<div>
				<Helmet {...metaData} />


				<form onSubmit={this.saveDetails} style={styles.form}>
					<div>
						<label style={styles.label} htmlFor={'jrnlName'}>
							Jrnl Name
						</label>
						<input ref={'jrnlName'} id={'jrnlName'} name={'Jrnl Name'} type="text" style={styles.input} defaultValue={jrnlData.jrnlName}/>
					</div>


					<div>
						<label htmlFor={'description'}>
							Description
						</label>
						<textarea ref={'description'} id={'description'} name={'description'} type="text" style={[styles.input, styles.description]} onChange={this.descriptionUpdate} value={this.state.description}></textarea>
						<div className={'light-color inputSubtext'}>
							{this.state.description.length} / 140
						</div>
					</div>

					<div>
						<label htmlFor={'icon'}>
							Jrnl Icon
						</label>
						<img style={styles.image} src={this.state.iconURL} />
						<input id={'icon'} name={'icon image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						<div className={'light-color inputSubtext'}>
							Used as the Jrnl's preview image in search results and throughout the site.
						</div>
						
					</div>

					<div>
						<label htmlFor={'website'}>
							<FormattedMessage {...globalMessages.Website}/>
						</label>
						<input ref={'website'} id={'website'} name={'website'} type="text" style={styles.input} defaultValue={jrnlData.website}/>
					</div>

					<div>
						<label htmlFor={'twitter'}>
							Twitter
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>@</div>
							<input ref={'twitter'} id={'twitter'} name={'twitter'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={jrnlData.twitter}/>	
						</div>
					</div>

					<div>
						<label htmlFor={'facebook'}>
							Facebook
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>facebook.com/</div>
							<input ref={'facebook'} id={'facebook'} name={'facebook'} type="text" style={[styles.input, styles.prefixedInput]} defaultValue={jrnlData.facebook}/>	
						</div>
					</div>

					<div>
						<label htmlFor={'about'}>
							About
						</label>
						<textarea ref={'about'} id={'about'} name={'about'} type="text" style={[styles.input, styles.description]} onChange={this.aboutUpdate} value={this.state.about}></textarea>
						<div className={'light-color inputSubtext'}>
							Use to describe longer details, peer-review process, featuring standards, etc. This text will appear at pubpub.org/{jrnlData.slug}/about.
						</div>
					</div>

					<button className={'button'} onClick={this.saveDetails}>
						Save Details
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

export default Radium(JrnlProfileDetails);

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
	},
	description: {
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
