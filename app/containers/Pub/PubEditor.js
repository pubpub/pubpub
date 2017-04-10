import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { jsonToMarkdown, markdownToJSON, bibtexToCSL } from '@pubpub/prose';
import { StickyContainer } from 'react-sticky';
import PubEditorHeader from './PubEditorHeader';
import PubEditorFiles from './PubEditorFiles';
import PubDiscussion from './PubDiscussion';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubSidePanel from './PubSidePanel';
import PubHighlights from './PubHighlights';
import { postVersion } from './actionsVersions';


let styles;

export const PubEditor = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		highlightData: PropTypes.object,
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
		console.log('mounting editor', this.props.pubData.pub);
		// if (this.props.pubData.pub.id && this.props.params.mode === 'edit') {
		// this.setState(this.enterEditModeObject);
		// }
	},

	componentWillReceiveProps(nextProps) {
		const lastPanel = this.props.location.query.panel;
		const nextPanel = nextProps.location.query.panel;
		const lastPathname = this.props.location.pathname;
		const nextPathname = nextProps.location.pathname;

		const editMode = Object.keys(this.state.editorFiles).length > 0;
		if (!editMode && (!this.props.pubData.pub.id && nextPathname.pubData.pub.id && this.props.params.mode === 'edit' || !this.props.params.mode && nextProps.params.mode === 'edit')) {
			this.setState(this.enterEditModeObject(nextProps));
		}

		if (editMode && this.props.params.filename !== nextProps.params.filename && nextProps.params.filename) {
			const versions = nextProps.pubData.pub.versions || [];
			const currentVersion = this.getCurrentVersion(versions);
			// const files = currentVersion.files || [];
			const currentFileName = nextProps.params.filename;

			const newEditorFiles = { ...this.state.editorFiles };
			// if (this.state.editorMode === 'markdown') {
			// 	newEditorFiles[currentFileName].initialContent = newEditorFiles[currentFileName].newMarkdown || (newEditorFiles[currentFileName].newJSON && jsonToMarkdown(newEditorFiles[currentFileName].newJSON)) || newEditorFiles[currentFileName].content;
			// }
			// if (this.state.editorMode === 'rich') {

			const files = Object.keys(this.state.editorFiles).map((key)=> {
				return this.state.editorFiles[key];
			});

			const localReferences = this.getLocalReferences(files);
			newEditorFiles[currentFileName].initialContent = newEditorFiles[currentFileName].newJSON || (newEditorFiles[currentFileName].newMarkdown && markdownToJSON(newEditorFiles[currentFileName].newMarkdown, localReferences)) || markdownToJSON(newEditorFiles[currentFileName].content, localReferences);
			newEditorFiles[currentFileName].newJSON = newEditorFiles[currentFileName].newJSON || (newEditorFiles[currentFileName].newMarkdown && markdownToJSON(newEditorFiles[currentFileName].newMarkdown), localReferences) || markdownToJSON(newEditorFiles[currentFileName].content, localReferences);
			// }
			

			this.setState({
				editorMode: 'rich',
				editorFiles: newEditorFiles,
			});

		}

		if (this.props.params.meta === 'files' && nextProps.params.meta !== 'files') {
			this.setState({
				editorMode: undefined,
				editorFiles: {},
				editorVersionMessage: '',
				editorVersionMessageUserChanged: false,
				editorIsPublished: undefined,
				editorIsRestricted: undefined,
				editorDefaultFile: undefined,
			});
		}

		const currentPub = this.props.pubData.pub || {};
		const nextPub = nextProps.pubData.pub || {};
		if (currentPub.id && this.getCurrentVersion(currentPub.versions).id !== this.getCurrentVersion(nextPub.versions).id) {
			window.unsavedEdits = false;
			const currentEditorFile = this.state.editorFiles[this.props.params.filename];
			const nextName = currentEditorFile && (currentEditorFile.newName || currentEditorFile.name);
			this.setState({
				editorFiles: {},
				editorVersionMessage: '',
				editorVersionMessageUserChanged: false,
				editorIsPublished: undefined,
				editorIsRestricted: undefined,
				editorDefaultFile: undefined,
			});
			browserHistory.push({
				pathname: `/pub/${nextPub.slug}/files/${nextName || ''}`,
			});
			
		}
	},

	componentWillUnmount() {
		window.unsavedEdits = false;
	},

	enterEditModeObject: function(inputProps) {
		const props = inputProps || this.props;
		const versions = props.pubData.pub.versions || [];
		const currentVersion = this.getCurrentVersion(versions);
		const files = currentVersion.files || [];
		// const currentFileName = props.params.filename || currentVersion.defaultFile;
		const currentFileName = props.params.filename;
		console.log('currentFileName', currentFileName);
		const defaultMode = 'rich';
		const localReferences = this.getLocalReferences(files);
		// console.log('localReferences are', localReferences);
		return {
			editorMode: defaultMode,
			editorIsPublished: currentVersion.isPublished,
			editorIsRestricted: currentVersion.isRestricted,
			editorDefaultFile: currentVersion.defaultFile,
			editorFiles: files.reduce((previous, current)=> {
				previous[current.name] = { ...current };
				if (defaultMode === 'rich' && currentFileName === current.name) {
					const newJSON = markdownToJSON(current.content, localReferences);
					previous[current.name].newJSON = newJSON;
					previous[current.name].initialContent = newJSON;
				}
				return previous;
			}, {}),
		};

	},

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
		if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		if (!currentFile) { return false; }
		const newEditorFiles = { ...this.state.editorFiles };
		// newEditorFiles[currentFile] = {
		// 	...newEditorFiles[currentFile],
		// 	newMarkdown: this.state.editorMode === 'markdown' ? newVal : undefined,
		// 	newJSON: this.state.editorMode === 'rich' ? newVal : undefined,
		// };
		newEditorFiles[currentFile].newMarkdown = this.state.editorMode === 'markdown' ? newVal : undefined;
		newEditorFiles[currentFile].newJSON = this.state.editorMode === 'rich' ? newVal : undefined;
		window.unsavedEdits = true;
		return this.setState({ editorFiles: newEditorFiles });
		
	},

	onEditorModeChange: function(newMode) {
		if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		const newEditorFiles = { ...this.state.editorFiles };

		if (newMode === 'markdown') {
			const newMarkdown = jsonToMarkdown(newEditorFiles[currentFile].newJSON);
			newEditorFiles[currentFile].newMarkdown = newMarkdown;
			newEditorFiles[currentFile].newJSON = undefined;
			newEditorFiles[currentFile].initialContent = newMarkdown;
		} else {
			const files = Object.keys(this.state.editorFiles).map((key)=> {
				return this.state.editorFiles[key];
			});

			const localReferences = this.getLocalReferences(files);
			console.log('these references are ', localReferences)
			const newJSON = markdownToJSON(newEditorFiles[currentFile].newMarkdown || newEditorFiles[currentFile].content, localReferences);
			newEditorFiles[currentFile].newMarkdown = undefined;
			newEditorFiles[currentFile].newJSON = newJSON;
			newEditorFiles[currentFile].initialContent = newJSON;
		}
		return this.setState({ 
			editorFiles: newEditorFiles,
			editorMode: newMode,
		});
				
	},

	onNameChange: function(evt) {
		if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		const newEditorFiles = { ...this.state.editorFiles };
		newEditorFiles[currentFile].newName = evt.target.value;
		window.unsavedEdits = true;
		return this.setState({ editorFiles: newEditorFiles });
	},

	onFileAdd: function(file) {
		const editMode = Object.keys(this.state.editorFiles).length > 0;
		// if (!editMode) { this.enterEditMode(); }
		const newState = !editMode ? this.enterEditModeObject() : this.state;

		const newEditorFiles = { ...newState.editorFiles };
		newEditorFiles[file.name] = file;
		window.unsavedEdits = true;
		this.setState({
			...newState,
			editorFiles: newEditorFiles 
		});
	},

	onFileCreate: function() {
		const editMode = Object.keys(this.state.editorFiles).length > 0;
		// if (!editMode) { this.enterEditMode(); }
		const newState = !editMode ? this.enterEditModeObject() : this.state;

		const date = new Date();
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		const seconds = ('0' + date.getSeconds()).slice(-2);
		const file = {
			url: '/temp.md',
			type: 'text/markdown',
			name: `NewFile-${hours}-${minutes}-${seconds}.md`,
			isNew: true,
			content: '',
		};

		const newEditorFiles = { ...newState.editorFiles };
		newEditorFiles[file.name] = file;
		window.unsavedEdits = true;
		// this.setState({ editorFiles: newEditorFiles });
		this.setState({
			...newState,
			editorFiles: newEditorFiles 
		});
		browserHistory.push({
			pathname: `/pub/${this.props.pubData.pub.slug}/files/${file.name}/edit`,
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
		if (!this.state.editorMode) { return false; }
		const currentFile = this.props.params.filename;
		const newEditorFiles = { ...this.state.editorFiles };
		newEditorFiles[currentFile].isDeleted = true;
		window.unsavedEdits = true;
		this.setState({ editorFiles: newEditorFiles });
		return browserHistory.push({
			pathname: `/pub/${this.props.pubData.pub.slug}/files`,
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
		const newVersionFiles = Object.keys(this.state.editorFiles).map((key)=> {
			const newFile = { ...this.state.editorFiles[key] };
			newFile.name = newFile.newName || newFile.name;
			// if (this.state.editorMode === 'markdown') {
			if (newFile.newMarkdown) {
				// newFile.content = newFile.newMarkdown || newFile.content;
				newFile.content = newFile.newMarkdown;
			}
			// if (this.state.editorMode === 'rich') {
			if (newFile.newJSON) {
				// newFile.content = newFile.newJSON ? jsonToMarkdown(newFile.newJSON) : newFile.content;	
				newFile.content = jsonToMarkdown(newFile.newJSON);
			}
			if (newFile.newName || newFile.newMarkdown || newFile.newJSON) {
				// If there are updates to the file, it's a new file, so remove its id.
				newFile.url = '/temp.md';
				delete newFile.id;
				delete newFile.hash;
				delete newFile.newJSON;
				delete newFile.newMarkdown;
				delete newFile.newName;
				delete newFile.initialContent;
			}
			return newFile;
		}).filter((file)=> {
			return !file.isDeleted;
		}); 

		const newDefaultFile = this.state.editorFiles[this.state.editorDefaultFile] || {};
		const oldDefaultFile = this.state.editorFiles[this.state.editorDefaultFile] || {};
		const currentDefaultFile = this.state.editorFiles[Object.keys(this.state.editorFiles)[0]] || {};
		const defaultFile = newDefaultFile.newName || newDefaultFile.name || oldDefaultFile.newName || oldDefaultFile.name || currentDefaultFile.newName || currentDefaultFile.name || 'main.md';
		this.setState({ editorError: '' });
		return this.props.dispatch(postVersion(pubId, this.state.editorVersionMessage, this.state.editorIsPublished, this.state.editorIsRestricted, newVersionFiles, defaultFile));
	},
	onDiscardChanges: function() {
		window.unsavedEdits = false;
		const currentEditorFile = this.state.editorFiles[this.props.params.filename] || {};
		const nextName = currentEditorFile.name;
		this.setState({
			editorMode: undefined,
			editorFiles: {},
			editorVersionMessage: '',
			editorVersionMessageUserChanged: false,
			editorIsPublished: undefined,
			editorIsRestricted: undefined,
			editorDefaultFile: undefined,
		});
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

		const meta = !this.props.params.meta ? 'files' : this.props.params.meta;
		const mode = this.props.params.mode;
		const query = this.props.location.query;
		
		const pathname = this.props.location.pathname;

		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;

		const panel = query.panel;
		const queryDiscussion = query.discussion;
		const discussions = pub.discussions || [];
		
		const versions = pub.versions || [];
		const currentVersion = this.getCurrentVersion(versions);


		// Populate parent discussions with their children
		const tempArray = [...discussions];
		tempArray.forEach((discussion)=> {
			discussion.children = tempArray.filter((child)=> {
				return (child.replyParentPubId === discussion.id);
			});
			return discussion;
		});


		const discussionsData = discussions.filter((discussion)=> {
			return discussion.replyParentPubId === pub.id;
		}).sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const activeDiscussion = discussionsData.reduce((previous, current)=> {
			if (queryDiscussion === String(current.threadNumber)) { return current; }
			return previous;
		}, {});
	

		return (
			<StickyContainer>
				<PubEditorHeader
					pub={pub}
					editorFiles={this.state.editorFiles}
					editorVersionMessage={this.state.editorVersionMessage}
					editorIsPublished={this.state.editorIsPublished}
					editorIsRestricted={this.state.editorIsRestricted}
					onNameChange={this.onNameChange}
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
