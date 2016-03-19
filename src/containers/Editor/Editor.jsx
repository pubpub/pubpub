/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {Discussions, EditorModals} from '../';
import {LoaderDeterminate, EditorPluginPopup, EditorTopNav, EditorBottomNav, EditorStylePane, PubBody, Menu} from '../../components';
import {clearPub} from '../../actions/pub';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, addSelection, setEditorViewMode, publishVersion, updatePubBackendData, saveStyle} from '../../actions/editor';

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
import {Iterable} from 'immutable';
import EditorWidgets from '../../components/EditorWidgets/EditorWidgets';

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
			stylePaneActive: false,
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

		if (this.props.editorData.get('styleScoped') !== nextProps.editorData.get('styleScoped')) {
			const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/settings' );
			ref.update({styleScoped: nextProps.editorData.get('styleScoped')});
		}

	},

	componentWillUnmount() {
		debounce('backendSync', this.updatePubBackendData, 0, true)();
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
				const name = (this.props.loginData.get('loggedIn') === false) ? 'cat' : this.props.loginData.getIn(['userData', 'name']);

				// Initialize Firepad using codemirror and the ref defined above.
				const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
					userId: username,
					defaultText: editorDefaultText(this.props.pubData.getIn(['createPubData', 'title']), {username: username, name: name})
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
					document.getElementsByClassName('menuItem-activeCollabs')[0], username, this.props.loginData.getIn(['userData', 'name']), this.props.loginData.getIn(['userData', 'thumbnail']));

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
		// this.refs.pluginPopup.showAtPos(cords.left - 15, cords.top + 5);
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
		if (this.state) {
			const newPubData = {
				title: this.state.title ? this.state.title : this.props.slug,
				abstract: this.state.abstract,
			};
			this.props.dispatch(updatePubBackendData(this.props.slug, newPubData));
		}
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
		const markdown = fullMD.replace(/\[\[title:.*?\]\]/gi, '').replace(/\[\[abstract:.*?\]\]/gi, '').replace(/\[\[authorsNote:.*?\]\]/gi, '').trim();

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

			styleRawDesktop: this.state.firepadData.settings.styleRawDesktop,
			styleRawMobile: this.state.firepadData.settings.styleRawMobile,
			styleScoped: this.state.firepadData.settings.styleScoped,

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

	toggleStyleMode: function() {
		this.closeModalHandler();
		if (this.props.editorData.get('viewMode') === 'edit') {
			this.props.dispatch(toggleEditorViewMode());
			this.setState({stylePaneActive: true});
		} else {
			this.setState({stylePaneActive: !this.state.stylePaneActive});
		}

	},
	saveStyle: function(newStyleStringDesktop, newStyleStringMobile) {
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData/settings' );
		ref.update({
			styleRawDesktop: newStyleStringDesktop,
			styleRawMobile: newStyleStringMobile,
		});
		this.props.dispatch(saveStyle(newStyleStringDesktop, newStyleStringMobile));
	},
	getEditorFont: function() {
		const editorFont = this.props.loginData ? this.props.loginData.getIn(['userData', 'settings', 'editorFont']) : undefined;

		switch (editorFont) {
		case 'serif':
			console.log('in the switch and got serif');
			return {fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif'};
		case 'sans-serif':
			console.log('in the switch and got sans');
			return {fontFamily: 'Lato'};
		case 'mono':
			console.log('in the switch and got mono');
			return {fontFamily: 'Courier'};
		default:
			console.log('in the switch and got def');
			return {fontFamily: 'Courier'};
		}

	},

	printIt: function(name) {
		return ()=>{
			console.log('clicked ', name);
		};
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const isReader = this.props.editorData.getIn(['pubEditData', 'isReader']);
		// const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		// const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const darkMode = this.props.loginData.getIn(['userData', 'settings', 'editorColor']) === 'dark';

		const isLivePreview = (Iterable.isIterable(this.props.editorData)) ? (this.props.editorData.get('viewMode') === 'preview') : false;



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

		const editorMenuItems = [
			{
				key: 'file',
				string: 'File',
				function: ()=>{},
				children: [
					{
						key: 'style',
						string: 'Style',
						function: this.toggleStyleMode,
					},
					{
						key: 'Settings',
						string: 'Editor Settings',
						function: this.openModalHandler('Style'),
					}
				]
			},
			{
				key: 'view',
				string: 'View',
				function: this.printIt('style!'),
				children: [
					{
						key: '1',
						string: 'Markdown',
						function: this.printIt('assets2!'),
					},
					{
						key: '2',
						string: 'Markdown and Live Preview',
						function: this.printIt('assets2!'),
					},
					{
						key: 'Markdomments',
						string: 'Markdown and Comments',
						function: this.printIt('collabs2!'),
					},
					{
						key: 'things2',
						string: 'Live Preview and Comments',
						function: this.printIt('things2!'),
					},
				]
			},
			{
				key: 'formatting',
				string: 'Formatting',
				function: ()=>{},
				children: [
					{
						key: 'assets2',
						string: 'header #',
						function: this.printIt('assets2!'),
					},
					{
						key: 'bold',
						string: 'bold',
						function: this.printIt('things2!'),
					},
					{
						key: 'italic',
						string: 'italic',
						function: this.printIt('collabs2!'),
					},
					{
						key: 'assetsasd2',
						string: 'header #',
						function: this.printIt('assets2!'),
					},
					{
						key: 'bodasdld',
						string: 'bold',
						function: this.printIt('things2!'),
					},
					{
						key: 'italdsadasic',
						string: 'italic',
						function: this.printIt('collabs2!'),
					}
				]
			},
			{
				key: 'assets',
				string: 'Assets',
				function: this.openModalHandler('Assets'),
			},
			{
				key: 'collaborators',
				string: 'Collaborators',
				function: this.openModalHandler('Collaborators'),
			},
			{
				key: 'activeCollabs',
				string: '',
				function: ()=>{},
				notButton: true,
			},
			{
				key: 'publish',
				string: 'Publish',
				right: true,
				function: this.openModalHandler('Publish'),
			},
			{
				key: 'preview',
				string: 'Preview',
				right: true,
				function: this.toggleLivePreview,
			},
			{
				key: 'saveStatus',
				string: (()=>{
					switch (this.state.editorSaveStatus) {
					case 'saved':
						return <FormattedMessage id="editor.pubSaved" defaultMessage="Pub Saved"/>;
					case 'saving':
						return <FormattedMessage id="editor.pubSaving" defaultMessage="Pub Saving..."/>;
					default:
						return <FormattedMessage id="editor.disconnected" defaultMessage="Disconnected"/>;
					}
					// this.state.editorSaveStatus === 'saved' ? 'Pub Saved' : 'Pub Saving...'}
				})(),
				function: ()=>{},
				right: true,
				notButton: true,
			},
		];

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

						{/* Editor Menu */}
						<div id="editor-menu-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorMenuWrapper]}>
							<Menu items={editorMenuItems}/>
						</div>

						{/*	Horizontal loader line - Separates menu bar from rest of editor page */}
						<div style={styles.editorLoadBar}>
							<LoaderDeterminate value={loadStatus === 'loading' ? 0 : 100}/>
						</div>

						{/* ---------------------- */}
						{/* Markdown Editing Block */}
						{/* ---------------------- */}
						<div id="editor-text-wrapper" style={[globalStyles.hiddenUntilLoad, globalStyles[loadStatus], styles.editorMarkdown, styles[viewMode].editorMarkdown, !isReader && styles[viewMode].editorMarkdownIsEditor]}>


							{(this.state.firepadInitialized) ? <EditorWidgets ref="widgethandler" isLivePreview={isLivePreview} references={this.state.firepadData.references} assets={this.state.firepadData.assets} activeFocus={this.state.activeFocus} cm={this.cm} /> : null}
							{/*
							<EditorPluginPopup ref="pluginPopup" isLivePreview={isLivePreview} references={this.state.firepadData.references} assets={this.state.firepadData.assets} activeFocus={this.state.activeFocus} codeMirrorChange={this.state.codeMirrorChange}/>
							*/}

							{/* <div style={[styles.editorHeader]}>
								<input type="text" defaultValue="My Title" style={[styles.headerTitleInput, this.getEditorFont()]} />
							</div> */}

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

							{/* <div className={'editorPreviewNav'} style={styles.bodyNavBar}>
								<div key={'previewBodyNav0'} style={[styles.bodyNavItem, viewMode === 'read' && globalStyles.hidden, styles.undoHiddenInMobile]} onClick={this.switchPreviewPaneMode('comments')}>
									Editor Comments
								</div>
								<div style={[styles.bodyNavSeparator, viewMode === 'read' && globalStyles.hidden]}>|</div>
								<div key={'previewBodyNav1'} style={[styles.bodyNavItem, styles.bodyNavItemHiddenMobile, viewMode === 'read' && globalStyles.hidden]} onClick={this.switchPreviewPaneMode('discussions')}>
									<FormattedMessage {...globalMessages.PublicDiscussion} />
								</div>

								<div style={[styles.bodyNavSeparator, styles.bodyNavItemHiddenMobile, viewMode === 'read' && globalStyles.hidden]}>|</div>
								<div key={'previewBodyNav4'} style={[styles.bodyNavItem, styles.bodyNavItemHiddenMobile, viewMode === 'read' && globalStyles.hidden]} onClick={this.toggleStyleMode}>
									Style
								</div>

							</div> */}

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
										minFont={13}
										maxFont={25}
										markdown={this.state.markdown}
										authors={this.getAuthorsArray()}
										showPubHighlights={this.state.previewPaneMode === 'discussions'}
										showPubHighlightsComments={this.state.previewPaneMode === 'comments' || viewMode === 'read'}
										addSelectionHandler={this.addSelection}
										style={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubStyle : undefined}
										styleScoped={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.styleScoped : undefined}
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

								<div style={[styles.readModeNav, !isReader && styles.readModeNavShow]}>
									<div key={'previewBodyNav2'} style={[styles.readModeButton]} onClick={this.toggleReadMode}>
										{viewMode === 'read'
											? '(Switch to Edit Mode)'
											: '(Switch to Read-Only Mode)'
										}
									</div>
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

						{/* ---------------------- */}
						{/*   Style Editing Block  */}
						{/* ---------------------- */}
						<div id="style-editor-wrapper" style={[styles.styleEditor, viewMode === 'preview' && this.state.stylePaneActive && styles.styleEditorShow]}>

							<EditorStylePane
								toggleStyleMode={this.toggleStyleMode}
								saveStyleHandler={this.saveStyle}
								saveStyleError={this.props.editorData.get('styleError')}
								defaultDesktop={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.styleRawDesktop : undefined}
								defaultMobile={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.styleRawMobile : undefined} />

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
	editorMenuWrapper: {
		backgroundColor: '#F0F0F0',
		// fontWeight: '300',
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
	styleEditor: {
		opacity: '0',
		pointerEvents: 'none',
		transition: '.1s linear opacity',


		backgroundColor: globalStyles.sideBackground,
		width: '50%',
		height: 'calc(100vh - 60px)',
		position: 'fixed',
		zIndex: 11,
		left: 0,
		top: '61px',
		overflow: 'hidden',
	},
	styleEditorShow: {
		opacity: '1',
		pointerEvents: 'auto',
		overflowY: 'scroll',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			overflow: 'hidden',
		},
	},

	readModeButton: {
		padding: '10px 0px',
		cursor: 'pointer',
		color: '#888',
		userSelect: 'none',
		':hover': {
			color: 'black',
		},
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
		width: 'calc(100% - 0px)',
		height: 'calc(100% - 0px)',
		padding: '0px',
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
		margin: '0px 0px',
		width: '50vw',
		zIndex: 5,

		position: 'fixed',
		height: 'calc(100vh - 60px)',
		overflow: 'hidden',
		overflowY: 'scroll',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			overflow: 'hidden',
		}
	},
	// editorHeader: {
	// 	padding: '0px 25px',
	// },
	// headerTitleInput: {
	// 	height: '50px',
	// 	width: '100%',
	// 	borderWidth: '0px 0px 1px 0px',
	// 	borderColor: 'rgba(0,0,0,0.2)',
	// 	backgroundColor: 'transparent',
	// 	fontSize: '33px',
	// 	fontWeight: 'bold',
	// 	marginBottom: '10px',
	// 	outline: 'none',
	// },
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
			// transform: 'translateX(0%)',
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
			padding: '0px 25vw',
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
			padding: '0px 0px',
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
