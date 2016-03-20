/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';

import {createAsset} from '../../actions/assets';


import {globalStyles} from '../../utils/styleConstants';

import Dropzone from 'react-dropzone';
import {s3Upload} from '../../utils/uploadFile';
import {SimpleSelect} from 'react-selectize';

let styles;

const AssetEditor = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object, // User login data
		slug: PropTypes.string, // equal to project uniqueTitle
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			files: [],
			uploadRates: [],
			finishedUploads: 0,
			activeSection: 'assets',
		};
	},
	// TODO: On each load, we gotta load the user's assets again, in
	// case they've been updated by a co-author

	componentDidMount() {
	
	},

	componentWillReceiveProps(nextProps) {
	},

	componentWillUnmount() {
		// this.props.dispatch(closeModal());
	},

	// On file drop (or on file select)
	// Upload files automatically to s3
	// On completion call function that hits the pubpub server to generate asset information
	// Generated asset information is then sent to Firebase for syncing with other users
	onDrop: function(files) {
		if (this.state.activeSection !== 'assets') {
			return;
		}

		console.log('inDrop');
		// Add new files to existing set, so as to not overwrite existing uploads
		const existingFiles = this.state.files.length;
		const tmpFiles = this.state.files.concat(files);

		// For each new file, begin their upload process
		for (let fileCount = existingFiles; fileCount < existingFiles + files.length; fileCount++) {
			s3Upload(tmpFiles[fileCount], this.props.slug, this.onFileProgress, this.onFileFinish, fileCount);	
		}

		// Set state with newly added files
		this.setState({files: tmpFiles});

	},

	// On button click, trigger dropzone file select
	onOpenClick: function() {
		this.refs.dropzone.open();
	},

	// Update state's progress value when new events received.
	onFileProgress: function(evt, index) {
		const percentage = evt.loaded / evt.total;
		const tempUploadRates = this.state.uploadRates;
		tempUploadRates[index] = percentage;
		this.setState({uploadRates: tempUploadRates});
	},

	// When file finishes s3 upload, send s3 details to PubPub server.
	// Response is used to craft the asset object that is added to firebase.
	onFileFinish: function(evt, index, type, filename, originalFilename) {

		let assetType = 'data';
		let thumbnail = '/thumbnails/data.png';
		
		if (type.indexOf('image') > -1) {
			assetType = 'image';
			thumbnail = 'https://s3.amazonaws.com/pubpub-upload/' + filename;
		} else if (type.indexOf('video') > -1) {
			assetType = 'video';
			thumbnail = '/thumbnails/file.png';
		}
		const newAsset = {
			assetType: assetType,
			label: filename, 
			assetData: {
				filetype: type,
				originalFilename: originalFilename,
				url: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
				thumbnail: thumbnail,
			}
		};

		this.props.dispatch(createAsset(newAsset));

		// Set File to finished in state. This will hide the uploading version
		const tmpFiles = this.state.files;
		tmpFiles[index].isFinished = true;
		this.setState({
			files: tmpFiles,
			finishedUploads: this.state.finishedUploads + 1
		});

	},

	test: function() {
		console.log('focusingggg');
	},
	

	render: function() {
		const options = ["image", "video", "data", "reference"].map(function(fruit){
			return {label: fruit, value: fruit}
		});

		return (
			<div style={styles.container}>
				<Style rules={{
					'.assetEditorTitle .react-selectize.default.root-node .react-selectize-control': {
						borderBottom: '0px',
						padding: '0px 52px 0px 0px'
					},
					'.assetEditorTitle .react-selectize.default.root-node .react-selectize-control .react-selectize-placeholder': {
						// padding: '8px 0px 8px 0px'
						lineHeight: 'normal',
					},
					'.assetEditorTitle .react-selectize.root-node .react-selectize-control .react-selectize-toggle-button-container': {
						display: 'none',
					},
					'.assetEditorTitle .react-selectize.root-node .react-selectize-control .react-selectize-reset-button-container': {
						display: 'none',
					},
					'.assetEditorTitle .react-selectize.root-node .react-selectize-control .react-selectize-search-field-and-selected-values .resizable-input': {
						...globalStyles.h1,
						padding: '0px',
						margin: '0px 2px',
					},
					'.assetEditorTitle .simple-select.react-selectize.root-node .simple-value' : {
						margin: '0px 2px',
					},
					'.assetEditorTitle .react-selectize.dropdown-menu.default': {
						fontSize: '0.7em',
					}
				}} />

				<div className={'assetEditorTitle'} style={globalStyles.h1}>
					Add <SimpleSelect key={'selector'} style={styles.select} ref="select" options={options} placeholder={'Select Type'} transitionEnter={true} transitionLeave={true} onFocus={this.test} autofocus={true}/>
				</div>
				
				
			</div>

		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		editorData: state.editor,
		slug: state.router.params.slug,
		loginData: state.login
	};
})( Radium(AssetEditor) );

styles = {	
	container: {
		width: '100%',
		minHeight: '100%',
		backgroundColor: 'white',
		zIndex: '250',
		position: 'absolute',
	},
	select: {
		...globalStyles.h1,
		padding: '0px',
	    display: 'inline-block',
	    position: 'absolute',
	}
};
