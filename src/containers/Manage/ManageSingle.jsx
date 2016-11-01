import atomTypes from 'components/AtomTypes';
import fuzzy from 'fuzzy';
import AtomEditorPane from 'containers/Atom/AtomEditorPane';
import Dropzone from 'react-dropzone';
import Radium from 'radium';
import React, { PropTypes } from 'react';
import {LoaderDeterminate} from 'components';
import {PreviewEditor} from 'components';
import {updateAtomDetails, addContributor, updateContributor, deleteContributor} from 'containers/Atom/actions';
import {saveUserSettings} from 'containers/UserProfile/actions';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {ensureImmutable} from 'reducers';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';

import {getMedia, createAtom, saveVersion, deleteAtom} from './actions';

// import {globalStyles} from 'utils/styleConstants';


let styles;

export const ManageSingle = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		loginData: PropTypes.object,
		setItemHandler: PropTypes.func,
		insertItemHandler: PropTypes.func,
		atomType: PropTypes.string,
		dispatch: PropTypes.func,
		atomsInDoc: PropTypes.array,
	},

	getInitialState() {
		return {
			filter: '',
			createNewType: 'document',
			uploadRates: [],
			uploadFiles: [],
			openEditor: false,
			errorMsg: null,
			editingAtom: null,
			librarySource: 'doc',
		};
	},

	filterChange: function(evt) {
		this.setState({filter: evt.target.value});
	},

	// On file drop (or on file select)
	// Upload files automatically to s3
	// On completion call function that hits the pubpub server to generate asset information
	// Generated asset information is then sent to Firebase for syncing with other users
	onDrop: function(files) {

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
		this.createAtom(atomType, versionContent, title);
		this.setState({filter: ''});
	},

	saveVersionHandler: function(newVersionContent, versionMessage, atomData) {
		const newVersion = {
			type: atomData.type,
			message: versionMessage,
			parent: atomData._id,
			content: newVersionContent
		};
		this.props.dispatch(saveVersion(newVersion));
	},


	saveNew: function() {
		const versionContent = this.refs.atomEditorPane.getSaveVersionContent();
		const title = this.refs.titleField.value;
		this.createAtom(this.props.atomType, versionContent, title, undefined, false);
	},

	createAtom: function(type, versionContent, title, redirect, defaultOpen) {

		this.props.dispatch(createAtom(type, versionContent, title, redirect, defaultOpen)).then((response) => {
				const atomData = response.result;
				this.props.insertItemHandler(atomData);
				this.setState({filter: '', creatingNew: false});
			},
			() => {
				console.log('failure', arguments);
			}
		);

	},

	// to-do:
	// make create atom also generate a link to the pub it was created for, (if inserted)
	// make an insert atom url?
	createNew: function() {
		this.setState({creatingNew: true});
		const newType = this.props.atomType;
		this.setState({filter: ''});
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

	updateDetails: function(atomID, newDetails) {
		this.props.dispatch(updateAtomDetails(atomID, newDetails));
	},

	deleteAtomHandler: function(atomID) {
		this.props.dispatch(deleteAtom(atomID));
	},

	switchLibrarySource: function() {
		if (this.state.librarySource === 'media') {
			this.setState({librarySource: 'doc'});
			return;
		}

		const mediaData = safeGetInToJS(this.props.mediaData, ['mediaItems']);
		if (!mediaData || mediaData.length === 0) {
				this.props.dispatch(getMedia()).then((response) => {
					this.setState({librarySource: 'media'});
				},
				() => {
					console.log('failure');
				}
			);
		} else {
			this.setState({librarySource: 'media'});
		}

	},

	render: function() {

		// const mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		let mediaItems;

		if (this.state.librarySource === 'media') {
			mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		} else {
			mediaItems = this.props.atomsInDoc || [];
		}

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


		const mediaItemsFilterForType = mediaItems.filter((item)=> {
			return item.type === this.props.atomType;
		});

		const filteredItems = fuzzy.filter(this.state.filter.replace(/type:([a-zA-Z]*)/gi, ''), mediaItemsFilterForType, {extract: (item)=>{ return item.parent.title;} });

		const options = Object.keys(atomTypes).sort((foo, bar)=> {
			// Sort so that alphabetical
			if (foo > bar) { return 1; }
			if (foo < bar) { return -1; }
			return 0;
		});

		if (this.state.creatingNew) {
			const atomData = {type: this.props.atomType};
			return (
				<div style={styles.mediaSelectHeader}>
					<h1>
					{(() => {
						switch (this.props.atomType) {
							case "image": return <FormattedMessage id="manage.createImage" defaultMessage="Create Image"/>;
							case "reference": return <FormattedMessage id="manage.createReference" defaultMessage="Create Reference"/>;
							default:      return "Unknown Data Type";
						}
					})()}
					</h1>

						<label>
							Title:
						</label>
						<input ref="titleField" type="text" placeholder={'Title'} style={styles.filterInput}/>

					<div className={'button'} onClick={this.saveNew} style={styles.createNewButton}><FormattedMessage {...globalMessages.Save}/></div>
					<AtomEditorPane ref="atomEditorPane" atomData={ensureImmutable({ atomData: atomData, currentVersionData: {} })}/>
				</div>
			);
		}

		return (
			<div>
			<div>

				{/* Document Add/Create Section */}
				<div style={styles.mediaSelectHeader}>

					<h1>
					{(() => {
		        switch (this.props.atomType) {
		          case "image": return <FormattedMessage id="manage.InsertImage" defaultMessage="Insert Image"/>;
		          case "reference": return <FormattedMessage id="manage.InsertReference" defaultMessage="Insert Reference"/>;
		          default:      return "Unknown Data Type";
		        }
		      })()}
					</h1>

					{
						(this.props.atomType === 'reference') ?
						<div>
					<div className={'button'} onClick={this.createNew} style={styles.createNewButton}><FormattedMessage {...globalMessages.CreateNew}/></div>
					</div>

					:

					<Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} >
					<div className={'button'} style={styles.dropzoneBlock}>
						<FormattedMessage id="managesingle.YourCommunityP1" defaultMessage="Click or Drag files to add"/>
						<input id={'media-file-select'} type={'file'} onChange={this.onSelect} multiple={true} style={styles.fileInput}/>
					</div>
					</Dropzone>

					}


				</div>

				{this.state.uploadFiles.map((uploadFile, index)=> {
					return (
						<div key={'uploadFile-' + index} style={[styles.uploadBar, this.state.uploadRates[index] === 1 && {display: 'none'}]}>
							{uploadFile}
							<LoaderDeterminate value={this.state.uploadRates[index] * 100} />
						</div>
					);
				})}

				<div>
					{
						(this.state.librarySource === 'media') ?
						<div>
							<h2 className="noMarginsHeader">In your library</h2>
							<div className="light-color underlineOnHover sans-font" style={styles.switchText} onClick={this.switchLibrarySource}>Search the Document</div>
						</div>

						:
						<div>
							<h2 className="noMarginsHeader">Used in this document</h2>
							<div className="light-color underlineOnHover sans-font" style={styles.switchText} onClick={this.switchLibrarySource}>Search your Library</div>
						</div>
					}


				{/* Filter Section */}
				<label>
					Search:
				</label>
				<input type="text" placeholder={'Type to search'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>

			<div>


				{/* Items List */}
				{filteredItems.map((item)=> {
					return item.original;
				}).sort((foo, bar)=>{
					// Sort so that most recent is first in array
					if (foo.parent.lastUpdated > bar.parent.lastUpdated) { return -1; }
					if (foo.parent.lastUpdated < bar.parent.lastUpdated) { return 1; }
					return 0;
				}).splice(0, 20).map((item, index)=> {
					if (this.state.atomMode === 'recent' && index > 9) {
						return null;
					}
					const buttons = [
						// Put custom buttons here
						// { type: 'action', text: 'Set To Insert', action: this.props.setItemHandler.bind(this, item) },
					];

					return (
						<div style={{maxWidth: 350, display: 'inline-block', paddingRight: '25px'}}>

						<PreviewEditor
							key={'atomItem-' + item.parent._id}
							atomData={item.parent}
							versionData={item}
							contributorsData={item.contributors}
							footer={(!this.props.setItemHandler && item.parent.isPublished) && <div> <input type="checkbox" checked={this.state.featuredAtoms.includes(item.parent._id)} onChange={this.toggleFeatureOnProfile.bind(this, item.parent._id)}/><FormattedMessage {...globalMessages.FeatureOnProfile}/></div> }
							buttons = {buttons}

							onSaveVersion={this.onSaveVersion}
							onSaveAtom={this.onSaveAtom}
							updateDetailsHandler={this.updateDetails}
							handleAddContributor={this.handleAddContributor}
							handleUpdateContributor={this.handleUpdateContributor}
							handleDeleteContributor={this.handleDeleteContributor}
							saveVersionHandler={this.saveVersionHandler}
							deleteAtomHandler={this.deleteAtomHandler}
							setItemHandler={this.props.insertItemHandler}
							doNotEdit={true}

							detailsLoading={item.detailsLoading}
							detailsError={!!item.detailsError}
							permissionType={item.permissionType}
							defaultOpen={false}/>
					</div>

					);
				})}

			</div>


			</div>
		</div>

			<div className={'showOnActive'}><FormattedMessage {...globalMessages.DropFilesToAdd}/></div>
			</div>
		);
	}

});

