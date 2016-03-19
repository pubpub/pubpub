/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium from 'radium';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {EditorModalAssetsRow, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalSettings} from '../../components/EditorModals';
import {Menu} from '../../components';

import {closeModal, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {createAsset} from '../../actions/assets';
import {saveSettingsUser} from '../../actions/login';

import {globalStyles} from '../../utils/styleConstants';

import Dropzone from 'react-dropzone';
import {s3Upload} from '../../utils/uploadFile';

let FireBaseURL;
let styles;

const AssetLibrary = React.createClass({
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
		};
	},
	// TODO: On each load, we gotta load the user's assets again, in
	// case they've been updated by a co-author

	componentDidMount() {
	
	},

	componentWillReceiveProps(nextProps) {
	},

	componentWillUnmount() {
		this.props.dispatch(closeModal());
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
		// const createAssetObject = new XMLHttpRequest();
		// createAssetObject.addEventListener('load', (success)=> {
			
		// 	// Set File to finished in state. This will hide the uploading version
		// 	const tmpFiles = this.state.files;
		// 	tmpFiles[index].isFinished = true;
		// 	this.setState({
		// 		files: tmpFiles,
		// 		finishedUploads: this.state.finishedUploads + 1
		// 	});
			
		// 	// Create Firebase object and push it
		// 	const serverResult = JSON.parse(success.target.responseText);
		// 	const newAsset = {
		// 		url_s3: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
		// 		url: serverResult.url,
		// 		thumbnail: serverResult.thumbnail,
		// 		originalFilename: originalFilename,
		// 		filetype: type,
		// 		assetType: serverResult.assetType,
		// 		createDate: new Date().toString(),
		// 	};

		// 	// Call the addAsset function passed in as a prop
		// 	this.props.addAsset(newAsset);
		// });
		// createAssetObject.open('GET', '/api/handleNewFile?contentType=' + type + '&url=https://s3.amazonaws.com/pubpub-upload/' + filename );
		// createAssetObject.send();



		let assetType = 'data';
		if (type.indexOf('image') > -1) {
			assetType = 'image';
		} else if (type.indexOf('video') > -1) {
			assetType = 'video';
		}
		const newAsset = {
			assetType: assetType,
			label: filename, 
			assetData: {
				filetype: type,
				originalFilename: originalFilename,
				url: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
				thumbnail: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
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

	render: function() {
		const menuItems = [
			{ key: 'assets', string: 'Assets', function: ()=>{} },
			{ key: 'references', string: 'References', function: ()=>{} },
			{ key: 'highlights', string: 'Highlights', function: ()=>{} },
		];

		const userAssets = this.props.loginData.getIn(['userData', 'assets']).toJS() || [];
		const assets = [];
		const references = [];
		const highlights = [];
		for (let index = 0; index < userAssets.length; index++) {
			if (userAssets[index].assetType === 'reference') {
				references.push(userAssets[index]);
			} else if (userAssets[index].assetType === 'highlight') {
				highlights.push(userAssets[index]);
			} else {
				assets.push(userAssets[index]);
			}
		}
		console.log(assets, references, highlights);


		return (
			<div style={styles.container}>
				<div style={globalStyles.h1}>Media Library</div>
				{/* <div style={[globalStyles.simpleButton, styles.topRight]} key={'libraryClose'}>Close</div> */}

				<div style={globalStyles.subMenu}>
					<Menu items={menuItems} submenu={true}/>
				</div>

				<Dropzone ref="dropzone" onDrop={this.onDrop} disableClick style={styles.dropzone} activeStyle={styles.dropzoneActive}>

					<div style={styles.addSection}>
						<div style={[globalStyles.simpleButton]} key={'addAsset'} onClick={this.onOpenClick}>Add New Asset</div>
						<div>or drag files to this window to quickly add</div>
					</div>

				</Dropzone>

				<div>
					{/* Display all existing assets using EditorModalAssetsRow */}
					{(() => {
						const assetList = [];

						// Iterate through assetList in reverse order. So newest are at top
						for (let index = userAssets.length; index > 0; index--) {
							const asset = userAssets[index - 1];
							if (asset.assetData) {
								assetList.push(<EditorModalAssetsRow 
									key={'modalAsset-' + index} 
									keyChild={'modalAsset-' + index} 
									filename={asset.assetData.originalFilename} 
									thumbnail={asset.assetData.url} 
									assetType={asset.assetType}
									date={asset.createDate}/>);	
							}
							
						}
						return assetList;
					})()}
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
})( Radium(AssetLibrary) );

styles = {	
	container: {
		position: 'relative',
	},
	topRight: {
		position: 'absolute',
		top: '20px',
		right: '20px',
	},
	addSection: {
		padding: '20px',
	},
	dropzone: {
		width: '100%',
		minHeight: '430px',
	},
	dropzoneActive: {
		backgroundColor: '#F5F5F5',
		boxShadow: '0px 0px 20px rgba(0,0,0,0.6)',
	},
};
