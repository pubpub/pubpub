import React, {PropTypes} from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import {baseStyles} from './editorModalStyle';
import {s3Upload} from '../../utils/uploadFile';
import {EditorModalAssetsRow} from './';

let styles = {};

const EditorModalAssets = React.createClass({
	propTypes: {
		assetData: PropTypes.object,
		slug: PropTypes.string,
		addAsset: PropTypes.func,
		deleteAsset: PropTypes.func,
	},

	// State is used to keep track of uploading files and their progress
	getInitialState: function() {
		return {
			files: [],
			uploadRates: [],
			finishedUploads: 0,
		};
	},

	// On file drop (or on file select)
	// Upload files automatically to s3
	// On completion call function that hits the pubpub server to generate asset information
	// Generated asset information is then sent to Firebase for syncing with other users
	onDrop: function(files) {
		
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
		const createAssetObject = new XMLHttpRequest();
		createAssetObject.addEventListener('load', (success)=> {
			
			// Set File to finished in state. This will hide the uploading version
			const tmpFiles = this.state.files;
			tmpFiles[index].isFinished = true;
			this.setState({
				files: tmpFiles,
				finishedUploads: this.state.finishedUploads + 1
			});
			
			// Create Firebase object and push it
			const serverResult = JSON.parse(success.target.responseText);
			const newAsset = {
				url_s3: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
				url: serverResult.url,
				thumbnail: serverResult.thumbnail,
				originalFilename: originalFilename,
				filetype: type,
				assetType: serverResult.assetType,
				createDate: new Date().toString(),
			};

			// Call the addAsset function passed in as a prop
			this.props.addAsset(newAsset);
		});
		createAssetObject.open('GET', '/api/handleNewFile?contentType=' + type + '&url=https://s3.amazonaws.com/pubpub-upload/' + filename );
		createAssetObject.send();
	},

	render: function() {
		const assetData = [];
		for ( const key in this.props.assetData ) {
			if (this.props.assetData.hasOwnProperty(key)) {
				const objectWithKey = this.props.assetData[key];
				objectWithKey.firebaseID = key;
				assetData.push(objectWithKey);
			}
		}
		return (
			<Dropzone ref="dropzone" 
				onDrop={this.onDrop}
				disableClick
				style={styles.dropzone}
				activeStyle={styles.dropzoneActive}>

				{/* Wrap everything in the Dropzone so files can be dragged in */}

				<div style={baseStyles.modalContentContainer}>
					{/* Modal Title */}
					<div key="asset-modal-right-action" style={baseStyles.topHeader}>Assets</div>

					{/* Modal option that's placed in the top-right corner */}
					<div style={baseStyles.rightCornerAction} onClick={this.onOpenClick}>Click to choose or drag files</div>
					
					{/* Show a note if no content has been uploaded yet */}
					{assetData.length === 0 && this.state.files.length === this.state.finishedUploads
						? <div style={baseStyles.noContentBlock}>No Assets Uploaded</div>
						: null
					}

					{/* Show the assets table header if there are any existing assets or uploads */}
					{assetData.length || (this.state.files.length && (this.state.files.length !== this.state.finishedUploads))
						? <EditorModalAssetsRow isHeader={true} filename="filename" author="by" assetType="type" date="date" />
						: null
					}
					
					{/* Display all uploading using EditorModalAssetsRow */}
					{this.state.files.map((uploadAsset, index) => {
						const thumbnailImage = (uploadAsset.type.indexOf('image') > -1) ? uploadAsset.preview : '/thumbnails/file.png';
						return (uploadAsset.isFinished !== true
							? <EditorModalAssetsRow 
								key={'modalAssetUploading-' + index} 
								keyChild={'modalAssetUploading-' + index} 
								filename={uploadAsset.name} 
								thumbnail={thumbnailImage}
								isLoading={true}
								percentLoaded={this.state.uploadRates[index] * 100}/>
							: null);
						
					})} 

					{/* Display all existing assets using EditorModalAssetsRow */}
					{ () => {
						const assetList = [];

						// Iterate through assetList in reverse order. So newest are at top
						for (let index = assetData.length; index > 0; index--) {
							const asset = assetData[index - 1];
							assetList.push(<EditorModalAssetsRow 
								key={'modalAsset-' + index} 
								keyChild={'modalAsset-' + index} 
								filename={asset.originalFilename} 
								author={asset.author} 
								thumbnail={asset.thumbnail} 
								assetType={asset.assetType}
								firebaseID={asset.firebaseID}
								date={asset.createDate}
								handleDelete={this.props.deleteAsset}/>);
						}
						return assetList;
					}()}

				</div>
			</Dropzone>
		);
	}
});

export default Radium(EditorModalAssets);

styles = {
	dropzone: {
		width: '100%',
		minHeight: '430px',
	},
	dropzoneActive: {
		backgroundColor: '#F5F5F5',
		boxShadow: '0px 0px 20px rgba(0,0,0,0.6)',
	},
};
