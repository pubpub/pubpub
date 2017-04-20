import { NonIdealState, Spinner } from '@blueprintjs/core';
import React, { PropTypes } from 'react';
import { bibtexToCSL, jsonToMarkdown, markdownToJSON } from '@pubpub/editor';

import PubEditorFiles from './PubEditorFiles';
import PubEditorHeader from './PubEditorHeader';
import Radium from 'radium';
import { StickyContainer } from 'react-sticky';
import { browserHistory } from 'react-router';
import { postVersion } from './actionsVersions';

let styles;

export const PubEditor = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			editorMode: undefined,
			editorFiles: {},
			editorVersionMessage: '',
			editorVersionMessageUserChanged: false,
			editorIsPublished: undefined,
			editorIsRestricted: undefined,
			editorDefaultFile: undefined,
		};
	},

	componentWillMount() {
		// console.log('mounting editor', this.props.pubData.pub);

		const pub = this.props.pubData.pub || {};
		const versions = pub.versions || [];
		const currentVersion = this.getCurrentVersion(versions);
		const files = currentVersion.files || [];
		const localReferences = this.getLocalReferences(files);
		const currentFileName = this.props.params.filename;
		const defaultMode = currentFileName && currentFileName.split('.').pop() === 'md' ? 'rich' : 'code';

		this.setState({
			editorMode: defaultMode,
			editorIsPublished: currentVersion.isPublished,
			editorIsRestricted: currentVersion.isRestricted,
			editorDefaultFile: currentVersion.defaultFile,
			editorCurrentFile: currentFileName,
			editorFiles: files.reduce((previous, current)=> {
				previous[current.name] = { ...current };
				// if (defaultMode === 'rich' && currentFileName === current.name) {
				if (currentFileName === current.name) {
					const initialContent = defaultMode === 'rich'
						? markdownToJSON(current.content, localReferences)
						: current.content;
					previous[current.name].initialContent = initialContent;
				}
				return previous;
			}, {}),
		});


	},

	componentWillReceiveProps(nextProps) {
		// const lastPathname = this.props.location.pathname;
		// const nextPathname = nextProps.location.pathname;

		if (this.props.params.filename !== nextProps.params.filename && nextProps.params.filename) {

			// const versions = nextProps.pubData.pub.versions || [];
			// const currentVersion = this.getCurrentVersion(versions);


			const files = Object.keys(this.state.editorFiles).map((key)=> {
				return this.state.editorFiles[key];
			});
			const localReferences = this.getLocalReferences(files);

			const newEditorFiles = { ...this.state.editorFiles };

			const currentFileName = nextProps.params.filename;
			const nextMode = currentFileName && newEditorFiles[currentFileName].name.split('.').pop() === 'md' ? 'rich' : 'code';

			let initialContent = newEditorFiles[currentFileName].newContent || newEditorFiles[currentFileName].content;
			if (nextMode === 'rich' && typeof initialContent === 'string') {
				initialContent = markdownToJSON(initialContent, localReferences);
			}

			newEditorFiles[currentFileName].initialContent = initialContent;

			this.setState({
				editorMode: nextMode,
				editorFiles: newEditorFiles,
			});

		}

		const currentPub = this.props.pubData.pub || {};
		const nextPub = nextProps.pubData.pub || {};
		if (currentPub.id && this.getCurrentVersion(currentPub.versions).id !== this.getCurrentVersion(nextPub.versions).id) {
			window.unsavedEdits = false;
			// const currentEditorFile = this.state.editorFiles[this.state.editorCurrentFile];
			// const nextName = currentEditorFile && (currentEditorFile.newName || currentEditorFile.name);

			// This is a temporary fix for the renaming files bug
			browserHistory.push({
				pathname: `/pub/${nextPub.slug}`,
			});

		}
	},

	componentWillUnmount() {
		window.unsavedEdits = false;
	},

	// enterEditModeObject: function(inputProps) {
	// 	const props = inputProps || this.props;
	// 	const versions = props.pubData.pub.versions || [];
	// 	const currentVersion = this.getCurrentVersion(versions);
	// 	const files = currentVersion.files || [];
	// 	// const currentFileName = props.params.filename || currentVersion.defaultFile;
	// 	const currentFileName = props.params.filename;
	// 	console.log('currentFileName', currentFileName);
	// 	const defaultMode = 'rich';
	// 	const localReferences = this.getLocalReferences(files);
	// 	// console.log('localReferences are', localReferences);
	// 	return {
	// 		editorMode: defaultMode,
	// 		editorIsPublished: currentVersion.isPublished,
	// 		editorIsRestricted: currentVersion.isRestricted,
	// 		editorDefaultFile: currentVersion.defaultFile,
	// 		editorFiles: files.reduce((previous, current)=> {
	// 			previous[current.name] = { ...current };
	// 			if (defaultMode === 'rich' && currentFileName === current.name) {
	// 				const newJSON = markdownToJSON(current.content, localReferences);
	// 				previous[current.name].newJSON = newJSON;
	// 				previous[current.name].initialContent = newJSON;
	// 			}
	// 			return previous;
	// 		}, {}),
	// 	};

	// },

	// goBack: function() {
	// 	// Note, this breaks if a user directly navigates to a discussion, clicks 'back' (rendering canGoBack = true), and then navigates back twice.
	// 	// We need a way to turn canGoBack off again, but that feels a bit cumbersome at the moment.
	// 	// Seems to be an open bug on react-router: https://github.com/ReactTraining/react-router/issues/408
	// 	if (this.state.canGoBack) {
	// 		browserHistory.goBack();
	// 	} else {
	// 		const query = this.props.location.query;
	// 		const pathname = this.props.location.pathname;
	// 		browserHistory.push({
	// 			pathname: pathname,
	// 			query: { ...query, panel: undefined, discussion: undefined, useHighlight: undefined, }
	// 		});
	// 	}
	// },

	// toggleShowAllDiscussions: function() {
	// 	this.setState({ showAllDiscussions: !this.state.showAllDiscussions });
	// },
	// toggleShowClosedDiscussions: function() {
	// 	this.setState({ showClosedDiscussions: !this.state.showClosedDiscussions });
	// },

	getCurrentVersion: function(versions) {
		const query = this.props.location.query;
		return versions.sort((foo, bar)=> {
			// Sort so that most recent is first in array
			if (foo.createdAt > bar.createdAt) { return -1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			return 0;
		}).reduce((previous, current, index, array)=> {
			const previousDate = new Date(previous.createdAt).getTime();
			const currentDate = new Date(current.createdAt).getTime();

			if (!previous.id) { return current; } // If this is the first loop
			if (query.version === current.hash) { return current; } // If the query version matches current
			if (!query.version && currentDate > previousDate) { return current; }
			return previous;

		}, {});
	},

	onEditChange: function(newVal) {
		// console.log(newVal);
		// if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		if (!currentFile) { return false; }
		// newEditorFiles[currentFile] = {
		// 	...newEditorFiles[currentFile],
		// 	newMarkdown: this.state.editorMode === 'markdown' ? newVal : undefined,
		// 	newJSON: this.state.editorMode === 'rich' ? newVal : undefined,
		// };
		// newEditorFiles[currentFile].newMarkdown = this.state.editorMode === 'markdown' ? newVal : undefined;
		// newEditorFiles[currentFile].newJSON = this.state.editorMode === 'rich' ? newVal : undefined;
		window.unsavedEdits = true;

		this.setState(currentState => {
			const newState = currentState;
		  newState.editorFiles[currentFile].newContent = newVal;
		  return newState;
		});

	},

	onEditorModeChange: function(newMode) {
		if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		const newEditorFiles = { ...this.state.editorFiles };

		const currentContent = newEditorFiles[currentFile].newContent || newEditorFiles[currentFile].initialContent;
		let newContent;
		if (newMode === 'markdown') {
			newContent = jsonToMarkdown(currentContent);
			// newEditorFiles[currentFile].newContent = newContent;
			// newEditorFiles[currentFile].initialContent = newContent;
		} else {
			const files = Object.keys(this.state.editorFiles).map((key)=> {
				return this.state.editorFiles[key];
			});

			const localReferences = this.getLocalReferences(files);
			// console.log('these references are ', localReferences)
			newContent = markdownToJSON(currentContent, localReferences);
			// newEditorFiles[currentFile].newMarkdown = undefined;
			// newEditorFiles[currentFile].newJSON = newJSON;
			// newEditorFiles[currentFile].initialContent = newContent;
		}
		newEditorFiles[currentFile].newContent = newContent;
		newEditorFiles[currentFile].initialContent = newContent;
		return this.setState({
			editorFiles: newEditorFiles,
			editorMode: newMode,
		});

	},

	onNameChange: function(evt) {
		const currentFile = this.props.params.filename;
		if (!currentFile) { return false; }
		const newEditorFiles = { ...this.state.editorFiles };
		newEditorFiles[currentFile].newName = evt.target.value;
		window.unsavedEdits = true;
		return this.setState({ editorFiles: newEditorFiles });
	},

	onFileAdd: function(file) {
		// const editMode = Object.keys(this.state.editorFiles).length > 0;
		// if (!editMode) { this.enterEditMode(); }
		// const newState = { ...this.state };
		window.unsavedEdits = true;
		this.setState(currentState => {
			const newState = currentState;
			newState.editorFiles[file.name] = file;
			return newState;
		});


	},

	onFileCreate: function() {
		// const editMode = Object.keys(this.state.editorFiles).length > 0;
		// if (!editMode) { this.enterEditMode(); }
		// const newState = !editMode ? this.enterEditModeObject() : this.state;

		const hasFiles = Object.keys(this.state.editorFiles).length !== 0;
		const date = new Date();
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		const seconds = ('0' + date.getSeconds()).slice(-2);
		const file = {
			url: '/temp.md',
			type: 'text/markdown',
			name: hasFiles ? `NewFile-${hours}-${minutes}-${seconds}.md` : 'main.md',
			isNew: true,
			content: '',
			initialContent: '',
		};

		const newEditorFiles = { ...this.state.editorFiles };
		newEditorFiles[file.name] = file;
		window.unsavedEdits = true;
		// this.setState({ editorFiles: newEditorFiles });
		this.setState({
			// ...newState,
			editorFiles: newEditorFiles
		});
		browserHistory.push({
			pathname: `/pub/${this.props.pubData.pub.slug}/edit/${file.name}`,
		});
	},

	onVersionMessageChange: function(evt) {
		this.setState({
			editorVersionMessage: evt.target.value,
			editorVersionMessageUserChanged: true,
		});
	},

	onVersionPrivacyChange: function(isRestricted, isPublished) {
		this.setState({
			editorIsPublished: isPublished,
			editorIsRestricted: isRestricted,
		});
	},

	// TODO: discard changes when viewing new file keeps filename in URL and causes bad render state
	// TODO: Need to block empty md files from being saved
	// TODO: Need to file filenames on edit (append md when necessary) - perhaps on save version
	// TODO: Without any unsavedChanges, will remain in editor mode on Content root, even though it should not remain in editor)

	onFileDelete: function() {
		// if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		const newEditorFiles = { ...this.state.editorFiles };
		newEditorFiles[currentFile].isDeleted = true;
		window.unsavedEdits = true;
		this.setState({ editorFiles: newEditorFiles });
		return browserHistory.push({
			pathname: `/pub/${this.props.pubData.pub.slug}/edit`,
		});
	},
	onSaveVersion: function(evt) {
		evt.preventDefault();
		if (!this.state.editorVersionMessage) {
			return this.setState({ editorError: 'Version message required' });
		}

		const pubId = this.props.pubData.pub.id;
		// const version = this.getCurrentVersion(this.props.pubData.pub.versions);
		// TODO: Remove duplicates if uploaded files with identical names

		let editorCurrentFile = this.state.editorCurrentFile;
		const newDefaultFile = this.state.editorFiles[this.state.editorDefaultFile] || {};
		const oldDefaultFile = this.state.editorFiles[this.state.editorDefaultFile] || {};
		const currentDefaultFile = this.state.editorFiles[Object.keys(this.state.editorFiles)[0]] || {};
		let defaultFile = newDefaultFile.newName || newDefaultFile.name || oldDefaultFile.newName || oldDefaultFile.name || currentDefaultFile.newName || currentDefaultFile.name || 'main.md';


		let newVersionFiles;
		try {
			newVersionFiles = Object.keys(this.state.editorFiles).map((key)=> {

				const newFile = { ...this.state.editorFiles[key] };
				newFile.name = newFile.newName || newFile.name;
				// if (this.state.editorMode === 'markdown') {
				if (newFile.newContent && typeof newFile.newContent === 'object') {
					// newFile.content = newFile.newMarkdown || newFile.content;
					newFile.content = jsonToMarkdown(newFile.newContent);

					// turn ppub files into markdown files when saving
					if (newFile.type === 'ppub') {
						newFile.type = "text/markdown";
						newFile.newName = newFile.name.substr(0, newFile.name.lastIndexOf(".")) + ".md";
						newFile.name = newFile.newName;

						if (key === defaultFile) {
							defaultFile = newFile.name;
						}
					}
				} else if (newFile.newContent) {
					newFile.content = newFile.newContent;
				}
				// if (this.state.editorMode === 'rich') {
				// if (newFile.newJSON) {
				// 	// newFile.content = newFile.newJSON ? jsonToMarkdown(newFile.newJSON) : newFile.content;
				// 	newFile.content = jsonToMarkdown(newFile.newJSON);
				// }

				const extension = newFile.name.split('.').pop;
				if (newFile.newName || newFile.newContent) {
					// If there are updates to the file, it's a new file, so remove its id.
					newFile.url = `/temp.${extension}`;
					delete newFile.id;
					delete newFile.hash;
					// delete newFile.newJSON;
					delete newFile.newContent;
					delete newFile.newName;
					delete newFile.initialContent;
				}
				return newFile;
			}).filter((file)=> {
				return !file.isDeleted;
			});
		} catch (err) {
			console.log('Error saving', err);
			return this.setState({ editorError: 'Error saving files. Please email pubpub@media.mit.edu.' });
		}

		this.setState({ editorError: '', editorCurrentFile });
		return this.props.dispatch(postVersion(pubId, this.state.editorVersionMessage, this.state.editorIsPublished, this.state.editorIsRestricted, newVersionFiles, defaultFile));
	},
	onDiscardChanges: function() {
		window.unsavedEdits = false;
		const currentEditorFile = this.state.editorFiles[this.props.params.filename] || {};
		const nextName = currentEditorFile.name;
		// this.setState({
		// 	editorMode: undefined,
		// 	editorFiles: {},
		// 	editorVersionMessage: '',
		// 	editorVersionMessageUserChanged: false,
		// 	editorIsPublished: undefined,
		// 	editorIsRestricted: undefined,
		// 	editorDefaultFile: undefined,
		// });
		browserHistory.push({
			pathname: `/pub/${this.props.pubData.pub.slug}/files/${nextName || ''}`,
		});
	},

	updateEditorDefaultFile: function(filename) {
		this.setState({ editorDefaultFile: filename });
	},

	getLocalReferences: function(files) {
		const bibtexFile = files.reduce((previous, current)=> {
			if (current.name === 'references.bib') { return current; }
			return previous;
		}, undefined);

		const localReferences = bibtexFile ? bibtexToCSL(bibtexFile.content) : [];
		return localReferences;
	},


	render() {

		const pub = this.props.pubData.pub || {};
		if (this.props.pubData.loading && !this.props.pubData.error) {
			return <div style={{ margin: '5em auto', width: '50px' }}><Spinner /></div>;
		}
		if (!this.props.pubData.loading && (this.props.pubData.error || !pub.title)) {
			return (
				<div style={{ margin: '2em' }}>
					<NonIdealState
						title={this.props.pubData.error === 'Pub Deleted' ? 'Pub Deleted' : 'Pub Not Found'}
						visual={this.props.pubData.error === 'Pub Deleted' ? 'delete' : 'error'} />
				</div>
			);
		}

		// const meta = !this.props.params.meta ? 'files' : this.props.params.meta;
		// const mode = this.props.params.mode;
		const query = this.props.location.query;

		// const pathname = this.props.location.pathname;

		// const accountData = this.props.accountData || {};
		// const accountUser = accountData.user || {};
		// const accountId = accountUser.id;

		// const panel = query.panel;
		// const queryDiscussion = query.discussion;
		// const discussions = pub.discussions || [];

		const versions = pub.versions || [];
		const currentVersion = this.getCurrentVersion(versions);


		// Populate parent discussions with their children
		// const tempArray = [...discussions];
		// tempArray.forEach((discussion)=> {
		// 	discussion.children = tempArray.filter((child)=> {
		// 		return (child.replyParentPubId === discussion.id);
		// 	});
		// 	return discussion;
		// });


		// const discussionsData = discussions.filter((discussion)=> {
		// 	return discussion.replyParentPubId === pub.id;
		// }).sort((foo, bar)=> {
		// 	if (foo.createdAt > bar.createdAt) { return 1; }
		// 	if (foo.createdAt < bar.createdAt) { return -1; }
		// 	return 0;
		// });

		// const activeDiscussion = discussionsData.reduce((previous, current)=> {
		// 	if (queryDiscussion === String(current.threadNumber)) { return current; }
		// 	return previous;
		// }, {});


		return (
			<StickyContainer>
				<PubEditorHeader
					pub={pub}
					editorFiles={this.state.editorFiles}
					editorVersionMessage={this.state.editorVersionMessage}
					editorIsPublished={this.state.editorIsPublished}
					editorIsRestricted={this.state.editorIsRestricted}
					// onNameChange={this.onNameChange}
					onVersionMessageChange={this.onVersionMessageChange}
					onSaveVersion={this.onSaveVersion}
					onVersionPrivacyChange={this.onVersionPrivacyChange}
					onDiscardChanges={this.onDiscardChanges}
					version={currentVersion}
					params={this.props.params}
					isLoading={this.props.pubData.versionsLoading}
					error={this.props.pubData.versionsError}
					query={query} />

				<div id={'content-wrapper'} style={{ position: 'relative', width: '100%' }}>


					<PubEditorFiles
						version={currentVersion}
						pub={pub}
						onNameChange={this.onNameChange}
						editorMode={this.state.editorMode}
						editorFiles={this.state.editorFiles}
						editorDefaultFile={this.state.editorDefaultFile}
						onEditorModeChange={this.onEditorModeChange}
						onEditChange={this.onEditChange}
						onFileDelete={this.onFileDelete}
						onFileAdd={this.onFileAdd}
						onFileCreate={this.onFileCreate}
						updateEditorDefaultFile={this.updateEditorDefaultFile}
						params={this.props.params}
						query={query}
						isLoading={this.props.pubData.versionsLoading}
						error={this.props.pubData.versionsError}
						dispatch={this.props.dispatch} />


				</div>
			</StickyContainer>

		);
	}
});

export default Radium(PubEditor);

styles = {


};
