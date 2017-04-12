import { Button, Menu } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

import DropdownButton from 'components/DropdownButton/DropdownButton';
import { Link } from 'react-router';
import Radium from 'radium';
import { Sticky } from 'react-sticky';

let styles;


const PrivacyListItem = ({ title, icon, active, description, setEditorPrivacy }) => (
	<li><a className={`pt-menu-item pt-popover-dismiss ${(active) ? 'pt-active' : null}`} onClick={setEditorPrivacy}>
		<span style={styles.privacyIconRight} className={`pt-icon-standard ${icon} opacity-on-hover-child`} />
		<strong>{title}</strong>
		<div style={styles.privacyDescription} className="pt-text-muted">{description}</div>
	</a></li>
);

export const PubEditorHeader = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		editorFiles: PropTypes.object,
		editorVersionMessage: PropTypes.string,
		editorIsPublished: PropTypes.bool,
		editorIsRestricted: PropTypes.bool,
		// onNameChange: PropTypes.func,
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
		// const version = this.props.version || {};
		// const editMode = Object.keys(this.props.editorFiles).length > 0;

		const files = Object.keys(this.props.editorFiles).map((key)=> {
			return this.props.editorFiles[key];
		});

		const query = this.props.query || {};
		const params = this.props.params || {};
		// const meta = params.meta;
		const routeFilename = params.filename;

		// const mainFile = files.reduce((previous, current)=> {
		// 	if (version.defaultFile === current.name) { return current; }
		// 	if (!version.defaultFile && current.name.split('.')[0] === 'main') { return current; }
		// 	return previous;
		// }, files[0]);

		// const routeFile = files.reduce((previous, current)=> {
		// 	if (current.name === routeFilename) { return current; }
		// 	return previous;
		// }, undefined);

		// const currentFile = meta === 'files' ? routeFile : mainFile;

		if (!files.length) { return <div />; }

		// let privacy = 'Private';
		// if (version.isRestricted) { privacy = 'Restricted'; }
		// if (version.isPublished) { privacy = 'Published'; }

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
			if (current.newName || current.newContent) { return previous + 1; }
			return previous;
		}, 0);

		const changeCount = newFileCount + removedFileCount + updatedFileCount;

		return (
			<Sticky style={styles.container}>
				<div style={styles.versionStatus}>
					<DropdownButton
						content={
							<div style={styles.privacyBox}>
								<Menu>
									<PrivacyListItem
										title="Private"
										icon="pt-icon-lock"
										description="Only collaborators on this pub will be able to see and access the version."
										active={(editorPrivacy === 'Private')}
										setEditorPrivacy={this.setEditorPrivacy.bind(this, 'private')}
										/>
									<PrivacyListItem
										title="Restricted"
										icon="pt-icon-people"
										description="Only collaborators, reviewers and editors of journals will be able to see and access the version."
										active={(editorPrivacy === 'Restricted')}
										setEditorPrivacy={this.setEditorPrivacy.bind(this, 'restricted')}
										/>
									<PrivacyListItem
										title="Published"
										icon="pt-icon-globe"
										description="This version will be public and can be accessed by anyone. It will also show up on your public profile."
										active={(editorPrivacy === 'Published')}
										setEditorPrivacy={this.setEditorPrivacy.bind(this, 'published')}
										/>
								</Menu>
							</div>
						}
						title={
							<span>
								Will be <strong>{editorPrivacy}</strong>
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
				</div>

				{routeFilename &&
					<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/edit', query: query }} className="pt-button pt-icon-folder-open">Show All Files</Link>
				}
				{/*<ul className="pt-breadcrumbs" style={styles.breadcrumbs}>

					<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/edit', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Show All Files</Link></li>

				</ul>*/}

				<div style={styles.editModeBar}>
					<div style={styles.versionStatus}>
						<form style={{ display: 'inline-block', verticalAlign: 'middle' }}>
							<div className="pt-control-group">
								<input type="text" style={{ minWidth: '300px' }} className="pt-input" placeholder="Describe your changes..." onChange={this.props.onVersionMessageChange} value={this.props.editorVersionMessage} />

								<Button type="submit" className={`pt-intent-success${changeCount ? '' : ' pt-disabled'}`} onClick={this.props.onSaveVersion} loading={this.props.isLoading}>{changeCount ? 'Save Changes' : 'No Changes to Save'}</Button>
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
					<div style={styles.editModeLine} />
				</div>

			</Sticky>
		);
	},

});

export default Radium(PubEditorHeader);

styles = {
	container: {
		marginBottom: '2em',
		padding: '1em 0em 0em',
		borderBottom: '0px solid black',
		zIndex: 10,

	},
	editModeLine: {
		position: 'absolute',
		boxShadow: '0px 1px 1px rgba(16, 22, 26, 0.2), 0px 3px 3px rgba(16, 22, 26, 0.2)',
		left: '-100vw',
		top: 0,
		width: '200vw',
		height: '100%',
		zIndex: '-1',
		backgroundColor: 'white',
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
	privacyIconRight: {
		paddingRight: '0.5em',
		color: '#5c7080',
		margin: 0,
	},
	privacyDescription: {
		margin: '5px 0px 0px',
		fontSize: '0.9em',
		whiteSpace: 'normal'
	},
	privacyBox: {
		width: 300,
	},
	editModeBar: {
		clear: 'both',
	},
};
