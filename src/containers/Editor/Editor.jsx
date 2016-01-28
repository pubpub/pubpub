/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {LoaderDeterminate, EditorPluginPopup, EditorModals, EditorTopNav, EditorBottomNav, PubBody} from '../../components';
import {clearPub} from '../../actions/pub';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, publishVersion, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {saveSettingsUser} from '../../actions/login';
// import {loadCss} from '../../utils/loadingFunctions';
import {debounce} from '../../utils/loadingFunctions';
import {submitPubToJournal} from '../../actions/journal';

import initCodeMirrorMode from './editorCodeMirrorMode';
import {styles, codeMirrorStyles} from './editorStyles';
import {globalStyles} from '../../utils/styleConstants';

import {insertText, createFocusDoc, addCodeMirrorKeys} from './editorCodeFunctions';
import {editorDefaultText} from './editorDefaultText';

import SHA1 from 'crypto-js/sha1';
import encHex from 'crypto-js/enc-hex';

// import marked from '../../markdown/markdown';
// import markdownExtensions from '../../components/EditorPlugins';
import FirepadUserList from './editorFirepadUserlist';

import {Discussions} from '../';

import {convertFirebaseToObject} from '../../utils/parsePlugins';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

const FireBaseURL = (process.env.NODE_ENV === 'production') ? 'https://pubpub.firebaseio.com/' : 'https://pubpub-dev.firebaseio.com/';

const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
	autofocus: false,
	mode: 'spell-checker',
	backdrop: 'pubpubmarkdown',
	extraKeys: {'Ctrl-Space': 'autocomplete'}
};