export default connect( state => {
	return {
		mediaData: state.manage,
		loginData: state.login,
	};
})( Radium(ManageSingle) );

styles = {
	mediaSelectHeader: {
		padding: '0em 0em 1em 0em',
	},
	addNewDropdown: {
		display: 'inline-block',
		textAlign: 'left',
		minWidth: 'calc(15% - 3.6em - 4px)',
		// minWidth: '150px',
	},
	capitalize: {
		textTransform: 'capitalize',
	},
	dropdownOption: {
		textTransform: 'capitalize',
		padding: '.25em .5em',
		cursor: 'pointer',
	},
	createNewButton: {
		position: 'relative',
		verticalAlign: 'top',
		left: '15px',
		marginBottom: '3em',
		fontSize: '1.5em'
	},
	filterDropdown: {
		width: 'calc(15% - 3.6em - 4px)',
		textAlign: 'left',
	},
	filterInput: {
		display: 'inline-block',
		margin: 0,
		position: 'relative',
		left: '-2px',
		fontSize: '1em',
		padding: '7px 0.5em',
		width: 'calc(85% - 1em - 4px)',
		maxWidth: '350',
	},
	dropzoneBlock: {
		padding: '0em 2em',
		margin: '0em auto',
		display: 'block',
		fontSize: '1.3em',
		borderStyle: 'dashed',
		height: '25vh',
		lineHeight: '25vh',
		width: '50%',
		minWidth: '350px',
		verticalAlign: 'top',
		position: 'relative',
		overflow: 'hidden',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '0em',
		},
	},
	listblock: {

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
	switchText: {
		cursor: 'pointer',
		margin: '0.35em 0em 1.25em',
	},
	uploadBar: {
		margin: '0em 2em 1em',
		overflow: 'hidden',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '0em 0em 1em',
		},
	},

};
