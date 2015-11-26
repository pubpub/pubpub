/* global Firebase Firepad CodeMirror */
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium, {Style} from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderDeterminate} from '../../components';
import {EditorModalAssets, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalSettings} from '../../components/EditorModals';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal, publishVersion, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {saveSettingsUser} from '../../actions/login';
import ReactFireMixin from 'reactfire';

import {styles} from './EditorStyle';

import markLib from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
markLib.setExtensions(markdownExtensions);

const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
	autofocus: true,
	mode: 'markdown',
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
		};
	},

	// Code for client-side rendering only put in componentDidMount()
	componentDidMount() {
		if (! this.props.editorData.get('error')) {

			// Load Firebase and bind using ReactFireMixin
			// For assets, references, etc.
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
				defaultText: 'Welcome to your new Pub!'
			});

			// need to unmount on change
			codeMirror.on('change', this.onEditorChange);

		}
		

	},
	
	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
		if (nextProps.editorData.get('publishSuccess')) {
			this.props.dispatch(pushState(null, ('/pub/' + nextProps.slug)));
		}
	},

	componentWillUnmount() {
		this.props.dispatch(unmountEditor());
	},

	// onEditorChange: function(cm, change) {
	onEditorChange: function(cm) {
		const mdOutput = markLib(cm.getValue(), this.state.firepadData.assets);
		this.setState({
			tree: mdOutput.tree,
			travisTOC: mdOutput.travisTOC,
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
		const newVersion = {
			slug: this.props.slug,
			title: 'Here\'s our new title!',
			abstract: 'Howdy, this is a brand new abstract!',
			// authors: [],
			assets: [],
			authorsNote: '',
			style: {},
			markdown: cm.getValue(),
			status: versionState,
			publishNote: versionDescription,
		};
		this.props.dispatch(publishVersion(newVersion));
		// Get Markdown
		// Pre-process markdown to turn plugins into verboseFormat
		// Aggregate all the firepad data, push it up through a dispatch, redirect on willreceiveprops
	},

	// CodeMirror styles function can be
	// used to dynamically change font, size, color, etc
	codeMirrorStyles: function() {
		const editorFont = this.props.loginData.getIn(['userData', 'settings', 'editorFont']);
		const editorFontSize = this.props.loginData.getIn(['userData', 'settings', 'editorFontSize']);
		const editorColor = this.props.loginData.getIn(['userData', 'settings', 'editorColor']);
		
		const editorStyles = {};

		switch (editorFont) {
		case 'serif':
			editorStyles.fontFamily = 'Arial';
			break;
		case 'sans-serif':
			editorStyles.fontFamily = 'Lato';
			break;
		case 'mono':
			editorStyles.fontFamily = 'Courier';
			break;
		default:
			editorStyles.fontFamily = 'Courier';
			break;
		}

		switch (editorFontSize) {
		case 'small':
			editorStyles.fontSize = '11px';
			break;
		case 'medium':
			editorStyles.fontSize = '15px';
			break;
		case 'large':
			editorStyles.fontSize = '19px';
			break;
		default:
			editorStyles.fontSize = '15px';
			break;
		}

		switch (editorColor) {
		case 'light':
			editorStyles.color = '#555';
			break;
		case 'dark':
			editorStyles.color = '#ddd';
			break;
		default:
			editorStyles.color = '#555';
			break;
		}

		return {
			'.CodeMirror': {
				backgroundColor: 'transparent',
				fontSize: editorStyles.fontSize,
				color: editorStyles.color,
				fontFamily: editorStyles.fontFamily,
				padding: '0px 20px',
				width: 'calc(100% - 40px)',
				// fontFamily: 'Alegreya',
			}
		};
	},

	// Function to generate side-list fade in animations.
	// Generates unique style per side and per item-depth
	animateListItem: function(side, status, index) {
		const statusOffset = { loaded: 0, loading: 1};
		const offset = { left: -100, right: 100};
		const delay = 0.25 + (index * 0.02);
		return {
			transform: 'translateX(' + statusOffset[status] * offset[side] + 'px)',
			transition: '.3s ease-out transform ' + delay + 's',
		};
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
			const cm = this.state.activeFocus === ''
				? document.getElementsByClassName('CodeMirror')[0].CodeMirror
				: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;


			const currentSelection = cm.getSelection();
			const insertText = currentSelection !== '' ? currentSelection : 'example';

			this.toggleFormatting();

			switch (formatting) {
			case 'H1':
				return cm.replaceSelection('# ' + insertText + '\n');
			case 'H2':
				return cm.replaceSelection('## ' + insertText + '\n');
			case 'H3':
				return cm.replaceSelection('### ' + insertText + '\n');
			case 'Bold':
				return cm.replaceSelection('**' + insertText + '**');
			case 'Italic':
				return cm.replaceSelection('*' + insertText + '*');
			case '# List':
				return cm.replaceSelection('\n 1. ' + insertText + '\n');
			case '- List':
				return cm.replaceSelection('\n -  ' + insertText + '\n');
			case 'Image':
				return cm.replaceSelection('::image::refName::');
			case 'Video':
				return cm.replaceSelection('::video::refName::');
			default:
				return null;
			}


		};
	},

	// focusEditor: function(title, index) {
	focusEditor: function(title) {
		// TODO: use the index variable that's passed in to accomodate the case
		// where a document has more than one identical header title.
		// Right now, no matter which is clicked, the focus will focus on the first instance of it.
		return ()=>{


			// If the focus button clicked is the same as the activeFocus,
			// turn off the focusing
			if (this.state.activeFocus === title) {
				this.setState({ activeFocus: ''});

				// Erase the existing focus CodeMirror
				document.getElementById('codemirror-focus-wrapper').innerHTML = '';

			} else {
				// Get main codemirror doc
				const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;

				// Erase the existing focus CodeMirror
				document.getElementById('codemirror-focus-wrapper').innerHTML = '';

				let startLine = undefined;
				let endLine = undefined;

				// Iterate over all lines in the doc
				cm.eachLine(function(line) {
					// Proceed if either startLine or endLine is undefined
					if (typeof(startLine) === 'undefined' || typeof(endLine) === 'undefined') {

						// If we have a startline, but no endline, check to see if the line is a header
						// We wish to set endline to the first #H1 header after startline
						if (typeof(endLine) === 'undefined' && typeof(startLine) !== 'undefined' && line.stateAfter.header === 1 && line.text !== '') {
							endLine = cm.getLineNumber(line);
						}

						// If we don't yet have a startline, see if the current line matches the format of the selected title
						if (typeof(startLine) === 'undefined' && line.text.indexOf('# ' + title) > -1) {
							startLine = cm.getLineNumber(line);
						}
					}
				});

				// Create new linked doc from startline and endLine
				const newFocus = cm.linkedDoc({
					from: startLine,
					to: endLine,
					sharedHist: true,
				});

				// Create new codemirror inside of the focus-wrapper
				const cmFocus = CodeMirror(document.getElementById('codemirror-focus-wrapper'), cmOptions);

				// Insert the new focus doc
				cmFocus.swapDoc(newFocus);

				// Scroll to top.
				// We had a weird bug where the focus was defaulting to the bottom of the div
				document.getElementById('editor-text-wrapper').scrollTop = 0;

				// Update the activeFocus state
				this.setState({
					activeFocus: title,
				});

				// Hide the TOC if we were in live-preview mode and it was expanded
				this.toggleTOC();
			}

		};
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const activeModal = this.props.editorData.get('activeModal');
		const darkMode = this.props.loginData.getIn(['userData', 'settings', 'editorColor']) === 'dark';

		// Set metadata for the page.
		const metaData = {
			title: 'PubPub - Editing ' + this.props.slug
		};

		return (
			<div style={[styles.editorContainer, darkMode && styles.editorContainerDark]}>

				<DocumentMeta {...metaData} />

				<Style rules={this.codeMirrorStyles()} />

				{/*	Mobile Editing not currently supported.
					Display a splash screen if media queries determine mobile mode */}

				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile :(</h1>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					{/*	Not Authorized or Error Note */}					
					{this.props.editorData.get('error')
						? <div style={styles.errorTitle}>{this.props.editorData.getIn(['pubEditData', 'title'])}</div>
						: null

					}

					{/*	Container for all modals and their backdrop. */}
					<div className="modals">
						<div className="modal-splash" onClick={this.closeModalHandler} style={[styles.modalSplash, this.props.editorData.get('activeModal') !== undefined && styles.modalSplashActive]}></div>
						<div id="modal-container" className="modal-container" style={[styles.modalContainer, activeModal !== undefined && styles.modalContainerActive]}>
							{/*	Switch which modal is displayed based on the activeModal parameter */}
							{(() => {
								switch (activeModal) {
								case 'Assets':
									return (<EditorModalAssets assetData={this.state.firepadData.assets} slug={this.props.slug} addAsset={this.addAsset}/>);
								case 'Collaborators':
									return (<EditorModalCollaborators collaboratorData={this.state.firepadData.collaborators} updateCollaborators={this.saveUpdatedCollaborators}/>);
								case 'Publish':
									return (<EditorModalPublish handlePublish={this.publishVersion}/>);
								case 'References':
									return (<EditorModalReferences
										referenceData={this.state.firepadData.references}
										updateReferences={this.saveReferences}
										referenceStyle={this.state.firepadData.settings.pubReferenceStyle}/>);
								case 'Style':
									return (
										<EditorModalSettings
											editorFont={this.props.loginData.getIn(['userData', 'settings', 'editorFont'])}
											editorFontSize={this.props.loginData.getIn(['userData', 'settings', 'editorFontSize'])}
											editorColor={this.props.loginData.getIn(['userData', 'settings', 'editorColor'])}
											pubPrivacy={this.state.firepadData.settings.pubPrivacy}
											pubStyle={this.state.firepadData.settings.pubStyle}
											saveUpdatedSettingsUser={this.saveUpdatedSettingsUser}
											saveUpdatedSettingsFirebase={this.saveUpdatedSettingsFirebase}
											saveUpdatedSettingsFirebaseAndPubPub={this.saveUpdatedSettingsFirebaseAndPubPub}/>
									);
								default:
									return null;
								}
							})()}

						</div>
					</div>

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

					{/*	Horizontal loader line
						Separates top bar from rest of editor page */}
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
										return <li key={'blNav' + index} onClick={this.focusEditor(item.title, index)} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, this.animateListItem('left', loadStatus, index), showBottomLeftMenu && styles[viewMode].listItemActive, this.state.activeFocus === item.title && styles.common.listItemActiveFocus]}>{item.title}</li>;
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
										return <li key={'brNav' + index} onClick={this.insertFormatting(item)} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, this.animateListItem('right', loadStatus, index), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>{item}</li>;
									});
								}()}
							</ul>
						</div>
					</div>

					{/* Markdown Editing Block */}
					<div id="editor-text-wrapper" style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>

						{/* Insertion point for codemirror and firepad */}
						<div style={[this.state.activeFocus !== '' && styles.hiddenMainEditor]}>
							{/* 
							<input type="text" placeholder="Title Required"/>
							<p contentEditable="true" onChange={()=>{console.log('change');}}>This is an editable paragraph.</p>
							*/}
							<div id="codemirror-wrapper"></div>
						</div>
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
