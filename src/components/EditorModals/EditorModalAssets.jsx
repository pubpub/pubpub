import React, {PropTypes} from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import {baseStyles} from './modalStyle';
var xhr;
const styles = {
	dropzone: {
		width: '100%',
		height: '100%',
	},
	dropzoneActive: {
		backgroundColor: '#F5F5F5',
		boxShadow: '0px 0px 20px rgba(0,0,0,0.6)',
	},
};

const EditorModalAssets = React.createClass({
	propTypes: {
		activeModal: PropTypes.string,
		assetData: PropTypes.array
	},

	getInitialState: function() {
		return {
			files: [],
			uploads: [],
			uploadRates: []
		};
	},

	
	onDrop: function(files) {
		
		console.log('Received files: ', files);
		function updateProgress (oEvent) {
		  if (oEvent.lengthComputable) {
		    var percentComplete = oEvent.loaded / oEvent.total;
		    // ...
		  } else {
		    // Unable to compute progress information since the total size is unknown
		  }
		}

		function transferComplete(evt) {
		  console.log("The transfer is complete.");
		}

		function transferFailed(evt) {
		  console.log("An error occurred while transferring the file.");
		}

		function transferCanceled(evt) {
		  console.log("The transfer has been canceled by the user.");
		}
		function reqListener() {
			// console.log(JSON.parse(this.responseText));
			console.log('in listener');
			const filename = 'kittenhawk_' + files[0].name;
			const formData = new FormData();
			formData.append('key', filename);
			formData.append('AWSAccessKeyId', 'AKIAJ5ELPUZ6MKEZGCOQ');
			formData.append('acl', 'public-read');
			formData.append('policy', JSON.parse(this.responseText).policy);
			formData.append('signature', JSON.parse(this.responseText).signature);
			formData.append('Content-Type', files[0].type);
			formData.append('success_action_status', '200');
			formData.append('file', files[0]);
			xhr = new XMLHttpRequest();
			
			xhr.upload.addEventListener('progress', (evt)=>{
				console.log('in progress');
				console.log(evt.loaded/evt.total);
			}, false);
			xhr.upload.addEventListener('load', (evt)=>{
				console.log('all finished');
				console.log(evt);
			}, false);
			xhr.open('POST', 'http://pubpub-upload.s3.amazonaws.com/', true);
			xhr.send(formData);
		}
		const oReq = new XMLHttpRequest();
		oReq.addEventListener('load', reqListener);
		oReq.open('GET', '/api/uploadPolicy?contentType=' + files[0].type);
		oReq.send();
		// this.setState({
		// 	files: files
		// });
		// const offset = this.state.uploadRates.length;
		// for (let iii = offset; iii < (offset + files.length); iii++) {
		// 	// this.state.files[iii] = files[iii];
			// const formData = new FormData();
			// formData.append('kitten', 'dog');
			// formData.append('file', files[iii]);
			// const upload = new XMLHttpRequest();
			
			// upload.addEventListener('progress', (eee)=>{
			// 	console.log('in progress');
			// 	this.updateUploadRates(eee, iii);
			// }, false);
			// upload.addEventListener('load', (eee)=>{
			// 	this.finishUploadRates(iii);
			// }, false);
			// upload.open('POST', '/api/uploadFile', true);
			// upload.send(formData);
		// }

	},

	
	onOpenClick: function() {
		this.refs.dropzone.open();
	},
	finishUploadRates: function(index) {
		
		const tmpRates = this.state.uploadRates;
		tmpRates[index] = 5;
		this.setState({
			uploadRates: tmpRates
		});
	},
	updateUploadRates: function(eee) {
		console.log('in upload');
		console.log(eee);
		// console.log(index);
		// const percent = eee.loaded / eee.total;
		// const tmpRates = this.state.uploadRates;
		// tmpRates[index] = percent;
		// this.setState({
		// 	uploadRates: tmpRates
		// });
	},
	uploadOnProgress: function(eee) {
		console.log(eee);
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
