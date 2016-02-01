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
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, addSelection, setEditorViewMode, publishVersion, updatePubBackendData} from '../../actions/editor';

import {debounce} from '../../utils/loadingFunctions';
import {submitPubToJournal} from '../../actions/journal';

import initCodeMirrorMode from './editorCodeMirrorMode';
// import {styles} from './editorStyles';
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
let styles;

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
			firepadInitialized: false,
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
			previewPaneMode: undefined,
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
					
					debounce('saveStatusSync', ()=> {
						this.updateSaveStatus(synced);
					}, 250)();
				});

				firepad.on('ready', ()=>{
					this.setState({firepadInitialized: true});
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

	updatePubBackendData: function() {
		const newPubData = {
			title: this.state.title,
			abstract: this.state.abstract,
		};
		this.props.dispatch(updatePubBackendData(this.props.slug, newPubData));
	},

	onEditorChange: function(cm, change) {

		CodeMirror.commands.autocomplete(cm, CodeMirror.hint.plugins, {completeSingle: false});

		if (cm.state.completionActive && cm.state.completionActive.data) {
			const completion = cm.state.completionActive.data;
			CodeMirror.on(completion, 'pick', this.showPopupFromAutocomplete);
		}

		// const start = performance.now();

		const fullMD = cm.getValue();

		// Grab title, abstract, and authorsNote
		const titleMatch = fullMD.match(/\[\[title:(.*?)\]\]/i);
		const title = titleMatch && titleMatch.length ? titleMatch[1].trim() : '';
		const abstractMatch = fullMD.match(/\[\[abstract:(.*?)\]\]/i);
		const abstract = abstractMatch && abstractMatch.length ? abstractMatch[1].trim() : '';
		const authorsNoteMatch = fullMD.match(/\[\[authorsNote:(.*?)\]\]/i);
		const authorsNote = authorsNoteMatch && authorsNoteMatch.length ? authorsNoteMatch[1].trim() : '';

		// Generate TOC
		const TOCs = generateTOC(fullMD);		

		// Format assets and references
		const assets = convertFirebaseToObject(this.state.firepadData.assets);
		const references = convertFirebaseToObject(this.state.firepadData.references, true);
		const selections = [];

		// Strip markdown of title, abstract, authorsNote
		const markdown = fullMD.replace(/\[\[title:.*?\]\]/g, '').replace(/\[\[abstract:.*?\]\]/g, '').replace(/\[\[authorsNote:.*?\]\]/g, '').trim();
		
		// const compiledMarkdown = performance.now();

		if (this.state.title !== title || this.state.abstract !== abstract) {
			debounce('backendSync', this.updatePubBackendData, 2000)();
		}
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

		// const saveState = performance.now();
		// console.log('saveState', saveState - start, saveState - compiledMarkdown);
		// console.log('total', saveState - start);

	},

	toggleLivePreview: function() {
		this.closeModalHandler();
		return this.props.dispatch(toggleEditorViewMode());
	},

	toggleReadMode: function() {
		if (this.props.editorData.get('viewMode') === 'read') {
			this.props.dispatch(setEditorViewMode('preview'));	
		} else {
			this.props.dispatch(setEditorViewMode('read'));	
		}
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

	switchPreviewPaneMode: function(mode) {
		return ()=>{
			if (mode === this.state.previewPaneMode) {
				this.setState({previewPaneMode: undefined});
			} else {
				this.setState({previewPaneMode: mode});	
			}
		};
	},

	addSelection: function(newSelection) {
		newSelection.pub = this.props.editorData.getIn(['pubEditData', '_id']);
		newSelection.version = 0;
		this.props.dispatch(addSelection(newSelection));
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const isReader = this.props.editorData.getIn(['pubEditData', 'isReader']);
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
			title: 'Edit - ' + this.props.editorData.getIn(['pubEditData', 'title'])
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
							toggleLivePreviewHandler={this.toggleLivePreview}
							viewMode={viewMode} />

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
						<div id="editor-text-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorMarkdown, styles[viewMode].editorMarkdown, !isReader && styles[viewMode].editorMarkdownIsEditor]}>

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

							<div className={'editorPreviewNav'} style={styles.bodyNavBar}>
								<div key={'previewBodyNav0'} style={[styles.bodyNavItem, viewMode === 'read' && globalStyles.hidden, styles.undoHiddenInMobile]} onClick={this.switchPreviewPaneMode('comments')}>
									Editor Comments
								</div>
								<div style={[styles.bodyNavSeparator, viewMode === 'read' && globalStyles.hidden]}>|</div>
								<div key={'previewBodyNav1'} style={[styles.bodyNavItem, styles.bodyNavItemHiddenMobile, viewMode === 'read' && globalStyles.hidden]} onClick={this.switchPreviewPaneMode('discussions')}>
									<FormattedMessage {...globalMessages.PublicDiscussion} />
								</div>

								<div style={[styles.readModeNav, !isReader && styles.readModeNavShow]}>
									<div style={[styles.bodyNavSeparator, viewMode === 'read' && globalStyles.hidden]}>|</div>
									<div key={'previewBodyNav2'} style={[styles.bodyNavItem]} onClick={this.toggleReadMode}>
										{viewMode === 'read'
											? 'Edit Mode'
											: 'Read Mode'
										}
									</div>
								</div>
								
							</div>

							<div className="editorBodyView pubScrollContainer" style={[styles.previewBlockWrapper, styles.previewBlockWrapperShow]}>

								<span style={[styles.editorDisabledMessage, viewMode !== 'read' && styles.editorDisabledMessageVisible]}>
									<FormattedMessage id="editingDisableMobile" defaultMessage="Editing disabled on mobile view. You can still read and comment. Open on a laptop or desktop to edit." />
								</span>

								<div style={{position: 'relative'}}>
									<div id="editor-close-bar" style={[this.state.previewPaneMode && styles.editorCloseBar]} onClick={this.switchPreviewPaneMode(undefined)}></div>
									<PubBody
										status={'loaded'}
										title={this.state.title}
										abstract={this.state.abstract}
										authorsNote={this.state.authorsNote}
										minFont={15}
										htmlTree={this.state.tree}
										markdown={this.state.markdown}
										authors={this.getAuthorsArray()}
										showPubHighlights={this.state.previewPaneMode === 'discussions'}
										showPubHighlightsComments={this.state.previewPaneMode === 'comments' || viewMode === 'read'}
										addSelectionHandler={this.addSelection}
										style={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubStyle : undefined}
										assetsObject={this.state.assetsObject}
										referencesObject={this.state.referencesObject}
										selectionsArray={this.state.selectionsArray}

										references={referencesList}
										isFeatured={true} />
								</div>
								
							</div>
						</div>

						{/* ----------------- */}
						{/* Discussions Block */}
						{/* ----------------- */}
						<div id="editor-discussions-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorDiscussions, viewMode === 'read' && styles[viewMode].editorDiscussionsMobile, this.state.previewPaneMode && styles[viewMode].editorDiscussions]}>

							<div key="editorDiscussions" style={styles.menuClose} onClick={this.switchPreviewPaneMode(undefined)}>
								<FormattedMessage {...globalMessages.close} />
							</div>

							<div className="commentsRightBar" style={[styles.previewBlockWrapper, (this.state.previewPaneMode === 'comments' || viewMode === 'read') && styles.previewBlockWrapperShow]}>
								<div style={styles.previewBlockHeader}>
									<FormattedMessage {...globalMessages.EditorComments} />
								</div>

								<div style={styles.previewBlockText}>
									<div><FormattedMessage {...globalMessages.editorCommentsText0} /></div>
									<div><FormattedMessage {...globalMessages.editorCommentsText1} /></div>
								</div>

								{this.state.firepadInitialized
									? <Discussions editorCommentMode={true} inEditor={true} instanceName={'editorComments'}/>
									: null
								}
								
							</div>

							<div className="rightBar" style={[styles.previewBlockWrapper, this.state.previewPaneMode === 'discussions' && styles.previewBlockWrapperShow]}>

								<div style={styles.previewBlockHeader}>
									<FormattedMessage {...globalMessages.PublicDiscussion} />
								</div>
								<div style={styles.previewBlockText}>
									<FormattedMessage id="editorDiscussionMessage" defaultMessage="This section shows the discussion from the public, published version of your pub."/>
								</div>
								
								{this.state.firepadInitialized
									? <Discussions editorCommentMode={false} inEditor={true} instanceName={'editorDiscussions'}/>
									: null
								}
							</div>

						</div>

						{/* This bit is only for mobile. Adds a second close bar overlay to cover the top of the menu */}
						<div id="editor-mobile-close-bar" style={[this.state.previewPaneMode && styles.editorMobileCloseBar]} onClick={this.switchPreviewPaneMode(undefined)}></div>

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

styles = {
	editorContainer: {
		position: 'relative',
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
		backgroundColor: globalStyles.sideBackground,
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
		},
	},
	editorContainerDark: {
		backgroundColor: '#272727',

	},
	errorTitle: {
		textAlign: 'center',
		fontSize: '45px',
		padding: 40,
	},

	editorLoadBar: {
		position: 'fixed',
		top: 60,
		width: '100%',
		zIndex: 10,
	},
	hiddenMainEditor: {
		height: 0,
		overflow: 'hidden',
		pointerEvents: 'none',
	},

	bodyNavBar: {
		width: '100%',
		height: '29px',
		color: 'white',
		borderBottom: '1px solid #CCC',
		marginBottom: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 1px)',
		},
	},
	bodyNavItem: {
		
		float: 'right',
		padding: '0px 10px',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		cursor: 'pointer',
		color: '#888',
		userSelect: 'none',
		':hover': {
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '20px',
		},
	},
	bodyNavItemHiddenMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	bodyNavSeparator: {
		float: 'right',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		userSelect: 'none',
		padding: '0px 2px',
		color: '#888',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '20px',
		},
	},
	undoHiddenInMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	mobileOnlySeparator: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	bodyNavDiscussionBlock: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	readModeNav: {
		display: 'none',
	},
	readModeNavShow: {
		display: 'block',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	previewBlockWrapper: {
		width: 'calc(100% - 20px)',
		height: 'calc(100% - 50px)',
		padding: '10px',
		overflow: 'hidden',
		overflowY: 'scroll',
		position: 'absolute',
		opacity: '0',
		pointerEvents: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(100% - 20px)',
		},
	},
	previewBlockWrapperShow: {
		opacity: '1',
		pointerEvents: 'auto',
	},
	previewBlockHeader: {
		fontSize: '30px',
		margin: '10px 0px',
	},
	previewBlockText: {
		fontSize: '15px',
		margin: '5px 0px 35px 0px',
	},
	editorDisabledMessage: {
		width: '90%',
		backgroundColor: '#373737',
		display: 'none',
		margin: '0 auto',
		color: 'white',
		textAlign: 'center',
		padding: '5px',
	},

	editorDisabledMessageVisible: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},

	menuClose: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			textAlign: 'right',
			fontSize: '1.5em',
			width: 'calc(100% - 100px)',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			padding: '20px 20px',
			margin: '0px 0px 0px 60px',
			fontFamily: globalStyles.headerFont,
			color: '#666',
			':hover': {
				cursor: 'pointer',
				color: 'black',
			},
		},
	},

	editorMarkdown: {
		margin: '30px 0px',
		width: '50vw',
		zIndex: 5,

		position: 'fixed',
		height: 'calc(100vh - 60px - 2*' + globalStyles.headerHeight + ')',
		overflow: 'hidden',
		overflowY: 'scroll',
	},
	editorPreview: {
		width: 'calc(50% - 0px)',
		backgroundColor: '#fff',
		boxShadow: 'rgba(0,0,0,0.25) 0px 3px 9px 1px',
		position: 'fixed',
		right: 0,
		top: 61,
		height: 'calc(100vh - 61px)',
		overflow: 'hidden',
		zIndex: 20,
		padding: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			transform: 'translateX(0%)',
		},
	},
	editorDiscussions: {
		width: 'calc(35% - 0px)',
		position: 'fixed',
		right: 0,
		transition: '.252s ease-in-out transform',
		transform: 'translateX(110%)',
		top: 91,
		height: 'calc(100vh - 61px)',
		overflow: 'hidden',
		zIndex: 40,
		padding: 0,
		backgroundColor: 'rgba(245,245,245,0.97)',
		boxShadow: '-2px -1px 3px -2px rgba(0,0,0,0.7)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '90%',
			top: '0px',
			height: '100vh',
			zIndex: 56,
		},
	},

	editorCloseBar: {
		zIndex: 50,
		position: 'absolute',
		display: 'block',
		
		width: '100%',
		top: -10,
		bottom: -10,
		left: -10,
	},
	editorMobileCloseBar: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			zIndex: 55,
			position: 'fixed',
			display: 'block',
			width: '100%',
			height: 120,
			top: 0,
			left: 0,
		}
	},

	edit: {
		editorMarkdown: {
			transition: '.352s linear transform, .3s linear opacity .25s, 0s linear padding .352s, 0s linear left .352s',
			transform: 'translateX(0%)',
			padding: globalStyles.headerHeight + ' 25vw',
			left: 0,
		},
		editorPreview: {
			transition: '.352s linear transform',
			transform: 'translateX(110%)',
			'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
				transform: 'translateX(0%)',
			},
		},
		editorDiscussions: {
			'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
				transform: 'translateX(0%)',
			},
		},

	},

	preview: {
		editorBottomNav: {
			pointerEvents: 'none',
		},
		editorMarkdown: {
			transition: '.352s linear transform, .3s linear opacity .25s',
			transform: 'translateX(-50%)',
			padding: globalStyles.headerHeight + ' 0px',
			left: '25vw'
		},
		editorPreview: {
			transition: '.352s linear transform',
			transform: 'translateX(0%)',
		},
		editorDiscussions: {
			transform: 'translateX(0px)',
		},
		
	},
	read: {
		editorMarkdown: {
			opacity: 0,
			pointerEvents: 0,
			transition: '.352s linear transform, .3s linear opacity .25s',
			transform: 'translateX(-50%)',
			padding: globalStyles.headerHeight + ' 0px',
			left: '25vw'
		},
		editorMarkdownIsEditor: {
			opacity: 1,
		},
		editorPreview: {
			// backgroundColor: 'orange',
			transition: '.352s linear transform',
			transform: 'translateX(calc(-100% - 1px))',
			top: '31px',
			height: 'calc(100vh - 31px)',
			'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
				transform: 'translateX(0%)',
				top: '61px',
				height: 'calc(100vh - 61px)',
			},
		},
		editorDiscussionsMobile: {
			width: 'calc(50%)',
			backgroundColor: globalStyles.sideBackground,
			top: '30px',
			height: 'calc(100vh - 30px + 30px)',
			transform: 'translateX(0px)',
			boxShadow: '-2px -1px 4px -2px rgba(0,0,0,0.0)',
			'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
				transform: 'translateX(110%)',
				width: '90%',
				boxShadow: '-2px -1px 3px -2px rgba(0,0,0,0.7)',
				top: '0px',
				height: '100vh',
			},

		},
		editorDiscussions: {
			width: 'calc(50%)',
			backgroundColor: globalStyles.sideBackground,
			top: '30px',
			height: 'calc(100vh - 30px + 30px)',
			transform: 'translateX(0px)',
			boxShadow: '-2px -1px 4px -2px rgba(0,0,0,0.0)',
			'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
				transform: 'translateX(0%)',
				width: '90%',
				boxShadow: '-2px -1px 3px -2px rgba(0,0,0,0.7)',
				top: '0px',
				height: '100vh',
			},

		},

	},

};
