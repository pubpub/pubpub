import React, {PropTypes} from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import {baseStyles} from './modalStyle';

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
		// this.setState({
		// 	files: files
		// });
		const offset = this.state.uploadRates.length;
		for (let iii = offset; iii < (offset + files.length); iii++) {
			// this.state.files[iii] = files[iii];
			const formData = new FormData();
			formData.append('kitten', 'dog');
			formData.append('file', files[0]);
			const upload = new XMLHttpRequest();
			
			upload.addEventListener('progress', (eee)=>{
				console.log('in progress');
				this.updateUploadRates(eee, iii);
			}, false);
			upload.addEventListener('load', (eee)=>{
				this.finishUploadRates(iii);
			}, false);
			upload.open('POST', '/api/uploadFile', true);
			upload.send(formData);
		}

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
	updateUploadRates: function(eee, index) {
		console.log(index);
		const percent = eee.loaded / eee.total;
		const tmpRates = this.state.uploadRates;
		tmpRates[index] = percent;
		this.setState({
			uploadRates: tmpRates
		});
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
