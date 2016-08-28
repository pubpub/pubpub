import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {ensureImmutable} from 'reducers';
import {AtomViewerPane} from 'containers/Atom/AtomViewerPane';
import {AtomEditorPane} from 'containers/Atom/AtomEditorPane';
import fuzzy from 'fuzzy';
import {RadioGroup, Radio} from 'utils/ReactRadioGroup';
import {LoaderDeterminate, NavContentWrapper} from 'components';
import Select from 'react-select';
import {PreviewEditor} from 'components';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';
import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';
import {getMedia, createAtom, saveVersion} from './actions';
import {addContributor, updateContributor, deleteContributor} from 'containers/Atom/actions';

import atomTypes from 'components/AtomTypes';

let styles;

export const Manage = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		// Functions that allow callbacks on saveVersion or Insert
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			filter: '',
			createNewType: 'document',

			// nodeData: {},
			// atomMode: 'recent',
			// editNodeDataMode: false,
			uploadRates: [],
			uploadFiles: [],
		};
	},

	componentDidMount() {
		this.props.dispatch(getMedia());
	},

	componentWillReceiveProps(nextProps) {
		// const oldMediaData = safeGetInToJS(this.props.mediaData, []);
		// const newMediaData = safeGetInToJS(nextProps.mediaData, []);
		// if (oldMediaData.mediaItems.length < newMediaData.mediaItems.length) {
		// 	this.setState({atomMode: 'recent'});
		// }

		// if (this.state.editNodeDataMode && !oldMediaData.newNodeData && newMediaData.newNodeData) {
		// 	this.setState({
		// 		nodeData: {
		// 			align: 'full',
		// 			mode: newMediaData.newNodeData.type === 'reference' ? 'cite' : 'embed',
		// 			...this.state.nodeData,
		// 			data: newMediaData.newNodeData
		// 		},
		// 		editNodeDataMode: false,
		// 	});
		// }
	},

	// setAtomMode: function(mode) {
	// 	this.setState({atomMode: mode});
	// },

	// clearNodeData: function() {
	// 	this.setState({nodeData: {...this.state.nodeData, data: undefined}}); // Is this right? Do we want nodeData to just be an empty object?
	// },

	// editNodeData: function() {
	// 	this.setState({editNodeDataMode: true});
	// },

	// cancelEditNodeData: function() {
	// 	let nodeData = this.state.nodeData;
	// 	if (!this.state.nodeData.data.content) {
	// 		nodeData = {};
	// 	}
	// 	this.setState({
	// 		editNodeDataMode: false,
	// 		nodeData: nodeData,
	// 	});
	// },

	filterChange: function(evt) {
		this.setState({filter: evt.target.value});
	},

	// inputChange: function(type, evt) {
	// 	if (type === 'caption') {
	// 		this.setState({nodeData: {...this.state.nodeData, caption: evt.target.value}});
	// 	}

	// 	if (type === 'size') {
	// 		this.setState({nodeData: {...this.state.nodeData, size: evt.target.value}});
	// 	}

	// 	if (type === 'mode') {
	// 		this.setState({nodeData: {...this.state.nodeData, mode: evt}});
	// 	}

	// 	if (type === 'align') {
	// 		this.setState({nodeData: {...this.state.nodeData, align: evt}});
	// 	}

	// 	if (type === 'className') {
	// 		this.setState({nodeData: {...this.state.nodeData, className: evt.target.value}});
	// 	}
	// },

	// close: function() {
	// 	this.setState({
	// 		showMedia: false,
	// 		closeCallback: undefined,
	// 		filter: '',
	// 		nodeData: {},
	// 		editNodeDataMode: false,
	// 	});
	// },


	// On file drop (or on file select)
	// Upload files automatically to s3
	// On completion call function that hits the pubpub server to generate asset information
	// Generated asset information is then sent to Firebase for syncing with other users
	onDrop: function(files) {
		// console.log(files);
		// return;

		// if (this.state.activeSection !== 'assets') {
		// 	return;
		// }

		// // Add new files to existing set, so as to not overwrite existing uploads
		// const existingFiles = this.state.files.length;
		// const tmpFiles = this.state.files.concat(files);

		// // For each new file, begin their upload process
		// for (let fileCount = existingFiles; fileCount < existingFiles + files.length; fileCount++) {
		// 	s3Upload(tmpFiles[fileCount], this.props.slug, this.onFileProgress, this.onFileFinish, fileCount);
		// }

		// // Set state with newly added files
		// this.setState({files: tmpFiles});

		const startingFileIndex = this.state.uploadRates.length;
		const newUploadRates = files.map((file)=> {
			return 0;
		});
		const newUploadFiles = files.map((file)=> {
			return file.name;
		});
		const uploadRates = this.state.uploadRates.concat(newUploadRates);
		const uploadFiles = this.state.uploadFiles.concat(newUploadFiles);


		files.map((file, index)=> {
			s3Upload(file, this.onFileProgress, this.onFileFinish, startingFileIndex + index);
		});

		this.setState({
			// nodeData: {
			// 	...this.state.nodeData,
			// 	data: undefined
			// },
			// atomMode: 'recent',
			uploadRates: uploadRates,
			uploadFiles: uploadFiles,
		});

	},

	onSelect: function(evt) {
		const selectedFiles = [];
		for (let index = 0; index < evt.target.files.length; index++) {
			selectedFiles.push(evt.target.files[index]);
		}
		this.onDrop(selectedFiles);
		document.getElementById('media-file-select').value = '';
	},

	// Update state's progress value when new events received.
	onFileProgress: function(evt, index) {
		const percentage = evt.loaded / evt.total;
		const tempUploadRates = this.state.uploadRates;
		tempUploadRates[index] = percentage;
		this.setState({uploadRates: tempUploadRates});
	},

	onFileFinish: function(evt, index, type, filename, title) {

		let atomType = undefined;
		const extension = filename.split('.').pop();
		switch (extension) {
		case 'jpg':
		case 'png':
		case 'jpeg':
		case 'tiff':
		case 'gif':
			atomType = 'image'; break;
		case 'pdf':
			atomType = 'pdf'; break;
		case 'ipynb':
			atomType = 'jupyter'; break;
		case 'mp4':
		case 'ogg':
		case 'webm':
			atomType = 'video'; break;
		case 'csv':
			atomType = 'table'; break;
		default:
			break;
		}

		const versionContent = {
			url: 'https://assets.pubpub.org/' + filename
		};
		this.props.dispatch(createAtom(atomType, versionContent, title));
	},

	saveVersionHandler: function(versionMessage) {
		const newVersionContent = this.refs.atomEditorPane.refs.editor.getSaveVersionContent();

		const atomData = this.state.nodeData.data.parent;
		console.log(this.state.nodeData.data);
		if (atomData._id) {
			const newVersion = {
				type: atomData.type,
				// message: versionMessage,
				message: '',
				parent: atomData._id,
				content: newVersionContent
			};
			console.log('Save a version with version stuff!');
			console.log(newVersion);
			this.props.dispatch(saveVersion(newVersion));
		} else {
			const atomType = this.state.nodeData.data.type;
			console.log('Create a new atom with version stuff!');
			console.log(newVersionContent);
			let title = null;
			if (atomType === 'reference') {
				title = newVersionContent.title;
			}
			this.props.dispatch(createAtom(atomType, newVersionContent, title));
		}
	},

	// save: function() {
	// 	const versionData = {
	// 		_id: '578951a86dcc445787b0ef5a',
	// 		type: 'image',
	// 		message: '',
	// 		parent: {
	// 			_id: '578951a86dcc445787b0ef57',
	// 			slug: '95e48c3441a46bf95481b60dbaeaba469b2d4d74',
	// 			title: 'New Pub: 1468617128060',
	// 			type: 'image',
	// 		},
	// 		content: {
	// 			url: 'https://assets.pubpub.org/uiyvascj/1468617127681.gif',
	// 		}
	// 	};
	// 	this.saveItem(versionData);
	// },

	// setItem: function(item) {
	// 	const nodeData = this.state.nodeData || {};
	// 	console.log(item);
	// 	this.setState({
	// 		nodeData: {
	// 			source: item._id,
	// 			className: nodeData.className || '',
	// 			id: item._id,
	// 			align: nodeData.align || 'full',
	// 			size: nodeData.size || '',
	// 			caption: nodeData.caption || '',
	// 			mode: nodeData.mode || 'embed',
	// 			data: item,
	// 		},
	// 	});
	// },

	// saveItem: function(evt) {
	// 	evt.preventDefault();
	// 	const nodeData = this.state.nodeData;
	// 	this.state.closeCallback({
	// 		source: nodeData.data._id,
	// 		className: nodeData.className,
	// 		id: nodeData.data._id,
	// 		align: nodeData.align,
	// 		size: nodeData.size,
	// 		caption: nodeData.caption,
	// 		mode: nodeData.mode,
	// 		data: nodeData.data,
	// 	});
	// 	this.setState({
	// 		showMedia: false,
	// 		closeCallback: undefined,
	// 		filter: '',
	// 	});

	// },

	handleCreateNewChange: function(item) {
		this.setState({createNewType: item});
	// 	const newThing = {
	// 		nodeData: {
	// 			data: {
	// 				type: item.value,
	// 				parent: {
	// 					title: 'New ' + item.value,
	// 					type: item.value,
	// 				}
	// 			}
	// 		},
	// 		editNodeDataMode: true,
	// 	};
	// 	console.log(newThing);
	// 	this.setState(newThing);
	// 	// console.log(item.value);
	},

	createNew: function() {
		console.log(this.state.createNewType);
	},

	setFilter: function(string) {
		this.setState({filter: string});
	},

	handleAddContributor: function(atomID, contributorID) {
		this.props.dispatch(addContributor(atomID, contributorID));
	},

	handleUpdateContributor: function(linkID, linkType, linkRoles) {
		this.props.dispatch(updateContributor(linkID, linkType, linkRoles));
	},

	handleDeleteContributor: function(linkID) {
		this.props.dispatch(deleteContributor(linkID));
	},

	render: function() {

		const mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		const allTypes = mediaItems.map((item)=> {
			return item.type;
		});
		const allUniqueTypes = [...new Set(allTypes)];

		const typeFilters = this.state.filter.match(/type:([a-zA-Z]*)/gi) || [];
		const typesFiltered = typeFilters.map((type)=> {
			return type.replace('type:', '');
		}).filter((item)=> {
			return !!item;
		});
		
		console.log(typesFiltered);
		// Populate type filters with filter types, check to see for each item if type is in that array

		const mediaItemsFilterForType = mediaItems.filter((item)=> {
			if (typesFiltered.length === 0) {
				return true;
			}
			// return true;
			// if (this.state.atomMode === 'all' || this.state.atomMode === 'recent') { return true; }
			return typesFiltered.includes(item.type);
		});

		const filteredItems = fuzzy.filter(this.state.filter.replace(/type:([a-zA-Z]*)/gi, ''), mediaItemsFilterForType, {extract: (item)=>{ return item.type + ' ' + item.parent.title;} });
		// const nodeData = this.state.nodeData || {};

		// const mobileNavButtons = [
		// 	{ type: 'button', mobile: true, text: 'Pubs', action: this.followUserToggle },
		// 	{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		// ];

		// const navItems = [
		// 	{ type: 'button', text: 'All', action: this.setAtomMode.bind(this, 'all'), active: this.state.atomMode === 'all'},
		// 	{ type: 'button', text: 'Recent', action: this.setAtomMode.bind(this, 'recent'), active: this.state.atomMode === 'recent'},
		// 	{ type: 'spacer'},
		// 	{ type: 'button', text: 'Images', action: this.setAtomMode.bind(this, 'image'), active: this.state.atomMode === 'image'},
		// 	{ type: 'button', text: 'Videos', action: this.setAtomMode.bind(this, 'video'), active: this.state.atomMode === 'video'},
		// 	{ type: 'button', text: 'References', action: this.setAtomMode.bind(this, 'reference'), active: this.state.atomMode === 'reference'},
		// 	{ type: 'button', text: 'Jupyter', action: this.setAtomMode.bind(this, 'jupyter'), active: this.state.atomMode === 'jupyter'},
		// 	{ type: 'button', text: 'Documents', action: this.setAtomMode.bind(this, 'document'), active: this.state.atomMode === 'document'},
		// ];


		const options = Object.keys(atomTypes).sort((foo, bar)=>{
			// Sort so that alphabetical
			if (foo > bar) { return 1; }
			if (foo < bar) { return -1; }
			return 0;
		});
		console.log('rerendering manage');
		return (
			<div style={{backgroundColor: '#999', padding: '3em'}}>
			<Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} >
			<div style={{backgroundColor: 'white'}}>

				<div style={styles.mediaSelect}>

					<div style={styles.mediaSelectHeader}>

						<div style={styles.addNewDropdown}>
							<div className={'light-button arrow-down-button'} style={{position: 'relative'}}><span style={{textTransform: 'capitalize'}}>{this.state.createNewType}</span>
								<div className={'hoverChild arrow-down-child'}>
									{options.map((option)=>{
										return <div key={'setType-' + option} onClick={this.handleCreateNewChange.bind(this, option)} style={{textTransform: 'capitalize'}}>{option}</div>;
									})}
								</div>
							</div>

							{/*<Select
								name={'new-atom-select'}
								options={options}
								value={this.state.createNewType}
								placeholder={<span>Add new</span>}
								onChange={this.handleSelectChange} 
								clearable={false} />*/}
						</div>
						<div className={'button'} onClick={this.createNew} style={{padding: 'calc(.3em + 1px) 1em', verticalAlign: 'top', left: '-2px'}}>Create New</div>


						<div className={'button'} style={styles.dropzoneBlock}>
							Click or Drag files to add
							<input id={'media-file-select'} type={'file'} onChange={this.onSelect} multiple={true} style={styles.fileInput}/>
						</div>

					</div>

					{this.state.uploadFiles.map((uploadFile, index)=> {
						return (
							<div key={'uploadFile-' + index} style={[styles.uploadBar, this.state.uploadRates[index] === 1 && {display: 'none'}]}>
								{uploadFile}
								<LoaderDeterminate value={this.state.uploadRates[index] * 100} />
							</div>
						);
					})}

						<div className={'light-button arrow-down-button'} style={{position: 'relative'}}>Filter
							<div className={'hoverChild arrow-down-child'}>
								{allUniqueTypes.sort((foo, bar)=>{
									// Sort so that alphabetical
									if (foo > bar) { return 1; }
									if (foo < bar) { return -1; }
									return 0;
								}).map((item)=> {
									return <div key={'filter-type-' + item} onClick={this.setFilter.bind(this, ('type:' + item))} style={{textTransform: 'capitalize'}}>{item}</div>;
								})}
							</div>
						</div>
						<input type="text" placeholder={'Filter'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>

						{filteredItems.splice(0, 20).map((item)=> {
							return item.original;
						}).sort((foo, bar)=>{
							// Sort so that most recent is first in array
							if (foo.parent.lastUpdated > bar.parent.lastUpdated) { return -1; }
							if (foo.parent.lastUpdated < bar.parent.lastUpdated) { return 1; }
							return 0;
						}).map((item, index)=> {
							if (this.state.atomMode === 'recent' && index > 9) {
								return null;
							}
							// const previewImage = item.parent.previewImage.indexOf('.gif') > -1 ? item.parent.previewImage : 'https://jake.pubpub.org/unsafe/fit-in/50x50/' + item.parent.previewImage;
							const buttons = [ 
								{ type: 'link', text: 'Custom Button', link: '/pub/' + item.slug + '/edit' },
							];

							return (
								// TODO
								// Make an 'editorPreviewCard' component?
								// Test uploading to make sure it works
								// Add bibtex back into reference editor
								<PreviewEditor 
									key={'atomItem-' + item._id}
									atomData={item.parent}
									versionData={item}
									contributorsData={item.contributors}
									footer={ <div> <input type="checkbox" /> Show on profile</div> }
									buttons = {buttons} 

									onSaveVersion={this.onSaveVersion}
									onSaveAtom={this.onSaveAtom}
									updateDetailsHandler={this.updateDetailsHandler}
									handleAddContributor={this.handleAddContributor}
									handleUpdateContributor={this.handleUpdateContributor}
									handleDeleteContributor={this.handleDeleteContributor}

									contributorsLoading={false}
									detailsLoading={false}
									contributorsError={false}
									detailsError={false}
									permissionType={item.permissionType}/>

								/*<div key={'media-item-' + item._id} style={styles.item}>
									<div style={styles.itemPreview}>
										<img style={styles.itemPreviewImage} src={previewImage} alt={item.parent.title} title={item.parent.title}/>
									</div>

									<div style={styles.itemDetail}>
										<div style={styles.itemDetailTitle}>{item.parent.title}</div>
									</div>
								</div>*/
							);
						})}

				</div>


				{/* If we DO have a chosen atom  and are trying to edit it*/}
				{/* nodeData.data && this.state.editNodeDataMode &&
					<div style={styles.mediaDetails}>
						<div style={styles.editModeHeader}>
							<h3 style={styles.detailsTitle}>{nodeData.data.parent.title}</h3>
							<div style={styles.detailsCancel} className={'underlineOnHover'} onClick={this.cancelEditNodeData}>Cancel</div>
							<div style={styles.detailsButtonWrapper}>
								<div className={'button'} style={styles.detailsButton} onClick={this.saveVersionHandler}>Save Version</div>
							</div>
						</div>

						<div style={styles.details}>
							<AtomEditorPane ref={'atomEditorPane'} atomData={ensureImmutable({ atomData: nodeData.data.parent, currentVersionData: nodeData.data })}/>
						</div>


					</div>
				*/}
			</div>

			<div className={'showOnActive'}>Drop files to add</div>
			</Dropzone>
			</div>
		);
	}

});