const Editor = React.createClass({
	propTypes: {
		pubData: PropTypes.object, // Used to get new pub titles
		journalData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object, // User login data
		slug: PropTypes.string, // equal to project uniqueTitle
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin, ReactFireMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			return dispatch(getPubEdit(routeParams.slug));
		},
	},

	getInitialState() {
		return {
			initialized: false,
			tree: [],
			markdown: '',
			travisTOC: [],
			travisTOCFull: [],
			activeFocus: '',
			firepadData: {
				collaborators: {},
				assets: {},
				references: {},
				selections: [],
				settings: {},
			},
			codeMirrorChange: {},
			editorSaveStatus: 'saved',
			previewPaneMode: 'preview',
		};
	},

	componentDidMount() {
		if (! this.props.editorData.get('error')) {

			// loadCss('/css/codemirror.css');
			// loadCss('/css/react-select.min.css');
			initCodeMirrorMode();

			if (this.props.editorData.getIn(['pubEditData', 'token'])) {
				this.initializeEditorData(this.props.editorData.getIn(['pubEditData', 'token']));
			}

		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.editorData.get('publishSuccess')) {
			this.props.dispatch(pushState(null, ('/pub/' + nextProps.slug)));
		}
		if (!this.state.initialized && nextProps.editorData.getIn(['pubEditData', 'token'])) {
			this.initializeEditorData(nextProps.editorData.getIn(['pubEditData', 'token']));
		}

	},

	componentWillUnmount() {
		this.props.dispatch(closeModal());
		this.props.dispatch(unmountEditor());
	},

	initializeEditorData: function(token) {
		// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData' );
		ref.authWithCustomToken(token, (error, authData)=> {
			if (error) {
				console.log('Authentication Failed!', error);
			} else {
				this.bindAsObject(ref, 'firepadData');

				// Load Firebase ref that is used for firepad
				const firepadRef = new Firebase(FireBaseURL + this.props.slug + '/firepad');

				// Load codemirror
				const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions);
				this.cm = codeMirror;

				// Get Login username for firepad use. Shouldn't be undefined, but set default in case.
				const username = (this.props.loginData.get('loggedIn') === false) ? 'cat' : this.props.loginData.getIn(['userData', 'username']);

				// Initialize Firepad using codemirror and the ref defined above.
				const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
					userId: username,
					defaultText: editorDefaultText(this.props.pubData.getIn(['createPubData', 'title']))
				});

				new Firebase(FireBaseURL + '.info/connected').on('value', (connectedSnap)=> {
					if (connectedSnap.val() === true) {
						/* we're connected! */
						this.setState({editorSaveStatus: 'saved'});
					} else {
						/* we're disconnected! */
						this.setState({editorSaveStatus: 'disconnected'});
					}
				});

				FirepadUserList.fromDiv(firepadRef.child('users'),
					document.getElementById('userlist'), username, this.props.loginData.getIn(['userData', 'name']), this.props.loginData.getIn(['userData', 'thumbnail']));

				firepad.on('synced', (synced)=>{
					// console.log('before debounce', synced);
					debounce(()=> {
						this.updateSaveStatus(synced);
					}, 250)();
				});

				// need to unmount on change
				codeMirror.on('change', this.onEditorChange);
				addCodeMirrorKeys(codeMirror);

				this.setState({initialized: true});
			}
		});

	},

	getActiveCodemirrorInstance: function() {
		const cm = this.state.activeFocus === ''
				? document.getElementById('codemirror-wrapper').childNodes[0].childNodes[0].CodeMirror
				: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;

		return cm;
	},


	showPopupFromAutocomplete: function(completion) { // completion, element
		const cords = this.cm.cursorCoords();
		this.refs.pluginPopup.showAtPos(cords.left - 10, cords.top);
		if (completion) {
			CodeMirror.off(completion, 'pick', this.showPopupFromAutocomplete);
		}
		return;
	},

	updateSaveStatus: function(isSynced) {
		if (!isSynced) {
			if (this.state.editorSaveStatus !== 'disconnected') {
				this.setState({editorSaveStatus: 'saving'});
			}
		} else {
			this.setState({editorSaveStatus: 'saved'});
		}
	},

	onEditorChange: function(cm, change) {
		// console.log(change);
		// const start = performance.now();
		CodeMirror.commands.autocomplete(cm, CodeMirror.hint.plugins, {completeSingle: false});

		if (cm.state.completionActive && cm.state.completionActive.data) {
			const completion = cm.state.completionActive.data;
			CodeMirror.on(completion, 'pick', this.showPopupFromAutocomplete);
		}
		// const start = performance.now();

		// This feels inefficient.
		// An alternative is that we don't pass a trimmed version of the text to the markdown processor.
		// Instead we define header plugins and pass the entire thing to both here and body.
		// const markdownStart = performance.now();
		const fullMD = cm.getValue();
		// const markdownGrab = performance.now();
		const titleRE = /\[\[title:(.*?)\]\]/i;
		const titleMatch = fullMD.match(titleRE);
		const title = titleMatch && titleMatch.length ? titleMatch[1].trim() : '';
		// const titleGrabAndSet = performance.now();

		const abstractRE = /\[\[abstract:(.*?)\]\]/i;
		const abstractMatch = fullMD.match(abstractRE);
		const abstract = abstractMatch && abstractMatch.length ? abstractMatch[1].trim() : '';
		// const abstractGrabAndSet = performance.now();

		const authorsNoteRE = /\[\[authorsNote:(.*?)\]\]/i;
		const authorsNoteMatch = fullMD.match(authorsNoteRE);
		const authorsNote = authorsNoteMatch && authorsNoteMatch.length ? authorsNoteMatch[1].trim() : '';
		// const aNGrabAndSet = performance.now();

		const assets = convertFirebaseToObject(this.state.firepadData.assets);
		const references = convertFirebaseToObject(this.state.firepadData.references, true);
		const selections = [];
		const markdown = fullMD.replace(/\[\[title:.*?\]\]/g, '').replace(/\[\[abstract:.*?\]\]/g, '').replace(/\[\[authorsNote:.*?\]\]/g, '').trim();
		// const removeTitleEtc = performance.now();
		// let compiledMarkdown = 0;
		// let saveState = 0;

		try {

			// compiledMarkdown = performance.now();
			this.setState({
				markdown: markdown,
				travisTOC: [],
				travisTOCFull: [],
				// travisTOC: mdOutput.travisTOC,
				// travisTOCFull: mdOutput.travisTOCFull,
				codeMirrorChange: change,
				title: title,
				abstract: abstract,
				authorsNote: authorsNote,
				assetsObject: assets,
				referencesObject: references,
				selectionsArray: selections,
			});
			// saveState = performance.now();
		} catch (err) {
			console.log('Compiling error: ', err);
			this.setState({
				tree: [],
				title: 'Error Compiling',
				abstract: err.toString().replace('Please report this to https://github.com/chjj/marked.', ''),
			});
		}
		// console.log('total', saveState - start);
		// console.log('preMD', markdownStart - start);
		// console.log('markdownGrab', markdownGrab - start, markdownGrab - markdownStart);
		// console.log('titleGrab', titleGrabAndSet - start, titleGrabAndSet - markdownGrab);
		// console.log('abstractGrab', abstractGrabAndSet - start, abstractGrabAndSet - titleGrabAndSet);
		// console.log('anGrab', aNGrabAndSet - start, aNGrabAndSet - abstractGrabAndSet);
		// console.log('removeTitleEtc', removeTitleEtc - start, removeTitleEtc - aNGrabAndSet);
		// console.log('compiledMarkdown', compiledMarkdown - start, compiledMarkdown - removeTitleEtc);
		// console.log('saveState', saveState - start, saveState - compiledMarkdown);
		// console.log('~~~~~~~~~~~~~~~~~~');
		// const end = performance.now();
		// console.log('timing = ', end - start);

	},

	toggleLivePreview: function() {
		this.closeModalHandler();
		return this.props.dispatch(toggleEditorViewMode());
	},

	// Toggle formatting dropdown
	// Only has an effect when in livePreview mode
	toggleFormatting: function() {
		return this.props.dispatch(toggleFormatting());
	},

	// Toggle Table of Contents dropdown
	// Only has an effect when in livePreview mode
	toggleTOC: function() {
		return this.props.dispatch(toggleTOC());
	},

	publishVersion: function(versionState, versionDescription) {

		// const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
		const cm = document.getElementById('codemirror-wrapper').childNodes[0].childNodes[0].CodeMirror;
		const fullMD = cm.getValue();

		const titleRE = /\[\[title:(.*?)\]\]/i;
		const titleMatch = fullMD.match(titleRE);
		const title = titleMatch && titleMatch.length ? titleMatch[1].trim() : '';

		const abstractRE = /\[\[abstract:(.*?)\]\]/i;
		const abstractMatch = fullMD.match(abstractRE);
		const abstract = abstractMatch && abstractMatch.length ? abstractMatch[1].trim() : '';

		const authorsNoteRE = /\[\[authorsNote:(.*?)\]\]/i;
		const authorsNoteMatch = fullMD.match(authorsNoteRE);
		const authorsNote = authorsNoteMatch && authorsNoteMatch.length ? authorsNoteMatch[1].trim() : '';

		const authors = [];
		for (const collaborator in this.state.firepadData.collaborators) {
			if (this.state.firepadData.collaborators[collaborator].permission === 'edit') {
				authors.push(this.state.firepadData.collaborators[collaborator]._id);
			}
		}

		// pHashes are generated and collected to perform discussion highlight synchronization
		const pTags = document.querySelectorAll('.mainRenderBody .p-block');
		// console.log(pTags);
		const pHashes = {};
		for ( const key in pTags ) {
			if (pTags.hasOwnProperty(key)) {
				pHashes[SHA1(pTags[key].innerText).toString(encHex)] = parseInt(key, 10) + 1;
			}
		}

		// console.log(pHashes);

		const newVersion = {
			slug: this.props.slug,
			title: title,
			abstract: abstract,
			authorsNote: authorsNote,
			markdown: fullMD.replace(/\[\[title:.*?\]\]/g, '').replace(/\[\[abstract:.*?\]\]/g, '').replace(/\[\[authorsNote:.*?\]\]/g, '').trim(),
			authors: authors,
			assets: this.state.firepadData.assets,
			references: this.state.firepadData.references,
			// selections: this.state.firepadData.selections,
			style: this.state.firepadData.settings.pubStyle,
			status: versionState,
			pHashes: pHashes,
			publishNote: versionDescription,
		};
		this.props.dispatch(clearPub());

		// This should perhaps be done on the backend in one fell swoop - rather than having two client side calls.
		if (this.props.journalData.get('baseSubdomain')) {
			this.props.dispatch(submitPubToJournal(this.props.editorData.getIn(['pubEditData', '_id']), this.props.journalData.getIn(['journalData']).toJS()));
		}

		this.props.dispatch(publishVersion(newVersion));

	},

	// Add asset to firebase.
	// Will trigger other open clients to sync new assets data.
	addAsset: function(asset) {
		// Cleanup refname. No special characters, underscores, etc.
		let refName = asset.originalFilename.replace(/[^0-9a-z]/gi, '');

		// Make sure refname is unique.
		// If it's not unique, append a timestamp.
		if (this.state.firepadData.assets && refName in this.state.firepadData.assets) {
			refName = refName + '_' + Date.now();
		}
		// Add refname and author to passed in asset object.
		asset.refName = refName;
		asset.author = this.props.loginData.getIn(['userData', 'username']);

		// Push to firebase ref
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/assets' );
		ref.push(asset);
	},

	deleteAsset: function(assetID) {
		return ()=>{
			const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/assets/' + assetID );
			ref.remove();
		};
	},

	saveUpdatedCollaborators: function(newCollaborators, removedUser) {
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/collaborators' );
		ref.set(newCollaborators);
		this.props.dispatch(saveCollaboratorsToPub(newCollaborators, removedUser, this.props.slug));
	},

	saveUpdatedSettingsUser: function(newSettings) {
		this.props.dispatch(saveSettingsUser(newSettings));
	},

	saveUpdatedSettingsFirebase: function(newSettings) {
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/settings' );
		ref.update(newSettings);
	},

	saveUpdatedSettingsFirebaseAndPubPub: function(newSettings) {
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/settings' );
		ref.update(newSettings);
		this.props.dispatch(saveSettingsPubPub(this.props.slug, newSettings));
	},

	saveReferences: function(newReferences) {
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/references' );
		ref.set(newReferences);
	},

	closeModalHandler: function() {
		this.props.dispatch(closeModal());
	},

	openModalHandler: function(activeModal) {
		return ()=> this.props.dispatch(openModal(activeModal));
	},

	insertFormatting: function(formatting) {
		return ()=>{
			const cm = this.getActiveCodemirrorInstance();
			insertText(cm, formatting, this.showPopupFromAutocomplete);
			this.toggleFormatting();
		};
	},

	// TODO: use the index variable that's passed in to accomodate the case
	// where a document has more than one identical header title.
	// Right now, no matter which is clicked, the focus will focus on the first instance of it.
	// focusEditor: function(title, index) {
	focusEditor: function(title) {
		return ()=>{
			// If the focus button clicked is the same as the activeFocus, turn off the focusing
			if (this.state.activeFocus === title) {
				this.setState({ activeFocus: ''});
				document.getElementById('codemirror-focus-wrapper').innerHTML = ''; // Erase the existing focus CodeMirror
			} else {
				createFocusDoc(title, cmOptions);
				this.setState({ activeFocus: title }); // Update the activeFocus state
				this.toggleTOC(); // Hide the TOC if we were in live-preview mode and it was expanded
			}
		};
	},

	getAuthorsArray: function() {

		if (!this.state.firepadData.collaborators) { return []; }
		const outputAuthors = [];
		Object.keys(this.state.firepadData.collaborators).map((author)=>{
			if (this.state.firepadData.collaborators[author].permission === 'edit') {
				outputAuthors.push(this.state.firepadData.collaborators[author]);
			}
		});
		return outputAuthors;
	},

	renderNav: function(mobileView) {
		// if isEditor, add 'Public Discussions' | 'Collaborator Comments'  | 'Live Preview'
		// remove whichever one is active in state at the moment
		const discussionsExist = this.props.editorData.getIn(['pubEditData', 'discussions']) && this.props.editorData.getIn(['pubEditData', 'discussions']).size;

		const editorCommentsTab = (
			<div key={mobileView ? 'mobileBodyNav2' : 'previewBodyNav2'} style={styles.bodyNavItem} onClick={this.switchPreviewPaneMode('comments')}>
				Editor Comments
			</div>
		);

		const publicDiscussionsTab = (
			<div key={mobileView ? 'mobileBodyNav1' : 'previewBodyNav1'} style={styles.bodyNavItem} onClick={this.switchPreviewPaneMode('discussions')}>
				Public Discussions
			</div>
		);

		const livePreviewTab = (
			<div key={mobileView ? 'mobileBodyNav3' : 'previewBodyNav3'} style={styles.bodyNavItem} onClick={this.switchPreviewPaneMode('preview')}>
				Live Preview
			</div>
		);

		return (<div className={'editorBodyNav'} style={styles.bodyNavBar}>

			{(()=>{
				switch (this.state.previewPaneMode) {
				case 'preview':
					return (
						<div>
							{editorCommentsTab}
							<div style={[styles.bodyNavSeparator, styles.mobileOnlySeparator]}>|</div>
							{discussionsExist
								? <div style={styles.bodyNavDiscussionBlock}>
									<div style={styles.bodyNavSeparator}>|</div>
									{publicDiscussionsTab}
								</div>
								: null
							}

						</div>
					);
				case 'comments':
					return (
						<div>
							{livePreviewTab}
							<div style={[styles.bodyNavSeparator, styles.mobileOnlySeparator]}>|</div>
							{discussionsExist
								? <div style={styles.bodyNavDiscussionBlock}>
									<div style={styles.bodyNavSeparator}>|</div>
									{publicDiscussionsTab}
								</div>
								: null
							}
						</div>
					);
				case 'discussions':
					return (
						<div>
							{editorCommentsTab}
							<div style={styles.bodyNavSeparator}>|</div>
							{livePreviewTab}
						</div>
					);
				default:
					return null;
				}
			})()}

		</div>);
	},

	switchPreviewPaneMode: function(mode) {
		return ()=>{
			this.setState({previewPaneMode: mode});
		};
	},

	renderBody: function() {
		const referencesList = [];
		for ( const key in this.state.firepadData.references ) {
			if (this.state.firepadData.references.hasOwnProperty(key)) {
				referencesList.push(this.state.firepadData.references[key]);
			}
		}

		return (
			<PubBody
				status={'loaded'}
				title={this.state.title}
				abstract={this.state.abstract}
				authorsNote={this.state.authorsNote}
				minFont={15}
				htmlTree={this.state.tree}
				markdown={this.state.markdown}
				authors={this.getAuthorsArray()}
				// addSelectionHandler={this.addSelection}
				style={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubStyle : undefined}
				assetsObject={this.state.assetsObject}
				referencesObject={this.state.referencesObject}
				selectionsArray={this.state.selectionsArray}

				references={referencesList}
				isFeatured={true}/>
		);
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const darkMode = this.props.loginData.getIn(['userData', 'settings', 'editorColor']) === 'dark';

		// Set metadata for the page.
		const metaData = {
			title: 'PubPub - Editing ' + this.props.slug
		};

		const isReader = this.props.editorData.getIn(['pubEditData', 'isReader']);
		return (

			<div style={[styles.editorContainer, darkMode && styles.editorContainerDark]} className={'editor-container'}>

				<Helmet {...metaData} />

				<Style rules={{
					...codeMirrorStyles(this.props.loginData),
					'.pagebreak': {
						opacity: '1', // Alternatively, instead of using !important, we could pass a variable to PubBody that differentiates whether we're in the Reader or Editor and toggle the pagebreak opacity accordingly.
					},
					'.firepad-userlist-user': {
						height: '30px',
						overflow: 'hidden',
						display: 'inline-block',
						position: 'relative',
					},
					'.firepad-userlist-user:hover': {
						overflow: 'visible',
					},
					'.firepad-userlist-image': {
						height: '20px',
						padding: '5px',
					},
					'.firepad-userlist-color-indicator': {
						position: 'absolute',
						height: '3px',
						bottom: '2px',
						left: '5px',
						width: '20px',
					},
					'.firepad-userlist-name': {
						position: 'absolute',
						width: '250px',
						left: '-110px',
						textAlign: 'center',
						bottom: '-20px',
						height: '20px',
						lineHeight: '20px',
						backgroundColor: '#F5F5F5',

					},

				}} />

				{/*	'Not Authorized' or 'Error' Note */}
				{this.props.editorData.get('error')
					? <div style={styles.errorTitle}>{this.props.editorData.getIn(['pubEditData', 'title'])}</div>
					: <div>
						{/*
							Mobile
								renderNav
								renderBody (switches out in place with comments/discussions)


							Not Mobile
								isReader
									renderBody
									renderComments

								isEditor
									renderEditor
									renderNav
									renderBody (switches out in place with comments/discussions)

						*/}
						{/* Mobile */}
						<div style={styles.isMobile}>
							{/* In mobile - readers and editors have the same view. Editors have a note about screen size. */}
							{this.renderNav(true)}

							<div style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'preview' && styles.previewBlockWrapperShow]}>
								{isReader
									? null
									: <span style={styles.editorDisabledMessage}>
										<FormattedMessage id="editingDisableMobile" defaultMessage="Editing disabled on mobile view - but you can still read and comment. Open on a laptop or desktop to edit." />
									</span>

								}

								{this.renderBody()}
							</div>

							<div style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'comments' && styles.previewBlockWrapperShow]}>
								<div style={styles.previewBlockHeader}>Editor Comments</div>
								<div style={styles.previewBlockText}>
									<div><FormattedMessage {...globalMessages.editorCommentsText0} /></div>
									<div><FormattedMessage {...globalMessages.editorCommentsText1} /></div>
								</div>

								<Discussions inEditor={true} editorCommentMode={true} instanceName={'mobileEditorComments'}/>
							</div>

						</div>

						{/* Not Mobile */}
						<div style={styles.notMobile}>
							{isReader
								? <div>

									<div style={styles.hiddenCodeMirror}>
										{/*  Necessary for body rednering to work */}
										<EditorTopNav
											status={editorData.get('status')}
											darkMode={darkMode}
											openModalHandler={this.openModalHandler}
											editorSaveStatus={this.state.editorSaveStatus}
											toggleLivePreviewHandler={this.toggleLivePreview}/>
										<div id="codemirror-wrapper"></div>
									</div>

									<div className={'editorBodyView'} style={[styles.readerViewBlock, styles.readerViewBlockBody]}>
										{this.renderBody()}
									</div>

									<div style={[styles.readerViewBlock]}>
										<div style={styles.previewBlockHeader}>Editor Comments</div>
										<div style={styles.previewBlockText}>
											<div><FormattedMessage {...globalMessages.editorCommentsText0} /></div>
											<div><FormattedMessage {...globalMessages.editorCommentsText1} /></div>
										</div>
										<Discussions inEditor={true} editorCommentMode={true} instanceName={'desktopEditorComments'}/>
									</div>

								</div>

								: <div>
									{/* Editor's View */}
									{/*	Component for all modals and their backdrop. */}
									<EditorModals
										closeModalHandler={this.closeModalHandler}
										activeModal={this.props.editorData.get('activeModal')}
										slug={this.props.slug}
										// Asset Props
										assetData={this.state.firepadData.assets}
										addAsset={this.addAsset}
										deleteAsset={this.deleteAsset}
										// Collaborator Props
										collaboratorData={this.state.firepadData.collaborators}
										updateCollaborators={this.saveUpdatedCollaborators}
										// Publish Props
										handlePublish={this.publishVersion}
										currentJournal={this.props.journalData.getIn(['journalData', 'journalName'])}

										// References Props
										referenceData={this.state.firepadData.references}
										referenceStyle={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubReferenceStyle : undefined}
										updateReferences={this.saveReferences}
										// Style Props
										editorFont={this.props.loginData.getIn(['userData', 'settings', 'editorFont'])}
										editorFontSize={this.props.loginData.getIn(['userData', 'settings', 'editorFontSize'])}
										editorColor={this.props.loginData.getIn(['userData', 'settings', 'editorColor'])}
										pubPrivacy={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubPrivacy : undefined}
										pubStyle={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubStyle : undefined}
										saveUpdatedSettingsUser={this.saveUpdatedSettingsUser}
										saveUpdatedSettingsFirebase={this.saveUpdatedSettingsFirebase}
										saveUpdatedSettingsFirebaseAndPubPub={this.saveUpdatedSettingsFirebaseAndPubPub} />

									{/* Top Nav. Fixed to the top of the editor page, just below the main pubpub bar */}
									<EditorTopNav
										status={editorData.get('status')}
										darkMode={darkMode}
										openModalHandler={this.openModalHandler}
										editorSaveStatus={this.state.editorSaveStatus}
										toggleLivePreviewHandler={this.toggleLivePreview}/>

									{/*	Horizontal loader line - Separates top bar from rest of editor page */}
									<div style={styles.editorLoadBar}>
										<LoaderDeterminate value={loadStatus === 'loading' ? 0 : 100}/>
									</div>

									{/* Bottom Nav */}
									<EditorBottomNav
										viewMode={viewMode}
										loadStatus={loadStatus}
										darkMode={darkMode}
										showBottomLeftMenu={showBottomLeftMenu}
										showBottomRightMenu={showBottomRightMenu}
										toggleTOCHandler={this.toggleTOC}
										toggleFormattingHandler={this.toggleFormatting}
										activeFocus={this.state.activeFocus}
										focusEditorHandler={this.focusEditor}
										travisTOC={this.state.travisTOC}
										insertFormattingHandler={this.insertFormatting}/>

									{/* Markdown Editing Block */}
									<div id="editor-text-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>

										<EditorPluginPopup ref="pluginPopup" references={this.state.firepadData.references} assets={this.state.firepadData.assets} /* selections={this.state.firepadData.selections} */ activeFocus={this.state.activeFocus} codeMirrorChange={this.state.codeMirrorChange}/>

										{/* Insertion point for codemirror and firepad */}
										<div style={[this.state.activeFocus !== '' && styles.hiddenMainEditor]}>
											<div id="codemirror-wrapper"></div>
										</div>

										{/* Insertion point for Focused codemirror subset */}
										<div id="codemirror-focus-wrapper"></div>

									</div>

									{/* Live Preview Block */}
									<div id="editor-live-preview-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.common.editorPreview, styles[viewMode].editorPreview]} className={'editorPreview'}>

										{this.renderNav(false)}

										<div className="editorBodyView" style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'preview' && styles.previewBlockWrapperShow]}>
											<div className={'mainRenderBody'}>
												{this.renderBody()}
											</div>
										</div>

										<div style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'comments' && styles.previewBlockWrapperShow]}>
											<div style={styles.previewBlockHeader}>
												<FormattedMessage {...globalMessages.EditorComments} />
											</div>
											<div style={styles.previewBlockText}>
												<div><FormattedMessage {...globalMessages.editorCommentsText0} /></div>
												<div><FormattedMessage {...globalMessages.editorCommentsText1} /></div>
											</div>
											<Discussions editorCommentMode={true} inEditor={true}/>
										</div>

										<div style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'discussions' && styles.previewBlockWrapperShow]}>
											<div style={styles.previewBlockHeader}>
												<FormattedMessage {...globalMessages.discussion} />
											</div>
											<div style={styles.previewBlockText}>
												<FormattedMessage id="editorDiscussionMessage" defaultMessage="This section shows the discussion from the public, published version of your pub."/>
											</div>
											<Discussions editorCommentMode={false} inEditor={true}/>
										</div>

									</div>
								</div>
							}

						</div>


					</div>
				}
			</div>
		);
	}

});

export default connect( state => {
	return {
		pubData: state.pub,
		journalData: state.journal,
		editorData: state.editor,
		slug: state.router.params.slug,
		loginData: state.login
	};
})( Radium(Editor) );
