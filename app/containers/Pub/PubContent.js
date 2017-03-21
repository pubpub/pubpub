import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { StickyContainer } from 'react-sticky';
import PubBreadcrumbs from './PubBreadcrumbs';
import PubContentFiles from './PubContentFiles';
import PubDiscussion from './PubDiscussion';
import PubDiscussionsList from './PubDiscussionsList';
import PubDiscussionsNew from './PubDiscussionsNew';
import PubSidePanel from './PubSidePanel';
import PubHighlights from './PubHighlights';
import { postVersion } from './actionsVersions';

let styles;

export const PubContent = React.createClass({
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
			canGoBack: false,
			showAllDiscussions: false,
			// showClosedDiscussions: false,
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
		if (this.props.pubData.pub.id && this.props.params.mode === 'edit') {
			this.setState(this.enterEditModeObject)
		}
	},

	componentWillReceiveProps(nextProps) {
		const lastPanel = this.props.location.query.panel;
		const nextPanel = nextProps.location.query.panel;
		const lastPathname = this.props.location.pathname;
		const nextPathname = nextProps.location.pathname;

		if (!lastPanel && nextPanel && lastPathname === nextPathname) {
			this.setState({ canGoBack: true });
		} else {
			this.setState({ canGoBack: false });
		}

		const editMode = Object.keys(this.state.editorFiles).length > 0;
		if (!editMode && (!this.props.pubData.pub.id && nextPathname.pubData.pub.id && this.props.params.mode === 'edit' || !this.props.params.mode && nextProps.params.mode === 'edit')) {
			this.setState(this.enterEditModeObject)
		}

		const currentPub = this.props.pubData.pub || {};
		const nextPub = nextProps.pubData.pub || {};
		if (currentPub.id && this.getCurrentVersion(currentPub.versions).id !== this.getCurrentVersion(nextPub.versions).id) {
			window.unsavedEdits = false;
			const currentEditorFile = this.state.editorFiles[this.props.params.filename];
			const nextName = currentEditorFile && (currentEditorFile.newName || currentEditorFile.name);
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
				pathname: `/pub/${nextPub.slug}/files/${nextName || ''}`,
			});
			
		}
	},

	enterEditModeObject: function() {
		const versions = this.props.pubData.pub.versions || [];
		const currentVersion = this.getCurrentVersion(versions);
		const files = currentVersion.files || [];
		return {
			editorMode: 'markdown',
			editorIsPublished: currentVersion.isPublished,
			editorIsRestricted: currentVersion.isRestricted,
			editorDefaultFile: currentVersion.defaultFile,
			editorFiles: files.reduce((previous, current)=> {
				previous[current.name] = { ...current };
				return previous;
			}, {}),
		};
	},

	goBack: function() {
		// Note, this breaks if a user directly navigates to a discussion, clicks 'back' (rendering canGoBack = true), and then navigates back twice.
		// We need a way to turn canGoBack off again, but that feels a bit cumbersome at the moment.
		// Seems to be an open bug on react-router: https://github.com/ReactTraining/react-router/issues/408
		if (this.state.canGoBack) {
			browserHistory.goBack();
		} else {
			const query = this.props.location.query;
			const pathname = this.props.location.pathname;
			browserHistory.push({
				pathname: pathname,
				query: { ...query, panel: undefined, discussion: undefined, useHighlight: undefined, }
			});
		}
	},

	toggleShowAllDiscussions: function() {
		this.setState({ showAllDiscussions: !this.state.showAllDiscussions });
	},
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
		// TODO: uploaded markdown files won't have any content field
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
			name: `New File ${hours}:${minutes}:${seconds}`,
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

	// TODO: discard changes when viewing new file keeps filename in URL and causes bad render state
	// TODO: Need to block empty md files from being saved
	// TODO: Need to file filenames on edit (append md when necessary) - perhaps on save version
	// TODO: Need to show real privacy state and let switch
	// TODO: Make '2 files changed' real.

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
		const version = this.getCurrentVersion(this.props.pubData.pub.versions);
		// TODO: Remove duplicates if uploaded files with identical names
		
		const newVersionFiles = Object.keys(this.state.editorFiles).map((key)=> {
			const newFile = { ...this.state.editorFiles[key] };
			newFile.name = newFile.newName || newFile.name;
			if (this.state.editorMode === 'markdown') {
				newFile.content = newFile.newMarkdown || newFile.content;
			}
			// if (this.stae.editorMode === 'rich') {
			// 	newFile.content = parseMarkdown(newFile.newJSON) || newFile.content;	
			// }
			if (newFile.newName || newFile.newMarkdown || newFile.newJSON) {
				// If there are updates to the file, it's a new file, so remove its id.
				newFile.url = '/temp.md';
				delete newFile.id;
			}
			return newFile;
		}).filter((file)=> {
			return !file.isDeleted;
		}); 

		const defaultFile = this.state.editorFiles[this.state.editorDefaultFile].newName || this.state.editorFiles[this.state.editorDefaultFile].name;
		this.setState({ editorError: '' });
		return this.props.dispatch(postVersion(pubId, this.state.editorVersionMessage, false, newVersionFiles, defaultFile));
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
				<PubBreadcrumbs
					pub={pub}
					editorFiles={this.state.editorFiles}
					editorVersionMessage={this.state.editorVersionMessage}
					onNameChange={this.onNameChange}
					onVersionMessageChange={this.onVersionMessageChange}
					onSaveVersion={this.onSaveVersion}
					onDiscardChanges={this.onDiscardChanges}
					version={currentVersion}
					params={this.props.params}
					query={query} />

				<div id={'content-wrapper'} style={{ position: 'relative', width: '100%' }}>

					<div style={currentVersion.files && mode !=='edit' && (this.props.params.meta !== 'files' || this.props.params.filename) ? styles.left : {}}>
						<PubContentFiles
							version={currentVersion}
							pub={pub}
							editorFiles={this.state.editorFiles}
							editorDefaultFile={this.state.editorDefaultFile}
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

						<PubHighlights discussions={discussions} location={this.props.location} />
					</div>
					{currentVersion.files && mode !== 'edit' && (this.props.params.meta !== 'files' || this.props.params.filename) &&
						<div style={styles.rightPanel}>
							<PubSidePanel parentId={'content-wrapper'}>
								<div style={styles.discussionListVisible(!panel && !queryDiscussion)}>
									<PubDiscussionsList
										discussionsData={discussionsData}
										highlightData={this.props.highlightData}
										pub={pub}
										showAllDiscussions={this.state.showAllDiscussions}
										toggleShowAllDiscussions={this.toggleShowAllDiscussions}
										// showClosedDiscussions={this.state.showClosedDiscussions}
										// toggleShowClosedDiscussions={this.toggleShowClosedDiscussions}
										pathname={pathname}
										isVisible={!panel && !queryDiscussion}
										query={query}
										dispatch={this.props.dispatch} />
								</div>
								{panel === 'new' &&
									<PubDiscussionsNew
										discussionsData={discussionsData}
										highlightData={this.props.highlightData}
										pub={pub}
										goBack={this.goBack}
										accountId={accountId}
										isLoading={this.props.pubData.discussionsLoading}
										error={this.props.pubData.discussionsError}
										pathname={pathname}
										query={query}
										dispatch={this.props.dispatch} />
								}
								{!!queryDiscussion &&
									<PubDiscussion
										discussion={activeDiscussion}
										highlightData={this.props.highlightData}
										pub={pub}
										goBack={this.goBack}
										accountId={accountId}
										isLoading={this.props.pubData.discussionsLoading}
										error={this.props.pubData.discussionsError}
										pathname={pathname}
										query={query}
										dispatch={this.props.dispatch} />
								}

							</PubSidePanel>
						</div>
					}

				</div>
			</StickyContainer>

		);
	}
});

export default Radium(PubContent);

styles = {
	left: {
		position: 'relative',
		marginRight: '35%',
		paddingRight: '4em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginRight: 0,
			paddingRight: 0,
		}
	},
	rightPanel: {
		position: 'absolute',
		right: 0,
		top: 0,
		width: '35%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	// right: {
	// 	height: '100%',
	// 	// maxHeight: '100vh',
	// 	// backgroundColor: '#f3f3f4',
	// 	width: '35%',
	// 	position: 'absolute',
	// 	right: 0,
	// 	top: 0,
	// 	zIndex: 10,
	// 	// boxShadow: 'inset 0px 0px 1px #777',
	// },
	// rightSticky: {
	// 	maxHeight: '100vh',
	// 	overflow: 'hidden',
	// 	overflowY: 'scroll',
	// 	padding: '0.5em 1em 0.5em',
	// },
	
	discussionListVisible: (isVisible)=> {
		return {
			display: isVisible ? 'block' : 'none',
		};
	},

};
