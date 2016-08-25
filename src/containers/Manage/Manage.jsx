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

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';
import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';
import {getMedia, createAtom, saveVersion} from './actions';

let styles;

export const Manage = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			showMedia: false,
			closeCallback: undefined,
			filter: '',
			nodeData: {},
			atomMode: 'recent',
			editNodeDataMode: false,
			uploadRates: [],
			uploadFiles: [],
		};
	},

	componentDidMount() {
		this.props.dispatch(getMedia());
		window.toggleMedia = this.toggleMedia;
		document.addEventListener('keydown', this.closeOnEscape);
	},
	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeOnEscape);
	},

	componentWillReceiveProps(nextProps) {
		const oldMediaData = safeGetInToJS(this.props.mediaData, []);
		const newMediaData = safeGetInToJS(nextProps.mediaData, []);
		if (oldMediaData.mediaItems.length < newMediaData.mediaItems.length) {
			this.setState({atomMode: 'recent'});
		}

		if (this.state.editNodeDataMode && !oldMediaData.newNodeData && newMediaData.newNodeData) {
			this.setState({
				nodeData: {
					align: 'full',
					mode: newMediaData.newNodeData.type === 'reference' ? 'cite' : 'embed',
					...this.state.nodeData,
					data: newMediaData.newNodeData
				},
				editNodeDataMode: false,
			});
		}
	},

	closeOnEscape: function(evt) {
		let isEscape = false;
		if ('key' in evt) {
			isEscape = evt.key === 'Escape';
		} else {
			isEscape = evt.keyCode === 27;
		}

		if (isEscape) {
			this.close();
		}
	},

	setAtomMode: function(mode) {
		this.setState({
			atomMode: mode
		});
	},

	toggleMedia: function(pm, callback, node) {
		this.setState({
			showMedia: true,
			closeCallback: callback,
			nodeData: typeof node.attrs.source === 'string' ? node.attrs : undefined,
		});
	},

	clearNodeData: function() {
		this.setState({nodeData: {...this.state.nodeData, data: undefined}}); // Is this right? Do we want nodeData to just be an empty object?
	},

	editNodeData: function() {
		this.setState({editNodeDataMode: true});
	},
	cancelEditNodeData: function() {
		let nodeData = this.state.nodeData;
		if (!this.state.nodeData.data.content) {
			nodeData = {};
		}
		this.setState({
			editNodeDataMode: false,
			nodeData: nodeData,
		});
	},

	filterChange: function(evt) {
		this.setState({filter: evt.target.value});
	},

	inputChange: function(type, evt) {
		if (type === 'caption') {
			this.setState({nodeData: {...this.state.nodeData, caption: evt.target.value}});
		}

		if (type === 'size') {
			this.setState({nodeData: {...this.state.nodeData, size: evt.target.value}});
		}

		if (type === 'mode') {
			this.setState({nodeData: {...this.state.nodeData, mode: evt}});
		}

		if (type === 'align') {
			this.setState({nodeData: {...this.state.nodeData, align: evt}});
		}

		if (type === 'className') {
			this.setState({nodeData: {...this.state.nodeData, className: evt.target.value}});
		}
	},

	close: function() {
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
			nodeData: {},
			editNodeDataMode: false,
		});
	},


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
			nodeData: {
				...this.state.nodeData,
				data: undefined
			},
			atomMode: 'recent',
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

	setItem: function(item) {
		const nodeData = this.state.nodeData || {};
		console.log(item);
		this.setState({
			nodeData: {
				source: item._id,
				className: nodeData.className || '',
				id: item._id,
				align: nodeData.align || 'full',
				size: nodeData.size || '',
				caption: nodeData.caption || '',
				mode: nodeData.mode || 'embed',
				data: item,
			},
		});
	},

	saveItem: function(evt) {
		evt.preventDefault();
		const nodeData = this.state.nodeData;
		this.state.closeCallback({
			source: nodeData.data._id,
			className: nodeData.className,
			id: nodeData.data._id,
			align: nodeData.align,
			size: nodeData.size,
			caption: nodeData.caption,
			mode: nodeData.mode,
			data: nodeData.data,
		});
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		});

	},

	handleSelectChange: function(item) {
		const newThing = {
			nodeData: {
				data: {
					type: item.value,
					parent: {
						title: 'New ' + item.value,
						type: item.value,
					}
				}
			},
			editNodeDataMode: true,
		};
		console.log(newThing);
		this.setState(newThing);
		// console.log(item.value);
	},

	render: function() {

		const mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		const mediaItemsFilterForType = mediaItems.filter((item)=> {
			if (this.state.atomMode === 'all' || this.state.atomMode === 'recent') { return true; }
			return item.type === this.state.atomMode;
		});
		const filteredItems = fuzzy.filter(this.state.filter, mediaItemsFilterForType, {extract: (item)=>{ return item.type + ' ' + item.parent.title;} });
		const nodeData = this.state.nodeData || {};

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: 'Pubs', action: this.followUserToggle },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const navItems = [
			{ type: 'button', text: 'All', action: this.setAtomMode.bind(this, 'all'), active: this.state.atomMode === 'all'},
			{ type: 'button', text: 'Recent', action: this.setAtomMode.bind(this, 'recent'), active: this.state.atomMode === 'recent'},
			{ type: 'spacer'},
			{ type: 'button', text: 'Images', action: this.setAtomMode.bind(this, 'image'), active: this.state.atomMode === 'image'},
			{ type: 'button', text: 'Videos', action: this.setAtomMode.bind(this, 'video'), active: this.state.atomMode === 'video'},
			{ type: 'button', text: 'References', action: this.setAtomMode.bind(this, 'reference'), active: this.state.atomMode === 'reference'},
			{ type: 'button', text: 'Jupyter', action: this.setAtomMode.bind(this, 'jupyter'), active: this.state.atomMode === 'jupyter'},
			{ type: 'button', text: 'Documents', action: this.setAtomMode.bind(this, 'document'), active: this.state.atomMode === 'document'},
		];


		const options = [
			{value: 'image', label: 'image'},
			{value: 'video', label: 'video'},
			{value: 'latex', label: 'equation'},
			{value: 'reference', label: 'reference'},
			{value: 'jupyter', label: 'jupyter'},
			{value: 'iframe', label: 'iframe'},
		];
		return (
			<Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} >
			<div>

				{/* If we DON'T have a chosen atom */}
				{!nodeData.data &&
					<div style={styles.mediaSelect}>

						<div style={styles.mediaSelectHeader}>

							<div style={styles.addNewDropdown}>
								<Select
									name={'new-atom-select'}
									options={options}
									value={null}
									placeholder={<span>Add new </span>}
									onChange={this.handleSelectChange} />

							</div>


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

						<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
							<input type="text" placeholder={'Filter'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>
							{filteredItems.map((item)=> {
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
								const previewImage = item.parent.previewImage.indexOf('.gif') > -1 ? item.parent.previewImage : 'https://jake.pubpub.org/unsafe/fit-in/50x50/' + item.parent.previewImage;
								return (
									<div key={'media-item-' + item._id} onClick={this.setItem.bind(this, item)} style={styles.item}>
										<div style={styles.itemPreview}>
											<img style={styles.itemPreviewImage} src={previewImage} alt={item.parent.title} title={item.parent.title}/>
										</div>

										<div style={styles.itemDetail}>
											<div style={styles.itemDetailTitle}>{item.parent.title}</div>
										</div>
									</div>
								);
							})}
						</NavContentWrapper>

					</div>
				}

				{/* If we DO have a chosen atom */}
				{nodeData.data && !this.state.editNodeDataMode &&
					<div style={styles.mediaDetails}>
						<div style={styles.editModeHeader}>
							<h3 style={styles.detailsTitle}>{nodeData.data.parent.title}</h3>
							<div style={styles.detailsCancel} className={'underlineOnHover'} onClick={this.clearNodeData}>Clear</div>
							<div style={styles.detailsButtonWrapper}>
								<div className={'button'} style={styles.detailsButton} onClick={this.saveItem}>Save</div>
							</div>
						</div>
						{nodeData.data.type !== 'document' &&
							<div style={styles.detailsClear} className={'underlineOnHover'} onClick={this.editNodeData}>Edit</div>
						}

						<div style={styles.details}>
							<div style={styles.detailsPreview}>

								<AtomViewerPane atomData={ensureImmutable({ atomData: nodeData.data.parent, currentVersionData: nodeData.data })} renderType={'embed'}/>

							</div>


							<form onSubmit={this.saveItem} style={styles.detailsForm}>
								<div>
									<label style={styles.label} htmlFor={'mode'}>
										Mode
									</label>
									<RadioGroup name={'mode'} selectedValue={this.state.nodeData.mode} onChange={this.inputChange.bind(this, 'mode')}>
										<Radio value="embed" id={'embed'} style={styles.radioInput}/> <label htmlFor={'embed'} style={styles.radioLabel}>Embed</label>
										<Radio value="cite" id={'cite'} style={styles.radioInput}/> <label htmlFor={'cite'} style={styles.radioLabel}>Cite</label>
									</RadioGroup>
								</div>
								<div style={[this.state.nodeData.mode === 'cite' && styles.disabledInput]}>
									<label style={styles.label} htmlFor={'caption'}>
										Caption
									</label>
									<textarea ref={'caption'} id={'caption'} name={'caption'} style={[styles.input, styles.textarea]} value={this.state.nodeData.caption} onChange={this.inputChange.bind(this, 'caption')}></textarea>
								</div>

								<div style={[this.state.nodeData.mode === 'cite' && styles.disabledInput]}>
									<label style={styles.label} htmlFor={'align'}>
										Align
									</label>
									<RadioGroup name={'align'} selectedValue={this.state.nodeData.align} onChange={this.inputChange.bind(this, 'align')}>
										<Radio value="inline" id={'inline'} style={styles.radioInput}/> <label htmlFor={'inline'} style={styles.radioLabel}>Inline</label>
										<Radio value="full" id={'full'} style={styles.radioInput}/> <label htmlFor={'full'} style={styles.radioLabel}>Full</label>
										<Radio value="left" id={'left'} style={styles.radioInput}/> <label htmlFor={'left'} style={styles.radioLabel}>Left</label>
										<Radio value="right" id={'right'} style={styles.radioInput}/> <label htmlFor={'right'} style={styles.radioLabel}>Right</label>
									</RadioGroup>
								</div>

								<div style={{display: 'none'}}> {/* Hidden while we don't allow for custom CSS - no use for this field */}
									<label style={styles.label} htmlFor={'className'}>
										Class Name
									</label>
									<input ref={'className'} id={'className'} name={'className'} type="text" style={styles.input} value={this.state.nodeData.className} onChange={this.inputChange.bind(this, 'className')}/>
								</div>

								<div style={[this.state.nodeData.mode === 'cite' && styles.disabledInput]}>
									<label style={styles.label} htmlFor={'size'}>
										Size
									</label>
									<input ref={'size'} id={'size'} name={'size'} type="text" style={styles.input} value={this.state.nodeData.size} onChange={this.inputChange.bind(this, 'size')}/>
									<div className={'light-color inputSubtext'}>
										e.g. 20%, 50%, 200px, 400px
									</div>
								</div>

							</form>
						</div>


					</div>
				}

				{/* If we DO have a chosen atom  and are trying to edit it*/}
				{nodeData.data && this.state.editNodeDataMode &&
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
				}
			</div>

			<div className={'showOnActive'}>Drop files to add</div>
			</Dropzone>
		);
	}

});

export default connect( state => {
	return {
		mediaData: state.media,
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
		padding: '1em 0em',
	},
	mediaSelectHeader: {
		maxWidth: '1024px',
		padding: '0em 2em 1em 2em',
		margin: '0 auto',
	},
	mediaDetails: {
		padding: '1em 2em',
	},
	filterInput: {
		width: 'calc(100% - 20px - 4px)',
		borderWidth: '0px 0px 2px 0px',
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
		width: '250px',
		display: 'inline-block',
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
