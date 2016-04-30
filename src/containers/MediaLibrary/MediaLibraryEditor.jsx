/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import Radium, {Style} from 'radium';
import {Button} from 'components';
// import {createAsset} from './actions';


import {globalStyles} from 'utils/styleConstants';

import MediaLibraryEditorFile from './MediaLibraryEditorFile';
import MediaLibraryEditorReference from './MediaLibraryEditorReference';

// import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';
import {SimpleSelect} from 'react-selectize';

let styles;

const AssetEditor = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,
		assetType: PropTypes.string,

		addAssets: PropTypes.func,
		updateAssets: PropTypes.func,
		close: PropTypes.func,
		assetLoading: PropTypes.bool,
		slug: PropTypes.string,
	},

	getInitialState() {
		return {
			assetType: undefined,

			files: [],
			uploadRates: [],
			finishedUploads: 0,
			activeSection: 'assets',
		};
	},
	// TODO: On each load, we gotta load the user's assets again, in
	// case they've been updated by a co-author

	componentWillMount() {
		this.setState({assetType: this.props.assetType});
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

		// let assetType = 'data';
		// let thumbnail = '/thumbnails/data.png';
		//
		// if (type.indexOf('image') > -1) {
		// 	assetType = 'image';
		// 	thumbnail = 'https://s3.amazonaws.com/pubpub-upload/' + filename;
		// } else if (type.indexOf('video') > -1) {
		// 	assetType = 'video';
		// 	thumbnail = '/thumbnails/file.png';
		// }
		// const newAsset = {
		// 	assetType: assetType,
		// 	label: filename,
		// 	assetData: {
		// 		filetype: type,
		// 		originalFilename: originalFilename,
		// 		url: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
		// 		thumbnail: thumbnail,
		// 	}
		// };
		//
		// this.props.dispatch(createAsset(newAsset));
		//
		// // Set File to finished in state. This will hide the uploading version
		// const tmpFiles = this.state.files;
		// tmpFiles[index].isFinished = true;
		// this.setState({
		// 	files: tmpFiles,
		// 	finishedUploads: this.state.finishedUploads + 1
		// });

	},

	setAssetType: function(type) {
		this.setState({assetType: type ? type.value : undefined});
	},

	render: function() {
		const options = ['image', 'video', 'data', 'reference'].map(function(type) {
			return {label: type, value: type};
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
					'.assetEditorTitle .simple-select.react-selectize.root-node .simple-value': {
						margin: '0px 2px',
					},
					'.assetEditorTitle .react-selectize.dropdown-menu.default': {
						fontSize: '0.6em',
					}
				}} />

				<div className={'assetEditorTitle'} style={globalStyles.h1}>
					<span>{this.props.assetObject && this.props.assetObject.assetData ? 'Edit' : 'Add'} </span>
					<SimpleSelect key={'selector'} style={styles.select} placeholder={'Select Type'} ref="select" options={options} value={this.state.assetType ? {label: this.state.assetType, value: this.state.assetType} : undefined} onValueChange={this.setAssetType} transitionEnter={true} transitionLeave={true} autofocus={!this.state.assetType} />
				</div>

				{(() => {
					switch (this.state.assetType) {
					case 'image':
					case 'video':
					case 'data':
						return ( <MediaLibraryEditorFile slug={this.props.slug} assetObject={this.props.assetObject} assetLoading={this.props.assetLoading} addAssets={this.props.addAssets} updateAssets={this.props.updateAssets} close={this.props.close}/> );

					case 'reference':
						return ( <MediaLibraryEditorReference assetObject={this.props.assetObject} assetLoading={this.props.assetLoading} addAssets={this.props.addAssets} updateAssets={this.props.updateAssets} close={this.props.close} /> );

					default:
						return (
							<div style={styles.cancelButtonWrapper}>
								<Button
									key={'customStyleSaveButton'}
									label={'Cancel'}
									onClick={this.props.close} />
							</div>
						);
					}
				})()}


			</div>

		);
	}

});

export default ( Radium(AssetEditor) );

styles = {
	container: {
		width: '100%',
		minHeight: '100%',
		backgroundColor: 'white',
		zIndex: '550',
		position: 'absolute',
	},
	select: {
		...globalStyles.h1,
		padding: '0px',
		display: 'inline-block',
		position: 'absolute',
	},
	cancelButtonWrapper: {
		position: 'absolute',
		top: 30,
		right: 20,
	},
};
