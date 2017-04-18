// import MarkdownEditor from 'components/MarkdownEditor/MarkdownEditor';
import { CodeEditor, FullEditor, bibtexToCSL, csltoBibtex } from '@pubpub/editor';
import { NonIdealState, ProgressBar } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

import EditingTips from 'components/EditingTips/EditingTips';
// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
// import { PUBPUB_EDITOR_URL } from 'configURLs';
import Radium from 'radium';
import RenderFile from 'components/RenderFile/RenderFile';
import dateFormat from 'dateformat';
import { globalStyles } from 'utils/globalStyles';
import { putDefaultFile } from './actionsFiles';
import { s3Upload } from 'utils/uploadFile';

let styles;

export const PubEditorFiles = React.createClass({
	propTypes: {
		version: PropTypes.object,
		pub: PropTypes.object,
		onNameChange: PropTypes.func,
		editorMode: PropTypes.string,
		editorFiles: PropTypes.object,
		editorDefaultFile: PropTypes.string,
		onEditorModeChange: PropTypes.func,
		onEditChange: PropTypes.func,
		onFileDelete: PropTypes.func,
		onFileAdd: PropTypes.func,
		onFileCreate: PropTypes.func,
		updateEditorDefaultFile: PropTypes.func,
		params: PropTypes.object,
		query: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			uploadRates: [],
			uploadFileNames: [],
			uploadFiles: [],
			uploading: false,
			uploadingFinished: false,
			uploadedFileObjects: [],
			newVersionMessage: '',
			newVersionError: '',
		};
	},

	// componentWillMount() {
	// 	const editMode = Object.keys(this.props.editorFiles).length > 0;
	// 	const version = this.props.version || {};
	// 	const files = editMode
	// 		? Object.keys(this.props.editorFiles).map((key)=> {
	// 			return this.props.editorFiles[key];
	// 		})
	// 		: version.files || [];

	// 	const params = this.props.params || {};
	// 	const meta = params.meta;
	// 	const routeFilename = params.filename;

	// 	const defaultFile = editMode ? this.props.editorDefaultFile : version.defaultFile;
	// 	const mainFile = files.reduce((previous, current)=> {
	// 		if (defaultFile === current.name) { return current; }
	// 		if (!defaultFile && current.name.split('.')[0] === 'main') { return current; }
	// 		return previous;
	// 	}, files[0]);

	// 	const routeFile = files.reduce((previous, current)=> {
	// 		if (current.name === routeFilename) { return current; }
	// 		return previous;
	// 	}, undefined);

	// 	const currentFile = meta === 'files' ? routeFile : mainFile;

	// 	if (currentFile) {
	// 		this.setState({
	// 			initialContent: currentFile.content || '',
	// 			content: currentFile.content || '',
	// 		});
	// 	}

	// },

	// componentWillReceiveProps(nextProps) {
	// 	// If login was succesful, redirect
	// 	const oldLoading = this.props.isLoading;
	// 	const nextLoading = nextProps.isLoading;
	// 	const nextError = nextProps.error;

	// 	if (oldLoading && !nextLoading && !nextError) {

	// 		// const editMode = Object.keys(this.props.editorFiles).length > 0;
	// 		// const version = this.props.version || {};
	// 		// const files = editMode
	// 		// 	? Object.keys(this.props.editorFiles).map((key)=> {
	// 		// 		return this.props.editorFiles[key];
	// 		// 	})
	// 		// 	: version.files || [];

	// 		// const params = this.props.params || {};
	// 		// const meta = params.meta;
	// 		// const routeFilename = params.filename;

	// 		// const defaultFile = editMode ? this.props.editorDefaultFile : version.defaultFile;
	// 		// const mainFile = files.reduce((previous, current)=> {
	// 		// 	if (defaultFile === current.name) { return current; }
	// 		// 	if (!defaultFile && current.name.split('.')[0] === 'main') { return current; }
	// 		// 	return previous;
	// 		// }, files[0]);

	// 		// const routeFile = files.reduce((previous, current)=> {
	// 		// 	if (current.name === routeFilename) { return current; }
	// 		// 	return previous;
	// 		// }, undefined);

	// 		// const currentFile = meta === 'files' ? routeFile : mainFile;


	// 		this.setState({
	// 			uploadRates: [],
	// 			uploadFileNames: [],
	// 			uploadFiles: [],
	// 			uploading: false,
	// 			uploadingFinished: false,
	// 			uploadedFileObjects: [],
	// 			newVersionMessage: '',

	// 			// initialContent: currentFile.content || '',
	// 			// content: currentFile.content || '',
	// 		});
	// 	}
	// },


	// setMode: function(mode) {
	// 	if (mode === 'markdown') {
	// 		const newMarkdown = this.state.content ? jsonToMarkdown(this.state.content) : '';
	// 		return this.setState({
	// 			mode: 'markdown',
	// 			initialContent: newMarkdown,
	// 			content: newMarkdown,
	// 		});
	// 	}

	// 	const newJSON = markdownToJSON(this.state.content || '');
	// 	return this.setState({
	// 		mode: 'rich',
	// 		initialContent: newJSON,
	// 		content: newJSON,
	// 	});
	// },

	handleFileUploads: function(evt) {
		// Go over all of the files
		// Upload to s3
		// Get URLs from s3 and add into fileObject
		// Chunk them into type
		// create fileObjects
		// When they're all done, bundle them into a version (replacing similar named files)
		// Create version

		// console.log('in handle', evt);
		const files = [];
		for (let index = 0; index < evt.target.files.length; index++) {
			files.push(evt.target.files[index]);
		}
		const startingFileIndex = this.state.uploadRates.length;
		const newUploadRates = files.map((file)=> {
			return 0;
		});
		const newUploadFileNames = files.map((file)=> {
			return file.name;
		});

		const uploadRates = [...this.state.uploadRates, ...newUploadRates];
		const uploadFileNames = [...this.state.uploadFileNames, ...newUploadFileNames];
		const uploadFiles = [...this.state.uploadFiles, ...files];
		files.map((file, index)=> {
			s3Upload(file, this.onFileProgress, this.onFileFinish, startingFileIndex + index);
		});

		this.setState({
			uploadRates: uploadRates,
			uploadFileNames: uploadFileNames,
			uploadFiles: uploadFiles,
			uploading: true,
			uploadingFinished: false,
		});
	},

	handleFileSelect: function(file, callback) { // Used for rich editor
		this.setState({ richUploadCallback: callback });
		this.handleFileUploads({
			target: {
				files: [
					file
				]
			}
		});

	},

	handleReferenceAdd: function(referenceObject, callback) {
		const referencesFilename = 'references.bib';
		let bibtexFile;
		if (this.props.editorFiles[referencesFilename] && this.props.editorFiles[referencesFilename].content) {
			bibtexFile = this.props.editorFiles[referencesFilename];
		} else {
			bibtexFile = { url: './'+referencesFilename, name: referencesFilename, content: '', isNew: true, type: 'applications/x-bibtex' };
		}
		const bibtexContent = (bibtexFile.newContent || bibtexFile.content);
		const newBibtexContent = bibtexContent + csltoBibtex([referenceObject]);
		const newBibtexFile = { ...bibtexFile, newContent: newBibtexContent, id: undefined, hash: undefined };
		this.props.onFileAdd(newBibtexFile);
		if (callback) {
			callback(referenceObject);
		}

	},

	// Update state's progress value when new events received.
	onFileProgress: function(evt, index) {
		const percentage = evt.loaded / evt.total;
		const tempUploadRates = this.state.uploadRates;
		tempUploadRates[index] = percentage;
		this.setState({ uploadRates: tempUploadRates });
	},


	onFileFinish: function(evt, index, type, filename, title) {
		// Build file item, add it to some state
		// check if all are done. if all are done. Do a thing.
		// Once all created, and version has been created and updated on client, set uploading to false
		// console.log('File Finish!', filename, type, title, index);

		const newUploadedFileObject = {
			url: 'https://assets.pubpub.org/' + filename,
			type: type,
			name: title,
			isNew: true,
		};

		if (type === 'text/markdown' || title.split('.').pop() === 'bib' || title.split('.').pop() === 'md') {
			// If it's markdown, we have to pull out the content from the file so it is available to edit.
			const reader = new FileReader();
			reader.readAsText(this.state.uploadFiles[index], 'UTF-8');
			reader.onload = (event)=> {
				const newUploadedFileObjects = [...this.state.uploadedFileObjects, newUploadedFileObject];

				const finished = this.state.uploadRates.reduce((previous, current)=> {
					if (current !== 1) { return false; }
					return previous;
				}, true);

				// Let the uploading animation finish
				this.setState({
					uploadedFileObjects: newUploadedFileObjects,
					uploadingFinished: finished,
				});
				this.props.onFileAdd({ ...newUploadedFileObject, content: event.target.result });

				// console.log('about to call with', filename);
				setTimeout(()=> {
					this.state.richUploadCallback(newUploadedFileObject.name, newUploadedFileObject.url);
				}, 0);
			};
			reader.onerror = (event)=> {
				console.error('error reading file');
			};
		} else {
			const newUploadedFileObjects = [...this.state.uploadedFileObjects, newUploadedFileObject];

			const finished = this.state.uploadRates.reduce((previous, current)=> {
				if (current !== 1) { return false; }
				return previous;
			}, true);

			// Let the uploading animation finish
			this.setState({
				uploadedFileObjects: newUploadedFileObjects,
				uploadingFinished: finished,
			});
			this.props.onFileAdd(newUploadedFileObject);

			// console.log('about to call with', filename);
			setTimeout(()=> {
				this.state.richUploadCallback(newUploadedFileObject.name, newUploadedFileObject.url);
			}, 0);
		}



	},

	versionMessageChange: function(evt) {
		this.setState({ newVersionMessage: evt.target.value });
	},

	postNewVersion: function(evt) {
		// evt.preventDefault();
		// if (!this.state.newVersionMessage) {
		// 	return this.setState({ newVersionError: 'Version message required' });
		// }
		// if (!this.state.uploadingFinished) { return false; }
		// const pubId = this.props.pub.id;
		// const newUploadedFileObjects = this.state.uploadedFileObjects;

		// const version = this.props.version || {};
		// const files = version.files || [];

		// const fileNames = {};
		// const mergedFiles = [...newUploadedFileObjects, ...files];
		// const newVersionFiles = mergedFiles.map((file)=> {
		// 	fileNames[file.name] = false;
		// 	return file;
		// }).filter((item)=> {
		// 	if (fileNames[item.name]) { return false; }

		// 	fileNames[item.name] = true;
		// 	return true;
		// });

		// this.setState({ newVersionError: '' });
		// return this.props.dispatch(postVersion(pubId, this.state.newVersionMessage, false, newVersionFiles, version.defaultFile));
	},

	defaultFileChange: function(filename) {
		// const editMode = Object.keys(this.props.editorFiles).length > 0;
		// if (editMode) {
		return this.props.updateEditorDefaultFile(filename);
		// }
		// return this.props.dispatch(putDefaultFile(this.props.pub.id, this.props.version.id, filename));
	},

	// openEditor: function() {
	// 	const { userAccessToken, userName } = this.props;
	// 	const slug = this.props.pub.slug;
	// 	const url = `${PUBPUB_EDITOR_URL}/user/access/${slug}/${userName}/${userAccessToken}`;
	// 	window.location.href = url;
	// },

	handleEditModeChange: function(mode) {
		this.props.onEditorModeChange(mode);
	},

	// objectToArray: function(object) {
	// 	return Object.keys(object).map((item)=> {
	// 		return object[item];
	// 	});
	// },

	render() {
		// Default view, no files, no nothing
		// Default doc view
		// Default files list
		// Default files list, uploading
		// Specific file view
		// const editMode = Object.keys(this.props.editorFiles).length > 0;

		const version = this.props.version || {};
		const files = Object.keys(this.props.editorFiles).map((key)=> {
			return this.props.editorFiles[key];
		});

		const bibtexFile = files.reduce((previous, current)=> {
			if (current.name === 'references.bib') { return current; }
			return previous;
		}, undefined);

		const localReferences = bibtexFile ? bibtexToCSL(bibtexFile.newContent || bibtexFile.content) : [];

		const isLoading = this.props.isLoading;
		const query = this.props.query || {};
		const params = this.props.params || {};
		const meta = params.meta;
		const mode = params.mode;
		const routeFilename = params.filename;

		const defaultFile = this.props.editorDefaultFile;
		const mainFile = files.reduce((previous, current)=> {
			if (defaultFile === current.name) { return current; }
			if (!defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

		// const currentFile = meta === 'files' ? routeFile : mainFile;

		const isRemainingUploads = this.state.uploadFileNames.reduce((previous, current, index)=> {
			if (this.state.uploadRates[index] !== 1) { return true; }
			return previous;

		}, false);

		return (
			<div style={styles.container}>

				{/* No files associated with Pub yet*/}
				{!files.length && !this.state.uploading && this.props.pub.canEdit &&
					<div style={{ paddingTop: '2em' }}>
						<NonIdealState
							action={
								<div style={{ textAlign: 'center' }}>
									<label className="pt-button" htmlFor={'add-files'}>
										Upload Files
										<input type="file" id={'add-files'} multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
									</label>

									<button className={'pt-button'} onClick={this.props.onFileCreate} style={{ marginLeft: '1em' }}>
										Start New Document
										<span className={'pt-icon-standard pt-align-right'} />
									</button>

									{/*<div>
										<Link to={'/pub/markdown'} style={{ marginRight: '0.5em' }}>How to write with PubPub Markdown</Link>
									</div>*/}

									{/*<span style={{ width: '1em', height: '1em', display: 'inline-block' }} />
									<a className="pt-button" tabIndex="0" role="button" >Open Editor</a>*/}


								</div>
							}
							description={'There are no files associated with this pub yet.'}
							title={'No Files'}
							visual={'folder-open'} />
					</div>
				}

				{/* Upload and Editor Buttons */}
				{/* Only shown on main Files list view, when not uploading */}
				{/*{meta === 'files' && !!files.length && !this.state.uploading && !routeFilename && this.props.pub.canEdit &&*/}
				{!!files.length && !routeFilename && this.props.pub.canEdit &&
					<div style={styles.topButtons}>
						{/*<Link to={'/pub/markdown'} style={{ marginRight: '0.5em' }}>Rendering with PubPub Markdown</Link>*/}
						{/*<Link style={{ marginRight: '0.5em' }}>What can I upload?</Link>*/}
						<label className="pt-button pt-icon-add" htmlFor={'upload'}>
							Upload Files
							<input id={'upload'} type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
						</label>
						<button className={'pt-button pt-icon-document !pt-minimal'} style={{ marginLeft: '1em' }} onClick={this.props.onFileCreate}>New Doc</button>

						{/*<button className={'pt-button'} onClick={this.openEditor} style={{ marginLeft: '1em' }}>
							Open Editor
							<span className={'pt-icon-standard pt-align-right'} />
						</button>*/}
					</div>
				}

				{/* Uploading Section */}
				{isRemainingUploads &&
					<div style={styles.uploadingSection} className={'pt-card pt-elevation-2'}>
						{/*!!isLoading &&
							<div style={styles.newVersionLoading}>
								<Spinner className={'pt-small'} />
							</div>
						*/}

						{/*!isLoading &&
							<div style={styles.topRightButton}>
								<label className="pt-button pt-minimal" htmlFor={'add-more-files'}>
									Add more files
									<input id={'add-more-files'} type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
								</label>
							</div>
						*/}

						{/*<h3>Uploading</h3>*/}

						{/*<form onSubmit={this.postNewVersion}>
							<div style={styles.uploadingFormTable}>
								<label htmlFor={'versionMessage'} style={styles.uploadingMessage}>
									Version Message
									<input style={styles.uploadingInput} className={'pt-input'} id={'versionMessage'} name={'versionMessage'} type="text" placeholder={'Describe this version'} value={this.state.newVersionMessage} onChange={this.versionMessageChange} />
								</label>
								<div style={styles.uploadingSubmit}>
									<button className={this.state.uploadingFinished ? 'pt-button pt-intent-primary' : 'pt-button pt-intent-primary pt-disabled'} onClick={this.postNewVersion}>
										{this.state.uploadingFinished
											? 'Save New Version'
											: 'Uploading'
										}
									</button>
								</div>

							</div>
							{this.state.newVersionError &&
								<div style={styles.errorMessage}>{this.state.newVersionError}</div>
							}
						</form>*/}

						{this.state.uploadFileNames.map((uploadFile, index)=> {
							return (
								<div key={'uploadFile-' + index} style={styles.uploadBar}>
									{uploadFile}
									<ProgressBar value={this.state.uploadRates[index]} className={this.state.uploadRates[index] === 1 ? 'pt-no-stripes pt-intent-success' : 'pt-no-stripes'} />
								</div>
							);
						}).filter((uploadFile, index)=> {
							return this.state.uploadRates[index] !== 1;
						})}

					</div>
				}

				{/* File List */}
				{!!files.length && !routeFile &&
					<div>

						<table className="pt-table pt-condensed pt-striped" style={{ width: '100%' }}>
							<thead>
								<tr>
									<th>Name</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{files.sort((foo, bar)=> {
									if (!foo.isNew && bar.isNew) { return 1; }
									if (foo.isNew && !bar.isNew) { return -1; }
									if (!foo.isDeleted && bar.isDeleted) { return 1; }
									if (foo.isDeleted && !bar.isDeleted) { return -1; }
									if (!(foo.newName || foo.newContent) && (bar.newName || bar.newContent)) { return 1; }
									if ((foo.newName || foo.newContent) && !(bar.newName || bar.newContent)) { return -1; }
									if (foo.name > bar.name) { return 1; }
									if (foo.name < bar.name) { return -1; }
									return 0;
								}).map((file, index)=> {
									return (
										<tr key={'file-' + index}>
											<td style={styles.tableCell}><Link className={'underlineOnHover link'} to={{ pathname: `/pub/${this.props.pub.slug}/edit/${file.name}`, query: query }}>
												{!file.isDeleted && file.isNew && <span style={[file.isNew && {backgroundColor: '#48AFF0'}, file.isNew && {backgroundColor: '#3DCC91'}, file.isDeleted && {backgroundColor: '#FF7373'}, { marginRight: '0.5em' }]} className={'pt-tag'}>new</span>}
												{file.isDeleted && <span style={[file.isNew && {backgroundColor: '#48AFF0'}, file.isNew && {backgroundColor: '#3DCC91'}, file.isDeleted && {backgroundColor: '#FF7373'}, { marginRight: '0.5em' }]} className={'pt-tag'}>deleted</span>}
												{!file.isNew && !file.isDeleted && (file.newName || file.newContent) && <span style={[file.isNew && {backgroundColor: '#48AFF0'}, file.isNew && {backgroundColor: '#3DCC91'}, file.isDeleted && {backgroundColor: '#FF7373'}, { marginRight: '0.5em' }]} className={'pt-tag'}>updated</span>}
												{file.newName || file.name} <span className={'pt-icon-standard pt-icon-edit'} />
											</Link></td>
											<td style={[styles.tableCell, styles.tableCellSmall]}>
												{file.name === mainFile.name &&
													<button role="button" className={'pt-button pt-fill pt-active'}>Main File</button>
												}
												{file.name !== mainFile.name && this.props.pub.canEdit &&
													<button role="button" className={'pt-button pt-fill'} onClick={this.defaultFileChange.bind(this, file.name)}>Set as main</button>
												}

											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				}


				{/* Edit specific File */}
				{!!files.length && !!routeFile &&
					<div className={'pt-card pt-elevation-3'} style={{ padding: '0em', margin: '0em 0em 2em' }}>


						<div style={{ minHeight: '45px', backgroundColor: '#ebf1f5', padding: '0.5em', textAlign: 'right', borderBottom: '1px solid rgba(16, 22, 26, 0.15)' }}>
							<div style={{ float: 'left' }}>
								<input className={'pt-input'} onChange={this.props.onNameChange} value={routeFile.newName || routeFile.name} />
							</div>

							<div className={'pt-button-group'}>
								{routeFile.type === 'text/markdown' &&
									<div className={`pt-button${this.props.editorMode === 'markdown' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'markdown')}>Markdown</div>
								}
								{routeFile.type === 'text/markdown' &&
									<div className={`pt-button${this.props.editorMode === 'rich' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'rich')}>Rich</div>
								}
								<button className={'pt-button pt-icon-trash pt-minimal'} style={{ margin: '0em 1em' }} onClick={this.props.onFileDelete} />
							</div>

						</div>
						<EditingTips />

						{routeFile.type === 'text/markdown' &&
							<div style={{ padding: '1em 4em', minHeight: '400px' }}>
								<FullEditor
									initialContent={routeFile.initialContent || routeFile.content}
									onChange={this.props.onEditChange}
									localFiles={files}
									localReferences={localReferences}
									globalCategories={['pubs', 'users']}
									handleFileUpload={this.handleFileSelect}
									handleReferenceAdd={this.handleReferenceAdd}
									mode={this.props.editorMode} />
								{/*<MarkdownEditor initialContent={routeFile.content} onChange={this.props.onEditChange} />*/}
							</div>
						}

						{routeFile.type === 'ppub' &&
							<div style={{ padding: '1em 4em', minHeight: '400px' }}>
								<FullEditor
									initialContent={JSON.parse(routeFile.initialContent || routeFile.content)}
									onChange={this.props.onEditChange}
									localFiles={files}
									localReferences={localReferences}
									globalCategories={['pubs', 'users']}
									handleFileUpload={this.handleFileSelect}
									handleReferenceAdd={this.handleReferenceAdd}
									mode={'rich'} />
							</div>
						}

						{routeFile.name.split('.').pop() === 'bib' &&
							<div style={{ padding: '1em 4em', minHeight: '400px' }}>
								<CodeEditor initialContent={routeFile.initialContent || routeFile.content} onChange={this.props.onEditChange}  />
							</div>
						}
						{routeFile.type !== 'text/markdown' && routeFile.name.split('.').pop() !== 'bib' &&
							<div style={{ padding: '1em', minHeight: '400px' }}>
								<RenderFile file={routeFile} allFiles={files} allReferences={localReferences} pubSlug={this.props.pub.slug} query={this.props.query} />
							</div>
						}

					</div>
				}

			</div>
		);
	},

});

export default Radium(PubEditorFiles);

styles = {
	container: {
		// padding: '0em 1.25em 1.25em',
		paddingTop: '10px',
	},
	topButtons: {
		textAlign: 'right',
		margin: '-1em 0em 1em',
	},
	uploadingSection: {
		marginBottom: '2em',
		clear: 'both',
	},
	topRightButton: {
		float: 'right',
	},
	uploadingFormTable: {
		display: 'table',
		verticalAlign: 'middle',
		width: '100%',
	},
	uploadingMessage: {
		display: 'table-cell',
		verticalAlign: 'middle',
		width: '100%',
	},
	uploadingInput: {
		width: '95%',
		marginBottom: '1em',
	},
	uploadingSubmit: {
		display: 'table-cell',
		verticalAlign: 'middle',
		whiteSpace: 'nowrap',
	},
	newVersionLoading: {
		float: 'right',
	},
	inputButtonLabel: {
		overflow: 'hidden',
	},
	inputButton: {
		display: 'inline-block',
		width: '100%',
		margin: 0,
	},
	inputButtonText: {
		cursor: 'pointer',
		zIndex: 3,
		position: 'relative',
	},
	inputTest: {
		margin: 0,
		overflow: 'hidden',
	},
	tableCell: {
		verticalAlign: 'middle',
	},
	tableCellSmall: {
		width: '1%',
		whiteSpace: 'nowrap',
	},
	tableCellRight: {
		textAlign: 'right',
	},
	errorMessage: {
		margin: '-1em 0px 1em',
		color: globalStyles.errorRed,
	},
	pubStyle: {
		maxWidth: '700px',
	}
};
