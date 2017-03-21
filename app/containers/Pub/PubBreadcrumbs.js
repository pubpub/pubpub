import React, { PropTypes } from 'react';
import { Sticky } from 'react-sticky';
// import ReactMarkdown from 'react-markdown';
import { Menu, Button } from '@blueprintjs/core';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';

let styles;

export const PubBreadcrumbs = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		editorFiles: PropTypes.object,
		editorVersionMessage: PropTypes.string,
		editorIsPublished: PropTypes.bool,
		editorIsRestricted: PropTypes.bool,
		onNameChange: PropTypes.func,
		onVersionMessageChange: PropTypes.func,
		onVersionPrivacyChange: PropTypes.func,
		onSaveVersion: PropTypes.func,
		onDiscardChanges: PropTypes.func,
		version: PropTypes.object,
		params: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		query: PropTypes.object,
	},

	setEditorPrivacy: function(mode) {
		if (mode === 'private') {
			this.props.onVersionPrivacyChange(false, false);
		}
		if (mode === 'restricted') {
			this.props.onVersionPrivacyChange(true, false);
		}
		if (mode === 'published') {
			this.props.onVersionPrivacyChange(false, true);
		}
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

		let editorPrivacy = 'Private';
		if (this.props.editorIsRestricted) { editorPrivacy = 'Restricted'; }
		if (this.props.editorIsPublished) { editorPrivacy = 'Published'; }

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
			<Sticky style={styles.container(editMode)} isActive={editMode}>
				<div style={styles.versionStatus}>
					{!editMode &&
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
					}
					{false && editMode &&
						<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/versions', query: query }} className={'opacity-on-hover-parent pt-button pt-minimal'} style={styles.statusLink}>
							Draft · Will be {editorPrivacy}
							{editorPrivacy === 'Private' &&
								<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
							}
							{editorPrivacy === 'Restricted' &&
								<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
							}
							{editorPrivacy === 'Published' &&
								<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
							}
						</Link>
					}
					{editMode &&
						<DropdownButton 
							content={
								<Menu>
									<li><a className="pt-menu-item pt-popover-dismiss" onClick={this.setEditorPrivacy.bind(this, 'private')}>
										Private
										{true === false && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
									</a></li>
									<li><a className="pt-menu-item pt-popover-dismiss" onClick={this.setEditorPrivacy.bind(this, 'restricted')}>
										Restricted
										{true === false && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
									</a></li>
									<li><a className="pt-menu-item pt-popover-dismiss" onClick={this.setEditorPrivacy.bind(this, 'published')}>
										Published
										{true === false && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
									</a></li>
								</Menu>
							}
							title={
								<span>
									Will be {editorPrivacy}
									{editorPrivacy === 'Private' &&
										<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
									}
									{editorPrivacy === 'Restricted' &&
										<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
									}
									{editorPrivacy === 'Published' &&
										<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
									}
								</span>
							} 
							position={2} />
					}
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
									<input type="text" style={{ minWidth: '300px' }} className="pt-input" placeholder="Describe your changes..." onChange={this.props.onVersionMessageChange} value={this.props.editorVersionMessage}/>
									<Button className="pt-intent-success" onClick={this.props.onSaveVersion} loading={this.props.isLoading}>Save Changes</Button>
								</div>
							</form>
						</div>

						<div style={{ minHeight: '45px', lineHeight: '45px' }}>
							{!!newFileCount &&
								<span style={{ verticalAlign: 'middle' }}>{newFileCount} file{newFileCount !== 1 && 's'} added </span>
							}
							{!!removedFileCount &&
								<span style={{ verticalAlign: 'middle' }}>{removedFileCount} file{removedFileCount !== 1 && 's'} deleted </span>
							}
							{!!updatedFileCount &&
								<span style={{ verticalAlign: 'middle' }}>{updatedFileCount} file{updatedFileCount !== 1 && 's'} updated </span>
							}
							{(!!newFileCount || !!removedFileCount || !!updatedFileCount) && !this.props.isLoading &&
								<Button style={{ verticalAlign: 'middle' }} className="pt-minimal" onClick={this.props.onDiscardChanges}>(Discard Changes)</Button>
							}
							
						</div>
						<div style={styles.editModeLine(editMode)} />
					</div>
				}
			
			</Sticky>
		);
	},

});

export default Radium(PubBreadcrumbs);

styles = {
	container: function(editMode) {
		return {
			marginBottom: '2em',
			padding: '1em 0em 0em',
			borderBottom: editMode ? '0px solid black' : '1px solid #CCC',
			// borderBottom: '1px solid #CCC',
			zIndex: 10,
		};
		
	},
	editModeLine: function(editMode) {
		return {
			display: editMode ? 'block' : 'none',
			position: 'absolute',
			boxShadow: '0px 1px 1px rgba(16, 22, 26, 0.2), 0px 3px 3px rgba(16, 22, 26, 0.2)',
			left: '-100vw',
			top: 0,
			width: '200vw',
			height: '100%',
			zIndex: '-1',
			backgroundColor: 'white',
		};
		
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
