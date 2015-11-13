import React, {PropTypes} from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import {baseStyles} from './modalStyle';
import {s3Upload} from '../../utils/uploadFile';

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
		const vReq = new XMLHttpRequest();
		vReq.addEventListener('load', (success)=> {
			console.log('in postCloud Load');
			console.log(JSON.parse(success.target.responseText));
			console.log('----');
			// Set File to finished
			const tmpFiles = this.state.files;
			tmpFiles[index].isFinished = true;
			this.setState({files: tmpFiles});
			
			// Create Firebase object and push it
			const serverResult = JSON.parse(success.target.responseText);
			const newAsset = {
				url_s3: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
				url: serverResult.url,
				originalFilename: originalFilename,
				filetype: type,
				createDate: new Date(),
			};

			if ('public_id' in serverResult) {
				newAsset.cloudinaryID = serverResult.public_id;	
			}

			this.props.addAsset(newAsset);
		});
		vReq.open('GET', '/api/handleNewFile?contentType=' + type + '&url=https://s3.amazonaws.com/pubpub-upload/' + filename );
		vReq.send();
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
					{JSON.stringify(this.state.uploadRates)}
					{this.props.assetData.map( (asset, index)=> {
						return (<div key={'asset-modal-item-' + index}>{asset.assetName}</div>);
					})}
					{this.state.files.length > 0 ? <div>
						<h2>Uploading {this.state.files.length} files...</h2>
						<div>{this.state.files.map((file, index) => <img key={'asdd' + index}src={file.preview} /> )}</div>
					</div> : null}

					{JSON.stringify(this.props.assetData)}
				</div>
			</Dropzone>
		);
	}
});

export default Radium(EditorModalAssets);
