import React, {PropTypes} from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import {baseStyles} from './modalStyle';
import {s3Upload} from '../../utils/uploadFile';
import {EditorModalAssetsRow} from './';

const styles = {
	dropzone: {
		width: '100%',
		minHeight: '200px',
	},
	dropzoneActive: {
		backgroundColor: '#F5F5F5',
		boxShadow: '0px 0px 20px rgba(0,0,0,0.6)',
	},
};

const EditorModalAssets = React.createClass({
	propTypes: {
		assetData: PropTypes.array,
		slug: PropTypes.string,
		addAsset: PropTypes.func,
	},

	getInitialState: function() {
		return {
			files: [],
			uploadRates: []
		};
	},

	onDrop: function(files) {
		
		const existingFiles = this.state.files.length;
		const tmpFiles = this.state.files.concat(files);

		for (let fileCount = existingFiles; fileCount < existingFiles + files.length; fileCount++) {
			s3Upload(tmpFiles[fileCount], this.props.slug, this.onFileProgress, this.onFileFinish, fileCount);	
		}

		this.setState({files: tmpFiles});

	},

	onOpenClick: function() {
		this.refs.dropzone.open();
	},

	onFileProgress: function(evt, index) {
		const percentage = evt.loaded / evt.total;
		const tempUploadRates = this.state.uploadRates;
		tempUploadRates[index] = percentage;
		this.setState({uploadRates: tempUploadRates});
	},

	onFileFinish: function(evt, index, type, filename, originalFilename) {
		const createAssetObject = new XMLHttpRequest();
		createAssetObject.addEventListener('load', (success)=> {
			// Set File to finished
			const tmpFiles = this.state.files;
			tmpFiles[index].isFinished = true;
			this.setState({files: tmpFiles});
			
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
			console.log(newAsset);
			if ('public_id' in serverResult) {
				newAsset.cloudinaryID = serverResult.public_id;	
			}

			this.props.addAsset(newAsset);
		});
		createAssetObject.open('GET', '/api/handleNewFile?contentType=' + type + '&url=https://s3.amazonaws.com/pubpub-upload/' + filename );
		createAssetObject.send();
	},

	render: function() {
		
		return (
			<Dropzone ref="dropzone" 
				onDrop={this.onDrop}
				disableClick
				style={styles.dropzone}
				activeStyle={styles.dropzoneActive}
			>
				<div style={baseStyles.modalContentContainer}>
					<h2 key="asset-modal-right-action" style={baseStyles.topHeader}>Assets</h2>
					<div style={baseStyles.rightCornerAction} onClick={this.onOpenClick}>Click to choose or drag files</div>
					<EditorModalAssetsRow isHeader={true} filename="refName" author="by" assetType="type" date="date" />

					{this.state.files.map((uploadAsset, index) => {
						console.log(this.state.uploadRates[index] * 100);
						const thumbnailImage = (uploadAsset.type.indexOf('image') > -1) ? uploadAsset.preview : '/thumbnails/file.png';
						return (uploadAsset.isFinished !== true
							? <EditorModalAssetsRow 
								key={'modalAssetUploading-' + index} 
								filename={uploadAsset.name} 
								thumbnail={thumbnailImage}
								isLoading={true}
								percentLoaded={this.state.uploadRates[index] * 100}/>
							: null);
						
					})} 

					{ () => {
						const assetList = [];
						for (let index = this.props.assetData.length; index > 0; index--) {
							const asset = this.props.assetData[index - 1];
							assetList.push(<EditorModalAssetsRow 
								key={'modalAsset-' + index} 
								filename={asset.originalFilename} 
								author={asset.author} 
								thumbnail={asset.thumbnail} 
								assetType={asset.assetType}
								date={asset.createDate}/>);
						}
						return assetList;
					}()}

					
				</div>
			</Dropzone>
		);
	}
});

export default Radium(EditorModalAssets);