export default connect( state => {
	return {
		mediaData: state.manage,
	};
})( Radium(Manage) );

styles = {
	editModeHeader: {
		display: 'table',
		padding: '.5em 0em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	container: {
		// position: 'fixed',
		// top: 0,
		// left: 0,
		// width: '100vw',
		// height: '100vh',
		// backgroundColor: 'rgba(0,0,0,0.6)',
		// zIndex: 999,
		// opacity: 0,
		// pointerEvents: 'none',
		// transition: '.1s linear opacity',
	},
	containerActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	splash: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		zIndex: 1000,
	},
	modalContent: {
		position: 'fixed',
		zIndex: 10001,
		// width: 'calc(80vw - 2em)',
		// maxHeight: 'calc(92vh - 4em)',
		maxHeight: '92vh',
		top: '4vh',
		left: '5vw',
		right: '5vw',
		backgroundColor: 'white',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 0px 3px rgba(0,0,0,0.7)',
		transform: 'scale(0.8)',
		transition: '.1s ease-in-out transform',
		borderRadius: '2px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// width: 'calc(98vw - 2em)',
			height: 'calc(98vh - 2em)',
			top: '1vh',
			left: '1vw',
			right: '1vw',
			padding: '1em',
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
	},
	mediaSelect: {
		// padding: '1em 0em',
	},
	mediaSelectHeader: {
		padding: '1em 0em',
	},
	mediaDetails: {
		padding: '1em 2em',
	},
	filterInput: {
		display: 'inline-block',
		// width: 'calc(100% - 20px - 4px)',
		// borderWidth: '0px 0px 2px 0px',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	textarea: {
		height: '4em',
	},
	item: {
		margin: '1em 0em',
		backgroundColor: '#F3F3F4',
		cursor: 'pointer',
		// display: 'inline-block',
		width: '100%',
		height: '50px',
		overflow: 'hidden',
		display: 'table',
	},
	itemPreview: {
		width: '1%',
		height: '50px',
		marginRight: '1em',
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	itemPreviewImage: {
		maxWidth: '50px',
		maxHeight: '50px',
	},
	itemDetail: {
		display: 'table-cell',
		verticalAlign: 'middle',
		padding: '1em',
	},
	details: {
		display: 'table',
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	detailsPreview: {
		display: 'table-cell',
		verticalAlign: 'middle',
		position: 'relative',
		textAlign: 'center',
		padding: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '1em 0em',
		},
	},
	detailsForm: {
		display: 'table-cell',
		width: '50%',
		padding: '2em 1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
			padding: '2em 0em',
		},
	},
	detailsTitle: {
		left: 0,
		display: 'table-cell',
	},
	detailsClear: {
		display: 'inline-block',
		cursor: 'pointer',
	},
	detailsCancel: {
		cursor: 'pointer',
		display: 'table-cell',
		width: '1%',
		padding: '0em 1em',
	},
	detailsButtonWrapper: {
		display: 'table-cell',
		width: '1%',
	},
	detailsButton: {
		padding: '0em 1em',
		whiteSpace: 'nowrap',
	},
	radioInput: {
		margin: '0em 0em 1em 0em',
	},
	radioLabel: {
		display: 'inline-block',
		fontSize: '0.95em',
		margin: '0em 2em 1em 0em',
	},
	disabledInput: {
		opacity: 0.5,
		pointerEvents: 'none',
	},
	addNewDropdown: {
		// width: '250px',
		display: 'inline-block',
		minWidth: '150px',
	},
	dropzoneBlock: {
		padding: '0em 2em',
		margin: '0em 1em',
		fontSize: '0.85em',
		borderStyle: 'dashed',
		height: '34px',
		lineHeight: '34px',
		verticalAlign: 'top',
		position: 'relative',
		overflow: 'hidden',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '0em',
		},
	},
	fileInput: {
		marginBottom: '0em',
		width: '100%',
		position: 'absolute',
		height: 'calc(100% + 20px)',
		left: 0,
		top: -20,
		padding: 0,
		cursor: 'pointer',
		opacity: 0,
	},
	uploadBar: {
		margin: '0em 2em 1em',
		overflow: 'hidden',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '0em 0em 1em',
		},
	},

};
