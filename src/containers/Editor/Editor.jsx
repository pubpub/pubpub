/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {Discussions, EditorModals} from '../';
import {LoaderDeterminate, EditorPluginPopup, EditorTopNav, EditorBottomNav, PubBody} from '../../components';
import {clearPub} from '../../actions/pub';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, publishVersion} from '../../actions/editor';

import {debounce} from '../../utils/loadingFunctions';
import {submitPubToJournal} from '../../actions/journal';

import initCodeMirrorMode from './editorCodeMirrorMode';
import {styles} from './editorStyles';
import {codeMirrorStyles, codeMirrorStyleClasses} from './codeMirrorStyles';
import {globalStyles} from '../../utils/styleConstants';

import {insertText, createFocusDoc, addCodeMirrorKeys} from './editorCodeFunctions';
import {editorDefaultText} from './editorDefaultText';

import FirepadUserList from './editorFirepadUserlist';

import {convertFirebaseToObject} from '../../utils/parsePlugins';
import {generateTOC} from '../../markdown/generateTOC';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let FireBaseURL;

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
			markdown: '',
			tocH1: [],
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
		FireBaseURL = (process.env.NODE_ENV === 'production' && location.hostname !== 'pubpub-dev.herokuapp.com') ? 'https://pubpub.firebaseio.com/' : 'https://pubpub-dev.firebaseio.com/';

		if (! this.props.editorData.get('error')) {

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
		return this.state.activeFocus === ''
			? document.getElementById('codemirror-wrapper').childNodes[0].childNodes[0].CodeMirror
			: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;
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

		CodeMirror.commands.autocomplete(cm, CodeMirror.hint.plugins, {completeSingle: false});

		if (cm.state.completionActive && cm.state.completionActive.data) {
			const completion = cm.state.completionActive.data;
			CodeMirror.on(completion, 'pick', this.showPopupFromAutocomplete);
		}

		const start = performance.now();

		const fullMD = cm.getValue();

		// Grab title, abstract, and authorsNote
		const titleMatch = fullMD.match(/\[\[title:(.*?)\]\]/i);
		const title = titleMatch && titleMatch.length ? titleMatch[1].trim() : '';
		const abstractMatch = fullMD.match(/\[\[abstract:(.*?)\]\]/i);
		const abstract = abstractMatch && abstractMatch.length ? abstractMatch[1].trim() : '';
		const authorsNoteMatch = fullMD.match(/\[\[authorsNote:(.*?)\]\]/i);
		const authorsNote = authorsNoteMatch && authorsNoteMatch.length ? authorsNoteMatch[1].trim() : '';

		// Generate TOC
		const startTOC = performance.now();
		const TOCs = generateTOC(fullMD);		
		const endTOC = performance.now();
		console.log('tocGen: ', endTOC - startTOC);

		// Format assets and references
		const assets = convertFirebaseToObject(this.state.firepadData.assets);
		const references = convertFirebaseToObject(this.state.firepadData.references, true);
		const selections = [];

		// Strip markdown of title, abstract, authorsNote
		const markdown = fullMD.replace(/\[\[title:.*?\]\]/g, '').replace(/\[\[abstract:.*?\]\]/g, '').replace(/\[\[authorsNote:.*?\]\]/g, '').trim();
		const compiledMarkdown = performance.now();

		// Set State to trigger re-render
		this.setState({
			markdown: markdown,
			tocH1: TOCs.h1,
			toc: TOCs.full,
			codeMirrorChange: change,
			title: title,
			abstract: abstract,
			authorsNote: authorsNote,
			assetsObject: assets,
			referencesObject: references,
			selectionsArray: selections,
		});

		const saveState = performance.now();
		
		console.log('saveState', saveState - start, saveState - compiledMarkdown);
		console.log('total', saveState - start);

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

	publishVersion: function(versionDescription) {

		const authors = [];
		for (const collaborator in this.state.firepadData.collaborators) {
			if (this.state.firepadData.collaborators[collaborator].permission === 'edit') {
				authors.push(this.state.firepadData.collaborators[collaborator]._id);
			}
		}

		const newVersion = {
			slug: this.props.slug,
			title: this.state.title,
			abstract: this.state.abstract,
			authorsNote: this.state.authorsNote,
			markdown: this.state.markdown,
			authors: authors,
			assets: this.state.firepadData.assets,
			references: this.state.firepadData.references,
			style: this.state.firepadData.settings.pubStyle,
			publishNote: versionDescription,
		};

		this.props.dispatch(clearPub());

		// This should perhaps be done on the backend in one fell swoop - rather than having two client side calls.
		if (this.props.journalData.get('baseSubdomain')) {
			this.props.dispatch(submitPubToJournal(this.props.editorData.getIn(['pubEditData', '_id']), this.props.journalData.getIn(['journalData']).toJS()));
		}

		this.props.dispatch(publishVersion(newVersion));

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

		// const discussionsExist = this.props.editorData.getIn(['pubEditData', 'discussions']) && this.props.editorData.getIn(['pubEditData', 'discussions']).size;

		return (
			<div className={'editorBodyNav'} style={styles.bodyNavBar}>
				<div key={mobileView ? 'mobileBodyNav2' : 'previewBodyNav2'} style={styles.bodyNavItem} onClick={this.switchPreviewPaneMode('comments')}>
					Editor Comments
				</div>
				<div style={styles.bodyNavSeparator}>|</div>
				<div key={mobileView ? 'mobileBodyNav1' : 'previewBodyNav1'} style={styles.bodyNavItem} onClick={this.switchPreviewPaneMode('discussions')}>
					Public Discussions
				</div>
			</div>
		);
	},

	switchPreviewPaneMode: function(mode) {
		return ()=>{
			this.setState({previewPaneMode: mode});
		};
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const darkMode = this.props.loginData.getIn(['userData', 'settings', 'editorColor']) === 'dark';

		const referencesList = [];
		for ( const key in this.state.firepadData.references ) {
			if (this.state.firepadData.references.hasOwnProperty(key)) {
				referencesList.push(this.state.firepadData.references[key]);
			}
		}

		// Set metadata for the page.
		const metaData = {
			title: 'PubPub - Editing ' + this.props.slug
		};

		return (

			<div style={[styles.editorContainer, darkMode && styles.editorContainerDark]} className={'editor-container'}>

				<Helmet {...metaData} />

				<Style rules={{
					...codeMirrorStyles(this.props.loginData),
					...codeMirrorStyleClasses
				}} />

				{/*	'Not Authorized' or 'Error' Note */}
				{this.props.editorData.get('error')
					? <div style={styles.errorTitle}>{this.props.editorData.getIn(['pubEditData', 'title'])}</div>
					: <div>
						
						{/*	Component for all modals and their backdrop. */}
						<EditorModals publishVersionHandler={this.publishVersion} />

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
							tocH1={this.state.tocH1}
							insertFormattingHandler={this.insertFormatting}/>

						{/* ---------------------- */}
						{/* Markdown Editing Block */}
						{/* ---------------------- */}
						<div id="editor-text-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorMarkdown, styles[viewMode].editorMarkdown]}>

							<EditorPluginPopup ref="pluginPopup" references={this.state.firepadData.references} assets={this.state.firepadData.assets} /* selections={this.state.firepadData.selections} */ activeFocus={this.state.activeFocus} codeMirrorChange={this.state.codeMirrorChange}/>

							{/* Insertion point for codemirror and firepad */}
							<div style={[this.state.activeFocus !== '' && styles.hiddenMainEditor]}>
								<div id="codemirror-wrapper"></div>
							</div>

							{/* Insertion point for Focused codemirror subset */}
							<div id="codemirror-focus-wrapper"></div>

						</div>

						{/* ------------------ */}
						{/* Live Preview Block */}
						{/* ------------------ */}
						<div id="editor-live-preview-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorPreview, styles[viewMode].editorPreview]} className={'editorPreview'}>

							{this.renderNav(false)}

							<div className="editorBodyView" style={[styles.previewBlockWrapper, styles.previewBlockWrapperShow]}>
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
									isFeatured={true} />
							</div>
						</div>

						{/* ----------------- */}
						{/* Discussions Block */}
						{/* ----------------- */}
						<div id="editor-discussions-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorDiscussions, styles[viewMode].editorDiscussions]}>

							<div style={[styles.previewBlockWrapper, styles.previewBlockWrapperShow]}>
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
