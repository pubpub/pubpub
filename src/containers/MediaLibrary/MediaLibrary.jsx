/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';

import {Menu, Button} from 'components';

import MediaLibraryEditor from './MediaLibraryEditor';
import MediaLibraryRowAsset from './MediaLibraryRowAsset';
import MediaLibraryRowHighlight from './MediaLibraryRowHighlight';
import MediaLibraryRowReference from './MediaLibraryRowReference';

// import {saveCollaboratorsToPub} from 'actions/editor';

import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';

import Portal from 'react-portal';

import {createAsset, updateAsset} from './actions';

// let FireBaseURL;
let styles;

const MediaLibrary = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		slug: PropTypes.string,
		closeLibrary: PropTypes.func,
		codeMirrorInstance: PropTypes.object,
		showAssetEditorType: PropTypes.string,
		// assetEditorOnly: PropTypes.bool // If this is true, don't render any of the library content, just load straight into MediaLibraryEditor. Will need to pass through object
		dispatch: PropTypes.func,
	},

	getInitialState() {
		const initialState = {
			files: [],
			uploadRates: [],
			finishedUploads: 0,
		};

		if (!this.props.showAssetEditorType) {
			initialState.showMediaLibraryEditor = false;
			initialState.assetEditorType = undefined;
			initialState.assetEditorObject = {};
			initialState.activeSection = 'assets';
		} else {
			initialState.showMediaLibraryEditor = true;
			initialState.assetEditorType = this.props.showAssetEditorType;
			initialState.assetEditorObject = {};
			initialState.activeSection = null;
		}

		return initialState;
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
			label: originalFilename,
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

	setActiveSection: function(section) {
		return ()=>{
			this.setState({activeSection: section});
		};
	},

	openMediaLibraryEditor: function(assetObject) {
		return ()=>{
			this.setState({
				showMediaLibraryEditor: true,
				assetEditorType: assetObject.assetType,
				assetEditorObject: assetObject,
			});
		};

	},
	closeMediaLibraryEditor: function() {

		if (this.props.showAssetEditorType) {
			this.props.closeLibrary();
		}

		this.setState({
			showMediaLibraryEditor: false,
			assetEditorType: undefined,
			assetEditorObject: {},
		});

	},

	addAssets: function(newAssetArray) {
		for (let index = 0; index < newAssetArray.length; index++) {
			this.props.dispatch(createAsset(newAssetArray[index]));
		}

	},
	updateAssets: function(updatedAssetArray) {
		for (let index = 0; index < updatedAssetArray.length; index++) {
			this.props.dispatch(updateAsset(updatedAssetArray[index]));
		}
	},

	separateAssets: function(assetArray) {
		const assets = [];
		const references = [];
		const highlights = [];
		for (let index = 0; index < assetArray.length; index++) {
			if (assetArray[index].assetType === 'reference') {
				references.push(assetArray[index]);
			} else if (assetArray[index].assetType === 'highlight') {
				highlights.push(assetArray[index]);
			} else {
				assets.push(assetArray[index]);
			}
		}
		return {
			assets: assets,
			references: references,
			highlights: highlights
		};
	},

	insertAsset: function(assetObject) {
		return ()=>{
			const cm = this.props.codeMirrorInstance;
			const currentSelection = cm.getCursor();

			let inlineObject = {};
			switch (assetObject.assetType) {
			case 'image':
			case 'video':
				inlineObject = {pluginType: assetObject.assetType, source: {...assetObject.assetData, _id: assetObject._id, label: assetObject.label }};
				break;
			case 'reference':
				inlineObject = {pluginType: 'cite', reference: {...assetObject.assetData, _id: assetObject._id, label: assetObject.label }};
				break;
			case 'highlight':
				inlineObject = {pluginType: 'highlight', source: {...assetObject.assetData, _id: assetObject._id, label: assetObject.label }};
				break;
			default:
				inlineObject = undefined;
				break;
			}
			if (inlineObject) {
				cm.replaceRange('[[' + JSON.stringify(inlineObject) + ']]', {line: currentSelection.line, ch: currentSelection.ch});
				this.props.closeLibrary();
			}

		};

	},

	render: function() {
		const menuItems = [
			{ key: 'assets', string: <FormattedMessage {...globalMessages.assets}/>, function: this.setActiveSection('assets'), isActive: this.state.activeSection === 'assets' },
			{ key: 'references', string: <FormattedMessage {...globalMessages.references}/>, function: this.setActiveSection('references'), isActive: this.state.activeSection === 'references' },
			{ key: 'highlights', string: <FormattedMessage {...globalMessages.Highlights}/>, function: this.setActiveSection('highlights'), isActive: this.state.activeSection === 'highlights', noSeparator: true },
		];

		if (!this.props.loginData.get('loggedIn')) {
			return <h1><FormattedMessage id="asset.mustBeLogged" defaultMessage="Must be Logged In"/></h1>;
		}

		const userAssets = this.props.loginData.getIn(['userData', 'assets']).toJS() || [];
		const {assets, references, highlights} = this.separateAssets(userAssets);

		return (


				<Dropzone ref="dropzone" onDrop={this.onDrop} disableClick style={styles.dropzone} activeStyle={this.state.activeSection === 'assets' ? styles.dropzoneActive : {}}>
					<div>
						<Portal isOpened={this.state.showMediaLibraryEditor}>
							<div style={(!this.props.showAssetEditorType) ? styles.assetEditorWrapper : styles.assetUploaderWrapper}>
								<MediaLibraryEditor
									assetType={this.state.assetEditorType}
									assetObject={this.state.assetEditorObject}
									addAssets={this.addAssets}
									updateAssets={this.updateAssets}
									close={this.closeMediaLibraryEditor}
									assetLoading={this.props.loginData.get('assetLoading')}
									slug={this.props.slug} />
							</div>
						</Portal>

						{(this.state.activeSection) ?

						<div style={styles.container}>

							<div style={globalStyles.h1}>Media Library</div>


							<div style={globalStyles.subMenu}>
								<Menu items={menuItems} submenu={true}/>
							</div>

							{(() => {
								switch (this.state.activeSection) {
								case 'assets':
									return (
										<div>
											<div style={[styles.newButtonWrapper, {display: 'none'}]}>
												<Button
													key={'customStyleSaveButton'}
													label={'Add New Asset'}
													onClick={this.openMediaLibraryEditor({})}/>
											</div>

											<div style={styles.addSection}>
												<div><FormattedMessage id="asset.dragToAdd" defaultMessage="Drag files to this window to quickly add"/></div>
											</div>

											{/* <div style={styles.filterBar}>
												Filter: <div style={styles.filterMenuWrapper}> <Menu items={menuItems} submenu={true}/> </div>
											</div> */}

											<div>
												{/* Display all uploading using EditorModalAssetsRow */}
												{this.state.files.map((uploadAsset, index) => {
													const thumbnailImage = (uploadAsset.type.indexOf('image') > -1) ? uploadAsset.preview : '/thumbnails/file.png';
													return (uploadAsset.isFinished !== true
														? <MediaLibraryRowAsset
															key={'modalAssetUploading-' + index}
															assetObject={{
																_id: 'modalAssetUploading-' + index,
																label: uploadAsset.name,
																assetData: {
																	thumbnail: thumbnailImage
																}
															}}
															thumbnail={thumbnailImage}
															isLoading={true}
															percentLoaded={this.state.uploadRates[index] * 100}/>
														: null);

												})}

												{/* Display all existing assets using EditorModalAssetsRow */}
												{(() => {
													const assetList = [];

													// Iterate through assetList in reverse order. So newest are at top
													for (let index = assets.length; index > 0; index--) {
														const asset = assets[index - 1];
														if (asset.assetData) {
															assetList.push(<MediaLibraryRowAsset
																key={'assetRow-' + index}
																assetObject={asset}
																insertHandler={this.insertAsset}
																editHandler={this.openMediaLibraryEditor}
																removeHandler={()=>{}} />
															);
														}

													}
													return assetList;
												})()}
											</div>
										</div>
									);

								case 'references':
									return (
										<div>
											<div style={styles.newButtonWrapper}>
												<Button
													key={'customStyleSaveButton'}
													label={'Add New Reference'}
													onClick={this.openMediaLibraryEditor({assetType: 'reference'})}/>
											</div>

											{/* Display all existing references using MediaLibraryRowReference */}
											{(() => {
												const referenceList = [];

												// Iterate through referenceList in reverse order. So newest are at top
												for (let index = references.length; index > 0; index--) {
													const reference = references[index - 1];
													if (reference.assetData) {
														referenceList.push(<MediaLibraryRowReference
															key={'referenceRow-' + index}
															assetObject={reference}
															insertHandler={this.insertAsset}
															editHandler={this.openMediaLibraryEditor}
															removeHandler={()=>{}} />
														);

													}

												}
												return referenceList;
											})()}
										</div>

									);

								case 'highlights':
									return (
										<div>
											{/* Display all existing references using MediaLibraryRowReference */}
											{(() => {
												const highlightList = [];

												// Iterate through referenceList in reverse order. So newest are at top
												for (let index = highlights.length; index > 0; index--) {
													const highlight = highlights[index - 1];
													if (highlight.assetData) {
														highlightList.push(<MediaLibraryRowHighlight
															key={'highlightRow-' + index}
															assetObject={highlight}
															insertHandler={this.insertAsset}
															editHandler={this.openMediaLibraryEditor}
															removeHandler={()=>{}} />
														);

													}

												}
												return highlightList;
											})()}
										</div>
									);
								default:
									return null;
								}
							})()}

						</div>
						: null }

					</div>


				</Dropzone>


		);
	}

});

export default connect( state => {
	return {
		slug: state.router.params.slug,
		loginData: state.login
	};
})( Radium(MediaLibrary) );

styles = {
	container: {
		position: 'relative',
	},
	// topRight: {
	// 	position: 'absolute',
	// 	top: '20px',
	// 	right: '20px',
	// },
	newButtonWrapper: {
		position: 'absolute',
		top: 30,
		right: 20,
	},
	filterBar: {
		borderBottom: '1px solid #ccc',
		margin: '0px 20px',
	},
	filterMenuWrapper: {
		display: 'inline-block',
	},
	addSection: {
		padding: '20px',
	},
	dropzone: {
		minHeight: '100%',
	},
	dropzoneActive: {
		backgroundColor: '#CCC'
	},
	assetEditorWrapper: {
		...globalStyles.largeModal,
		zIndex: 502,
		fontFamily: 'Lato',
	},
	assetUploaderWrapper: {
		...globalStyles.mediumModal,
		zIndex: 502,
		fontFamily: 'Lato',
	},
};
