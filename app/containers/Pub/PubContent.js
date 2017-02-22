import { NonIdealState, ProgressBar, Spinner } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import { PUBPUB_EDITOR_URL } from 'configURLs';
import Radium from 'radium';
import RenderFile from 'components/RenderFile/RenderFile';
import dateFormat from 'dateformat';
import { globalStyles } from 'utils/globalStyles';
import { postVersion } from './actionsVersions';
import { putDefaultFile } from './actionsFiles';
import { s3Upload } from 'utils/uploadFile';

let styles;

export const PubContent = React.createClass({
	propTypes: {
		version: PropTypes.object,
		pub: PropTypes.object,
		// pubSlug: PropTypes.string,
		userName: PropTypes.string,
		userAccessToken: PropTypes.string,
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

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.isLoading;
		const nextLoading = nextProps.isLoading;
		const nextError = nextProps.error;

		if (oldLoading && !nextLoading && !nextError) {
			this.setState({
				uploadRates: [],
				uploadFileNames: [],
				uploadFiles: [],
				uploading: false,
				uploadingFinished: false,
				uploadedFileObjects: [],
				newVersionMessage: '',
			});
		}
	},

	handleFileUploads: function(evt) {
		// Go over all of the files
		// Upload to s3
		// Get URLs from s3 and add into fileObject
		// Chunk them into type
		// create fileObjects
		// When they're all done, bundle them into a version (replacing similar named files)
		// Create version

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
		};
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
	},

	versionMessageChange: function(evt) {
		this.setState({ newVersionMessage: evt.target.value });
	},
	postNewVersion: function(evt) {
		evt.preventDefault();
		if (!this.state.newVersionMessage) {
			return this.setState({ newVersionError: 'Version message required' });
		}
		if (!this.state.uploadingFinished) { return false; }
		const pubId = this.props.pub.id;
		const newUploadedFileObjects = this.state.uploadedFileObjects;

		const version = this.props.version || {};
		const files = version.files || [];

		const fileNames = {};
		const mergedFiles = [...newUploadedFileObjects, ...files];
		const newVersionFiles = mergedFiles.map((file)=> {
			fileNames[file.name] = false;
			return file;
		}).filter((item)=> {
			if (fileNames[item.name]) { return false; }

			fileNames[item.name] = true;
			return true;
		});

		this.setState({ newVersionError: '' });
		return this.props.dispatch(postVersion(pubId, this.state.newVersionMessage, false, newVersionFiles, version.defaultFile));
	},

	defaultFileChange: function(filename) {
		this.props.dispatch(putDefaultFile(this.props.pub.id, this.props.version.id, filename));
	},

	openEditor: function() {
		const { userAccessToken, userName } = this.props;
		const slug = this.props.pub.slug;
		const url = `${PUBPUB_EDITOR_URL}/user/access/${slug}/${userName}/${userAccessToken}`;
		window.open(url, '_blank');
	},

	render() {
		// Default view, no files, no nothing
		// Default doc view
		// Default files list
		// Default files list, uploading
		// Specific file view

		const version = this.props.version || {};
		const files = version.files || [];

		const isLoading = this.props.isLoading;
		const query = this.props.query || {};
		const params = this.props.params || {};
		const meta = params.meta;
		const routeFilename = params.filename;

		const mainFile = files.reduce((previous, current)=> {
			if (version.defaultFile === current.name) { return current; }
			if (!version.defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

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
									<div>
										<Link to={'/pub/markdown'} style={{ marginRight: '0.5em' }}>How to write with PubPub Markdown</Link>
									</div>

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
				{meta === 'files' && !!files.length && !this.state.uploading && !routeFilename && this.props.pub.canEdit &&
					<div style={styles.topButtons}>
						<Link to={'/pub/markdown'} style={{ marginRight: '0.5em' }}>Rendering with PubPub Markdown</Link>
						<label className="pt-button" htmlFor={'upload'}>
							Upload Files
							<input id={'upload'} type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
						</label>

						{/*
						<button className={'pt-button'} onClick={this.openEditor} style={{ marginLeft: '1em' }}>
							Open Editor
							<span className={'pt-icon-standard pt-align-right'} />
						</button>
						*/}
					</div>
				}

				{/* Breadcrumbs */}
				{/* Shown as long as there are files */}
				{/*!!files.length && files.length > 1 &&
					<div style={{ marginBottom: '1em' }}>
						{meta !== 'files' && !routeFilename &&
							<ul className="pt-breadcrumbs">
								<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> {files.length} Files</Link></li>
							</ul>
						}
						{meta === 'files' && !routeFilename &&
							<ul className="pt-breadcrumbs">
								<li><Link to={{ pathname: '/pub/' + this.props.pub.slug, query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-document" /> Main</Link></li>
							</ul>
						}

						{!!routeFilename &&
							<ul className="pt-breadcrumbs">
								<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>
								<li><a className="pt-breadcrumb">{routeFile.name}</a></li>
							</ul>
						}
					</div>
				*/}

				{/* Uploading Section */}
				{this.state.uploading &&
					<div style={styles.uploadingSection} className={'pt-card pt-elevation-2'}>
						{!!isLoading &&
							<div style={styles.newVersionLoading}>
								<Spinner className={'pt-small'} />
							</div>
						}

						{!isLoading &&
							<div style={styles.topRightButton}>
								<label className="pt-button pt-minimal" htmlFor={'add-more-files'}>
									Add more files
									<input id={'add-more-files'} type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
								</label>
							</div>
						}

						<h3>Uploading</h3>

						<form onSubmit={this.postNewVersion}>
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
						</form>

						{this.state.uploadFileNames.map((uploadFile, index)=> {
							return (
								<div key={'uploadFile-' + index} style={styles.uploadBar}>
									{uploadFile}
									<ProgressBar value={this.state.uploadRates[index]} className={this.state.uploadRates[index] === 1 ? 'pt-no-stripes pt-intent-success' : 'pt-no-stripes'} />
								</div>
							);
						})}

					</div>
				}

				{/* File List */}
				{meta === 'files' && !routeFile &&
					<div>

						<table className="pt-table pt-condensed pt-striped" style={{ width: '100%' }}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Updated</th>
									<th />
									<th />
								</tr>
							</thead>
							<tbody>
								{files.sort((foo, bar)=> {
									if (foo.name > bar.name) { return 1; }
									if (foo.name < bar.name) { return -1; }
									return 0;
								}).map((file, index)=> {
									return (
										<tr key={'file-' + index}>
											<td style={styles.tableCell}><Link className={'underlineOnHover link'} to={{ pathname: '/pub/' + this.props.pub.slug + '/files/' + file.name, query: query }}>{file.name}</Link></td>
											<td style={styles.tableCell}>{dateFormat(file.createdAt, 'mmm dd, yyyy')}</td>
											<td style={[styles.tableCell, styles.tableCellSmall]}>
												<a href={file.url} target={'_blank'}>
													<button type="button" className={'pt-button pt-minimal pt-icon-import'} />
												</a>
											</td>
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

				{/* Render specific File */}
				{!!files.length && (meta !== 'files' || (meta !== 'files' && routeFile)) &&
					<div style={styles.pubStyle} className={'pub-body'}>
						<RenderFile file={routeFile || mainFile} allFiles={files} pubSlug={this.props.pub.slug} query={this.props.query}/>
					</div>
				}
			</div>
		);
	},

});

export default Radium(PubContent);

styles = {
	container: {
		// padding: '0em 1.25em 1.25em',
		paddingTop: '10px',
	},
	topButtons: {
		float: 'right',
	},
	uploadingSection: {
		marginBottom: '2em',
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
		// padding: '0em 1.25em',
		// fontFamily: 'Merriweather',
		// fontWeight: 'light',
		// fontSize: '14px',
		// lineHeight: '24px',
		// lineHeight: '1.6em',
		// fontSize: '1.2em',
		// color: '#333',
		maxWidth: '700px',
	}
};
