import React, { PropTypes } from 'react';

// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';

let styles;

export const PubBreadcrumbs = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		editorFiles: PropTypes.object,
		editorVersionMessage: PropTypes.string,
		onNameChange: PropTypes.func,
		onVersionMessageChange: PropTypes.func,
		onSaveVersion: PropTypes.func,
		onDiscardChanges: PropTypes.func,
		version: PropTypes.object,
		params: PropTypes.object,
		query: PropTypes.object,
	},

	render() {
		const version = this.props.version || {};
		const editMode = Object.keys(this.props.editorFiles).length > 0;
		
		const files = editMode 
			? Object.keys(this.props.editorFiles).map((key)=> {
				return this.props.editorFiles[key];
			})
			: version.files || [];

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

		const currentFile = meta === 'files' ? routeFile : mainFile;

		if (!files.length) { return <div />; }

		let privacy = 'Private';
		if (version.isRestricted) { privacy = 'Restricted'; }
		if (version.isPublished) { privacy = 'Published'; }

		const currentEditorFile = this.props.editorFiles[routeFilename];

		const newFileCount = files.reduce((previous, current)=> {
			if (current.isNew) { return previous + 1; }
			return previous;
		}, 0);

		const removedFileCount = files.reduce((previous, current)=> {
			if (current.isDeleted) { return previous + 1; }
			return previous;
		}, 0);

		const updatedFileCount = files.reduce((previous, current)=> {
			if (current.newName || current.newMarkdown || current.newJSON) { return previous + 1; }
			return previous;
		}, 0);

		return (
			<div style={styles.container}>
				<div style={styles.versionStatus}>
					<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/versions', query: query }} className={'opacity-on-hover-parent pt-button pt-minimal'} style={styles.statusLink}>
						{dateFormat(version.createdAt, 'mmmm dd, yyyy')} · {privacy}
						{privacy === 'Private' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
						}
						{privacy === 'Restricted' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
						}
						{privacy === 'Published' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
						}
					</Link>
				</div>

				<ul className="pt-breadcrumbs" style={styles.breadcrumbs}>
					<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>
					{currentFile && !editMode &&
						<li><a className="pt-breadcrumb">{currentFile.name}</a></li>
					}
					{currentEditorFile && editMode &&
						<li><a className="pt-breadcrumb">
							<input className={'pt-input'} onChange={this.props.onNameChange} value={currentEditorFile.newName || currentEditorFile.name} />
						</a></li>
						
					}
					
				</ul>
				{currentFile && !editMode &&
					<Link to={`/pub/${this.props.pub.slug}/files/${currentFile.name}/edit`} className={'pt-button pt-icon-edit !pt-minimal'}>Edit</Link>
				}
				{/*!currentFile &&
					<span>
						<Link className={'pt-button pt-icon-add !pt-minimal'}>Upload Files</Link>
						<Link className={'pt-button pt-icon-document !pt-minimal'}>Create New Document</Link>
					</span>
				*/}

				{editMode &&
					<div style={styles.editModeBar}>
						<div style={styles.versionStatus}>
							<form style={{ display: 'inline-block', verticalAlign: 'middle' }}>
								<div className="pt-control-group">  
									<input type="text" className="pt-input" placeholder="Describe your changes..." onChange={this.props.onVersionMessageChange} value={this.props.editorVersionMessage}/>
									<button className="pt-button pt-intent-primary" onClick={this.props.onSaveVersion}>Save Changes</button>
								</div>
							</form>
							<button className="pt-button" onClick={this.props.onDiscardChanges}>Discard Changes</button>
						</div>

						<div style={{ lineHeight: '45px' }}>
							{!!newFileCount &&
								<span>{newFileCount} file{newFileCount !== 1 && 's'} added </span>
							}
							{!!removedFileCount &&
								<span>{removedFileCount} file{removedFileCount !== 1 && 's'} deleted </span>
							}
							{!!updatedFileCount &&
								<span>{updatedFileCount} file{updatedFileCount !== 1 && 's'} updated </span>
							}
						</div>
						
					</div>
				}
			
			</div>
		);
	},

});

export default Radium(PubBreadcrumbs);

styles = {
	container: {
		marginBottom: '2em',
		padding: '1em 0em 0em',
		borderBottom: '1px solid #CCC',
	},
	breadcrumbs: {
		minHeight: '30px',
	},
	versionStatus: {
		float: 'right',
		lineHeight: '30px',
	},
	statusLink: {
		display: 'inline-block',
		padding: '0px 2px',
	},
	privacyIcon: {
		paddingLeft: '0.5em',
		color: '#5c7080',
		margin: 0,
	},
	editModeBar: {
		clear: 'both',
	},
};
