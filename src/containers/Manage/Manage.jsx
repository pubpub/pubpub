import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import fuzzy from 'fuzzy';
import {LoaderDeterminate} from 'components';
import {PreviewEditor} from 'components';

// import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';
import {getMedia, createAtom, saveVersion, deleteAtom} from './actions';
import {updateAtomDetails, addContributor, updateContributor, deleteContributor} from 'containers/Atom/actions';

import atomTypes from 'components/AtomTypes';

let styles;

export const Manage = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		setItemHandler: PropTypes.func,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			filter: '',
			createNewType: 'document',
			uploadRates: [],
			uploadFiles: [],
		};
	},

	componentDidMount() {
		this.props.dispatch(getMedia());
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
		this.props.dispatch(createAtom(atomType, versionContent, title));
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

	handleCreateNewChange: function(item) {
		this.setState({createNewType: item});
	},

	createNew: function() {
		const defaultOpen = this.state.createNewType !== 'document';
		this.props.dispatch(createAtom(this.state.createNewType, undefined, ('New ' + this.state.createNewType), undefined, defaultOpen));
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

		const mediaItemsFilterForType = mediaItems.filter((item)=> {
			if (typesFiltered.length === 0) { return true; }
			return typesFiltered.includes(item.type);
		});

		const filteredItems = fuzzy.filter(this.state.filter.replace(/type:([a-zA-Z]*)/gi, ''), mediaItemsFilterForType, {extract: (item)=>{ return item.type + ' ' + item.parent.title;} });

		const options = Object.keys(atomTypes).sort((foo, bar)=>{
			// Sort so that alphabetical
			if (foo > bar) { return 1; }
			if (foo < bar) { return -1; }
			return 0;
		});
		return (
			<div style={{padding: '3em'}}>
			<Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} >
			<div>

				{/* Document Add/Create Section */}
				<div style={styles.mediaSelectHeader}>

					<div className={'light-button arrow-down-button'} style={styles.addNewDropdown}>
						<span style={styles.capitalize}>{this.state.createNewType}</span>
						<div className={'hoverChild arrow-down-child'}>
							{options.map((option)=>{
								return <div key={'setType-' + option} onClick={this.handleCreateNewChange.bind(this, option)} style={styles.dropdownOption} className={'underlineOnHover'}>{option}</div>;
							})}
						</div>
					</div>
					<div className={'button'} onClick={this.createNew} style={styles.createNewButton}><FormattedMessage {...globalMessages.CreateNew}/></div>


					<div className={'button'} style={styles.dropzoneBlock}>
						<FormattedMessage id="manage.YourCommunityP1" defaultMessage="Click or Drag files to add"/>
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


				{/* Filter Section */}
				<div className={'light-button arrow-down-button'} style={styles.filterDropdown}>Filter
					<div className={'hoverChild arrow-down-child'}>
						{allUniqueTypes.sort((foo, bar)=>{
							// Sort so that alphabetical
							if (foo > bar) { return 1; }
							if (foo < bar) { return -1; }
							return 0;
						}).map((item)=> {
							return <div key={'filter-type-' + item} onClick={this.setFilter.bind(this, ('type:' + item))} style={styles.dropdownOption} className={'underlineOnHover'}>{item}</div>;
						})}
					</div>
				</div>
				<input type="text" placeholder={'Type to filter'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>


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
						<PreviewEditor
							key={'atomItem-' + item.parent._id}
							atomData={item.parent}
							versionData={item}
							contributorsData={item.contributors}
							footer={!this.props.setItemHandler && <div> <input type="checkbox" /><FormattedMessage {...globalMessages.ShowOnProfile}/></div> }
							buttons = {buttons}

							onSaveVersion={this.onSaveVersion}
							onSaveAtom={this.onSaveAtom}
							updateDetailsHandler={this.updateDetails}
							handleAddContributor={this.handleAddContributor}
							handleUpdateContributor={this.handleUpdateContributor}
							handleDeleteContributor={this.handleDeleteContributor}
							saveVersionHandler={this.saveVersionHandler}
							deleteAtomHandler={this.deleteAtomHandler}
							setItemHandler={this.props.setItemHandler}

							detailsLoading={item.detailsLoading}
							detailsError={!!item.detailsError}
							permissionType={item.permissionType}

							defaultOpen={item.defaultOpen}/>

					);
				})}


			</div>

			<div className={'showOnActive'}><FormattedMessage {...globalMessages.DropFilesToAdd}/></div>
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
	mediaSelectHeader: {
		padding: '1em 0em',
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
		left: '-2px'
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
