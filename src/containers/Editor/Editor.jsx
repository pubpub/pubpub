/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';
import DocumentMeta from 'react-document-meta';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {LoaderDeterminate, EditorPluginPopup, EditorModals} from '../../components';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, publishVersion, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {saveSettingsUser} from '../../actions/login';
import {loadCss} from '../../utils/loadingFunctions';

import initCodeMirrorMode from './editorCodeMirrorMode';
import {styles, codeMirrorStyles, animateListItemStyle} from './editorStyles';
import {insertText, createFocusDoc} from './editorCodeFunctions';
import editorDefaultText from './editorDefaultText';

import markLib from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
markLib.setExtensions(markdownExtensions);

const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
	autofocus: true,
	mode: 'pubpubmarkdown',
	extraKeys: {'Ctrl-Space': 'autocomplete'}
};

const Editor = React.createClass({
	propTypes: {
		editorData: PropTypes.object,
		loginData: PropTypes.object, // User login data
		slug: PropTypes.string, // equal to project uniqueTitle
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin, ReactFireMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			return dispatch(getPubEdit(routeParams.slug));
		}
	},

	getInitialState() {
		return {
			tree: '',
			travisTOC: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
			activeFocus: '',
			firepadData: {},
			codeMirrorChange: {},
		};
	},

	componentDidMount() {

		if (! this.props.editorData.get('error')) {
			loadCss('/css/codemirror.css');
			initCodeMirrorMode();

			// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
			const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData' );
			this.bindAsObject(ref, 'firepadData');

			// Load Firebase ref that is used for firepad
			const firepadRef = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/firepad');

			// Load codemirror
			const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions);

			// Get Login username for firepad use. Shouldn't be undefined, but set default in case.
			const username = (this.props.loginData.get('loggedIn') === false) ? 'cat' : this.props.loginData.getIn(['userData', 'username']);

			// Initialize Firepad using codemirror and the ref defined above.
			Firepad.fromCodeMirror(firepadRef, codeMirror, {
				userId: username,
				defaultText: editorDefaultText
			});

			// need to unmount on change
			codeMirror.on('change', this.onEditorChange);

		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.editorData.get('publishSuccess')) {
			this.props.dispatch(pushState(null, ('/pub/' + nextProps.slug)));
		}
	},

	componentWillUnmount() {
		this.props.dispatch(closeModal());
		this.props.dispatch(unmountEditor());
	},

	getActiveCodemirrorInstance: function() {
		const cm = this.state.activeFocus === ''
				? document.getElementsByClassName('CodeMirror')[0].CodeMirror
				: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;

		return cm;
	},

	onEditorChange: function(cm, change) {

		CodeMirror.commands.autocomplete(cm, CodeMirror.hint.plugins, {completeSingle: false});

		const mdOutput = markLib(cm.getValue(), Object.values(this.state.firepadData.assets || {}));
		this.setState({
			tree: mdOutput.tree,
			travisTOC: mdOutput.travisTOC,
			codeMirrorChange: change
		});
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

		const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
		const fullMD = cm.getValue();

		const titleRE = /\[title:(.*?)\]/i;
		const title = fullMD.match(titleRE)[1].trim();

		const abstractRE = /\[abstract:(.*?)\]/i;
		const abstract = fullMD.match(abstractRE)[1].trim();

		const authorsNoteRE = /\[authorsNote:(.*?)\]/i;
		const authorsNote = fullMD.match(authorsNoteRE)[1].trim();

		const newVersion = {
			slug: this.props.slug,
			title: title,
			abstract: abstract,
			// authors: [],
			assets: [],
			authorsNote: authorsNote,
			style: {},
			markdown: fullMD.replace(/\[title:.*?\]/g, '').replace(/\[abstract:.*?\]/g, '').replace(/\[authorsNote:.*?\]/g, '').trim(),
			status: versionState,
			publishNote: versionDescription,
		};
		// console.log(newVersion);
		this.props.dispatch(publishVersion(newVersion));
		// Aggregate all the firepad data, push it up through a dispatch, redirect on willreceiveprops
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
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/assets' );
		ref.push(asset);
	},

	deleteAsset: function(assetID) {
		return ()=>{
			const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/assets/' + assetID );
			ref.remove();
		};
	},

	saveUpdatedCollaborators: function(newCollaborators, removedUser) {
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/collaborators' );
		ref.set(newCollaborators);
		this.props.dispatch(saveCollaboratorsToPub(newCollaborators, removedUser, this.props.slug));
	},

	saveUpdatedSettingsUser: function(newSettings) {
		this.props.dispatch(saveSettingsUser(newSettings));
	},

	saveUpdatedSettingsFirebase: function(newSettings) {
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/settings' );
		ref.update(newSettings);
	},

	saveUpdatedSettingsFirebaseAndPubPub: function(newSettings) {
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/settings' );
		ref.update(newSettings);
		this.props.dispatch(saveSettingsPubPub(this.props.slug, newSettings));
	},

	saveReferences: function(newReferences) {
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/editorData/references' );
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
			const currentSelection = cm.getSelection();
			const baseText = currentSelection !== '' ? currentSelection : 'example';
			insertText(cm, formatting, baseText);
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

		return (
			<div style={[styles.editorContainer, darkMode && styles.editorContainerDark]}>

				<DocumentMeta {...metaData} />

				<Style rules={codeMirrorStyles(this.props.loginData)} />

				{/*	Mobile Editing not currently supported.
					Display a splash screen if media queries determine mobile mode */}
				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile</h1>
					<div style={styles.mobileImageWrapper}>
						<img style={styles.mobileImage} src={'http://res.cloudinary.com/pubpub/image/upload/v1448221655/pubSad_blirpk.png'} />
					</div>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					{/*	'Not Authorized' or 'Error' Note */}
					{this.props.editorData.get('error')
						? <div style={styles.errorTitle}>{this.props.editorData.getIn(['pubEditData', 'title'])}</div>
						: null
					}

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

					{/*	Top Nav. Fixed to the top of the editor page, just below the main pubpub bar */}
					<div style={[styles.editorTopNav, styles.hiddenUntilLoad, styles[editorData.get('status')], darkMode && styles.editorTopNavDark]}>
						<ul style={styles.editorNav}>

							<li key="editorNav0"style={[styles.editorNavItem]} onClick={this.openModalHandler('Assets')}>Assets</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav1"style={[styles.editorNavItem]} onClick={this.openModalHandler('References')}>References</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav2"style={[styles.editorNavItem]} onClick={this.openModalHandler('Collaborators')}>Collaborators</li>

							<li key="editorNav3"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.openModalHandler('Publish')}>Publish</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav4"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.toggleLivePreview}>Live Preview</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.openModalHandler('Style')}>Settings</li>

						</ul>
					</div>

					{/*	Horizontal loader line - Separates top bar from rest of editor page */}
					<div style={styles.editorLoadBar}>
						<LoaderDeterminate value={loadStatus === 'loading' ? 0 : 100}/>
					</div>

					{/* Bottom Nav */}
					<div style={[styles.common.editorBottomNav, styles[viewMode].editorBottomNav, styles.hiddenUntilLoad, styles[loadStatus]]}>

						{/* Background header bar that's used in livePreview mode. Provides opaque background. */}
						<div style={[styles.common.bottomNavBackground, styles[viewMode].bottomNavBackground, darkMode && styles.common.bottomNavBackgroundDark]}></div>

						<div className="leftBottomNav" style={[styles.common.bottomNavLeft, styles[viewMode].bottomNavLeft]}>

							{/* Table of Contents Title */}
							<div key="bNav_toc" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, showBottomLeftMenu && styles[viewMode].listTitleActive]} onClick={this.toggleTOC}>Table of Contents</div>
							<div key="showAllTOCButton" style={[styles.showAll, this.state.activeFocus !== '' && styles.showAllVisible]} onClick={this.focusEditor(this.state.activeFocus, 0)}>- show all -</div>

							{/* Table of Contents line separator */}
							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge]}></div>
							</div>

							{/* Table of Contents list */}
							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, showBottomLeftMenu && styles[viewMode].listActive]}>
								{()=>{
									// const options = ['Introduction', 'Prior Art', 'Resources', 'Methods', 'A New Approach', 'Data Analysis', 'Results', 'Conclusion'];
									const options = this.state.travisTOC;
									return options.map((item, index)=>{
										return <li key={'blNav' + index} onClick={this.focusEditor(item.title, index)} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItemStyle('left', loadStatus, index), showBottomLeftMenu && styles[viewMode].listItemActive, this.state.activeFocus === item.title && styles.common.listItemActiveFocus]}>{item.title}</li>;
									});
								}()}
							</ul>
						</div>

						<div className="rightBottomNav" style={[styles.common.bottomNavRight, styles[viewMode].bottomNavRight]}>

							{/* Formatting Title */}
							<div key="bNav_format" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, styles.alignRight, showBottomRightMenu && styles[viewMode].listTitleActive]} onClick={this.toggleFormatting}>Formatting</div>

							{/* Formatting line separator */}
							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall, styles.floatRight, styles.common.bottomNavDividerRight]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge, styles.floatRight, styles.common.bottomNavDividerLargeRight]}></div>
							</div>

							{/* Formatting list */}
							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, styles[viewMode].bottomNavListRight, styles.alignRight, showBottomRightMenu && styles[viewMode].listActive]}>
								{()=>{
									const options = ['H1', 'H2', 'H3', 'Bold', 'Italic', '# List', '- List', 'Image', 'Video', 'Audio', 'Gallery', 'Hologram'];
									return options.map((item, index)=>{
										return <li key={'brNav' + index} onClick={this.insertFormatting(item)} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItemStyle('right', loadStatus, index), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>{item}</li>;
									});
								}()}
							</ul>
						</div>
					</div>

					{/* Markdown Editing Block */}
					<div id="editor-text-wrapper" style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>

						<EditorPluginPopup activeFocus={this.state.activeFocus} codeMirrorChange={this.state.codeMirrorChange}/>

						{/* Insertion point for codemirror and firepad */}
						<div style={[this.state.activeFocus !== '' && styles.hiddenMainEditor]}>
							<div id="codemirror-wrapper"></div>
						</div>

						{/* Insertion point for Focused codemirror subset */}
						<div id="codemirror-focus-wrapper"></div>

					</div>

					{/* Live Preview Block */}
					<div style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorPreview, styles[viewMode].editorPreview]}>
						{this.state.tree}
					</div>

				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		editorData: state.editor,
		slug: state.router.params.slug,
		loginData: state.login
	};
})( Radium(Editor) );
