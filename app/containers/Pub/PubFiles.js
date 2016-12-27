import React, { PropTypes } from 'react';
import Radium from 'radium';
// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, NonIdealState, ProgressBar, Spinner } from '@blueprintjs/core';
import { s3Upload } from 'utils/uploadFile';
import ReactMarkdown from 'react-markdown';
import { postVersion } from './actionsVersions';

let styles;

export const PubFiles = React.createClass({
	propTypes: {
		versionData: PropTypes.object,
		pubId: PropTypes.number,
		pubSlug: PropTypes.string,
		routeFilename: PropTypes.string,
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
			newVersionmessage: '',
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
				newVersionmessage: '',
			});
		}
	},

	handleFileUploads: function(evt) {
		// console.log(evt.target.files);
		// const reader = new FileReader();
		// reader.onload = function(progressEvent) {
		// 	console.log(this.result);
		// };
		// reader.readAsText(evt.target.files[0]);

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
		console.log('File Finish!', filename, type, title, index);
		
		const newUploadedFileObject = {
			url: 'https://assets.pubpub.org/' + filename,
			type: type,
			name: title,
		};
		// Check if it's a type we want to parse here, if it is, parse from state.uploadFiles[index] and add to fileObject
		// Need to catch and check for inline images/assets?
		// if (type === 'text/markdown') {

		// }
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
		
		console.log(newUploadedFileObjects);

	},

	versionMessageChange: function(evt) {
		this.setState({ newVersionmessage: evt.target.value });
	},
	postNewVersion: function(evt) {
		evt.preventDefault();
		if (!this.state.uploadingFinished) { return false; }
		const pubId = this.props.pubId;
		const newUploadedFileObjects = this.state.uploadedFileObjects;

		const versionData = this.props.versionData || {};
		const files = versionData.files || [];

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

		return this.props.dispatch(postVersion(pubId, this.state.newVersionmessage, false, newVersionFiles));
		// Need to set loading - and then onreceive, set uplaoding to flase, clear values, etc
	},


	render() {
		const versionData = this.props.versionData || {};
		const files = versionData.files || [];

		const currentFile = files.reduce((previous, current)=> {
			if (current.name === this.props.routeFilename) { return current; } 
			return previous;
		}, undefined);
		
		const isLoading = this.props.isLoading;
		return (
			<div style={styles.container}>

				{/* Upload and Editor Buttons */}
				{!!files.length && !this.state.uploading &&
					<div style={styles.topButtons}>
						<label className="pt-button" htmlFor={'upload'}>
							Upload Files
							<input id={'upload'} type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
						</label>
						
						<button className={'pt-button'} style={{ marginLeft: '1em' }}>
							Open Editor
							<span className={'pt-icon-standard  pt-icon-caret-down pt-align-right'} />
						</button>
						
					</div>
				}

				{/* Breadcrumbs */}
				{!!files.length &&
					<div style={{ marginBottom: '1em' }}>
						{!this.props.routeFilename &&
							<ul className="pt-breadcrumbs">
								<li><Link to={'/pub/' + this.props.pubSlug} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-document" /> Main</Link></li>
							</ul>
						}

						{!!this.props.routeFilename &&
							<ul className="pt-breadcrumbs">
								<li><Link to={'/pub/' + this.props.pubSlug + '/files'} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>
								<li><a className="pt-breadcrumb">{currentFile.name}</a></li>
							</ul>
						}
					</div>
				}

				{/* No files associated with Pub yet*/}
				{!files.length && !this.state.uploading && !this.state.uploadedFileObjects.length &&
					<NonIdealState
						action={
							<div>
								<label className="pt-button">
									Upload Files
									<input type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
								</label>
								<span style={{ width: '1em', height: '1em', display: 'inline-block' }} />
								<a className="pt-button" tabIndex="0" role="button">Open Editor</a>
								

							</div>
						}
						description={'There are no files associated with this pub yet.'}
						title={'No Files'}
						visual={'folder-open'} />
				}


				{/* Uploading Section */}
				{this.state.uploading &&
					<div style={styles.uploadingSection} className={'pt-card pt-elevation-2'}>
						{!!isLoading && 
							<div style={styles.newVersionLoading}>
								<Spinner className={'pt-small'} />
							</div>
						}

						<h3>Uploading</h3>

						<form onSubmit={this.postNewVersion}>
							<div style={styles.uploadingFormTable}>
								<label htmlFor={'versionMessage'} style={styles.uploadingMessage}>
									Version Message
									<input style={styles.uploadingInput} className={'pt-input'} id={'versionMessage'} name={'versionMessage'} type="text" placeholder={'Describe this version'} value={this.state.newVersionmessage} onChange={this.versionMessageChange} />
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

				{/* Creating Version */}
				{!files.length && !this.state.uploading && !!this.state.uploadedFileObjects.length && 
					<NonIdealState
						action={
							<Spinner />
						}
						description={'Success! Generating a new version now'}
						title={'Creating Version'}
						visual={'pt-icon-tick'} />
				}
				
				{/* File List */}
				{!!files.length && !this.props.routeFilename &&
					<div>
						
						<table className="pt-table pt-condensed pt-striped" style={{width: '100%'}}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Created</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{files.map((file, index)=> {
									return (
										<tr key={'file-' + index}>
											<td style={styles.tableCell}><Link className={'underlineOnHover link'} to={'/pub/' + this.props.pubSlug + '/files/' + file.name}>{file.name}</Link></td>
											<td style={styles.tableCell}>{file.createdAt}</td>
											<td style={[styles.tableCell, styles.tableCellRight]}><button className={'pt-button'}>Edit  <span className="pt-icon-standard pt-icon-caret-down pt-align-right" /></button></td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				}		

				{/* Specific File */}
				{this.props.routeFilename && 
					<div>

						{currentFile.type.indexOf('image') > -1 &&
							<img src={currentFile.url} style={{maxWidth: '100%'}} />
						}
						{currentFile.type.indexOf('markdown') > -1 &&
							<ReactMarkdown source={currentFile.content} />
						}
						{currentFile.type.indexOf('image') === -1 && currentFile.type.indexOf('markdown') === -1 &&
							<div className={'pt-callout'}>
								<p>Can not render this file. Click to download the file in your browser.</p>
								<a href={currentFile.url}><button className={'pt-button'}>Click to Download</button></a>
							</div>
						}
					</div>
				}
			</div>
		);
	},


	// render: function() {
	// 	let md = this.props.versionData.files.reduce((previous, current, index)=> {
	// 		if (current.name === 'main.md') {
	// 			return current.value;
	// 		} 
	// 		return previous;
	// 	}, '');

	// 	this.props.versionData.files.map((item)=> {
	// 		if (item.type === 'image') {
	// 			const regexp = new RegExp(item.name, "g");
	// 			md = md.replace(regexp, item.url);
	// 		}
	// 	});

	// 	return (
	// 		<div style={styles.pubBody} className={'pub-body'}>
	// 			<ReactMarkdown source={md} />
	// 			<p>On Professor Neri Oxman’s Krebs Cycle of Creativity of the relationship between the disciplines, design and science are opposite one another on the circle, and the output of one is not the input of the other as is often the case of engineering and design or science and engineering. I believe that by making a “lens” and a fusion of design and science, we can fundamentally advance both. This connection includes both the science of design and the design of science, as well as the dynamic relationship between these two activities.</p>
	// 			<p>For me, antidisciplinary research is akin to mathematician Stanislaw Ulam's famous observation that the study of nonlinear physics is like the study of "non-elephant animals." Antidisciplinary is all about the non-elephant animals.</p>
	// 			<p>I believe that by bringing together design and science we can produce a rigorous but flexible approach that will allow us to explore, understand and contribute to science in an antidisciplinary way.</p>
	// 			<p>The kind of scholars we are looking for at the Media Lab are people who don't fit in any existing discipline either because they are between--or simply beyond--traditional disciplines. I often say that if you can do what you want to do in any other lab or department, you should go do it there. Only come to the Media Lab if there is nowhere else for you to go. We are the new Salon des Refusés.</p>
	// 		</div>
	// 	);
	// }


});

export default Radium(PubFiles);

styles = {
	container: {
		padding: '0em 1.25em 1.25em',
	},
	pubBody: {
		// padding: '1.25em',
		// fontFamily: 'serif',
		// lineHeight: '1.6em',
		// fontSize: '1.2em',
		// color: '#333',
		// maxWidth: '700px',
	},
	topButtons: {
		float: 'right',
	},
	uploadingSection: {
		marginBottom: '2em',
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
	tableCellRight: {
		textAlign: 'right',
	},
};

// <Popover 
// 		content={<Menu>
// 			<li><Link to={'/pubs/create'} className="pt-menu-item pt-popover-dismiss pt-icon-application">
// 				Import Document
// 			</Link></li>
// 			<li><Link to={'/journals/create'} className="pt-menu-item pt-popover-dismiss pt-icon-applications">
// 				Create new document in Editor
// 			</Link></li>
// 			<li><Link to={'/journals/create'} className="pt-menu-item pt-popover-dismiss pt-icon-applications">
// 				Upload files
// 			</Link></li>
// 		</Menu>}
// 		interactionKind={PopoverInteractionKind.CLICK}
// 		position={Position.BOTTOM}
// 		transitionDuration={200}
// 	>
// 		<button type="button" className="pt-button pt-intent-primary">
// 			Add File
// 			<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
// 		</button>
// 		
// 	</Popover>
// 