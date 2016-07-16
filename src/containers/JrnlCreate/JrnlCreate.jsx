import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {createJrnl} from './actions';
import {Loader, ImageCropper} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlCreate = React.createClass({
	propTypes: {
		jrnlCreateData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			iconFile: null,
			iconURL: 'https://assets.pubpub.org/_site/journal.png',
			slug: '',
			description: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		// If there is a new slug in createJrnl, creation was a sucess, so redirect
		const oldSlug = this.props.jrnlCreateData && this.props.jrnlCreateData.get('newJrnlSlug');
		const newSlug = nextProps.jrnlCreateData && nextProps.jrnlCreateData.get('newJrnlSlug');
		console.log(oldSlug, newSlug);
		if (newSlug && oldSlug !== newSlug) {
			this.props.dispatch(push('/' + newSlug));
		}
	},

	slugUpdate: function() {
		this.setState({slug: this.refs.slug.value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase()});
	},

	descriptionUpdate: function() {
		this.setState({description: this.refs.description.value.substring(0, 140)});
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

	handleJournalCreate: function(evt) {
		evt.preventDefault();
		const newJrnlData = {
			jrnlName: this.refs.jrnlName.value,
			slug: this.state.slug,
			description: this.state.description,
			icon: this.state.iconURL,
		};
		this.props.dispatch(createJrnl(newJrnlData));
	},

	render: function() {
		const metaData = {
			title: 'Create Journal · PubPub',
		};
		const isLoading = this.props.jrnlCreateData && this.props.jrnlCreateData.get('loading');
		const errorMessage = this.props.jrnlCreateData && this.props.jrnlCreateData.get('error');

		return (
			<div className={'section'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Create Jrnl</h1>

				<form onSubmit={this.handleJournalCreate}>
					<div>
						<label style={styles.label} htmlFor={'jrnlName'}>
							Jrnl Name
						</label>
						<input ref={'jrnlName'} id={'jrnlName'} name={'Jrnl Name'} type="text" style={styles.input}/>
					</div>

					<div>
						<label htmlFor={'slug'}>
							Jrnl URL
						</label>
						<div style={styles.prefixedInputWrapper}>
							<div style={styles.prefix}>pubpub.org/</div>
							<input ref={'slug'} id={'slug'} name={'jrnl URL'} type="text" style={[styles.input, styles.prefixedInput]} value={this.state.slug} onChange={this.slugUpdate}/>	
						</div>
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
						
					</div>

					<button className={'button'} onClick={this.handleJournalCreate}>
						Create Jrnl
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

export default connect( state => {
	return {
		jrnlCreateData: state.jrnlCreate,
	};
})( Radium(JrnlCreate) );

styles = {
	container: {
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
