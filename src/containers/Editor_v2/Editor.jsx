/* global Firebase Firepad CodeMirror */
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderDeterminate} from '../../components';
import {EditorModalAssets, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalStyle} from '../../components/EditorModals';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor, closeModal, openModal} from '../../actions/editor';
import ReactFireMixin from 'reactfire';

import {styles} from './EditorStyle';

import markLib from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
markLib.setExtensions(markdownExtensions);

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
		return { tree: '' };
	},
	// Code for client-side rendering only put in componentDidMount()
	componentDidMount() {
		// Load Firebase and bind using ReactFireMixin
		// For assets, references, etc.
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/assets' );
		this.bindAsObject(ref, 'assetsObject');
		this.bindAsArray(ref, 'assetsList');

		// Load Firebase ref that is used for firepad
		const firepadRef = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/firepad');
		// codeMirror options.
		const cmOptions = {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: true,
			mode: 'markdown',
		};
		// Load codemirror into
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

	},

	componentWillUnmount() {
		this.props.dispatch(unmountEditor());
	},

	onEditorChange: function(cm, change) {
		this.setState({
			tree: markLib(cm.getValue()).tree
		});
	},

	toggleLivePreview: function() {
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

	// CodeMirror styles function can be
	// used to dynamically change font, size, color, etc
	codeMirrorStyles: function() {
		return {
			'.CodeMirror': {
				backgroundColor: 'transparent',
				fontSize: '15px',
				color: '#555',
				fontFamily: 'Courier',
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
		this.state.assetsList.forEach((thisAsset)=>{
			if (thisAsset.refName === refName) {
				refName = refName + '_' + Date.now();
			}
		});
		// Add refname and author to passed in asset object.
		asset.refName = refName;
		asset.author = this.props.loginData.getIn(['userData', 'username']);

		// Push to firebase ref
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/assets' );
		ref.push(asset);
	},

	closeModalHandler: function() {
		this.props.dispatch(closeModal());
	},
	openModalHandler: function(activeModal) {
		return ()=> this.props.dispatch(openModal(activeModal));
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const activeModal = this.props.editorData.get('activeModal');

		// Set metadata for the page.
		const metaData = {
			title: 'PubPub - Editing ' + this.props.slug
		};

		return (
			<div style={[styles.editorContainer]}>

				<DocumentMeta {...metaData} />

				<Style rules={this.codeMirrorStyles()} />


				{/*	Mobile Editing not currently supported.
					Display a splash screen if media queries determine mobile mode */}

				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile :(</h1>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					{/*	Container for all modals and their backdrop. */}
					<div className="modals">
						<div className="modal-splash" onClick={this.closeModalHandler} style={[styles.modalSplash, this.props.editorData.get('activeModal') !== undefined && styles.modalSplashActive]}></div>
						<div className="modal-container" style={[styles.modalContainer, activeModal !== undefined && styles.modalContainerActive]}>
							{/*	Switch which modal is displayed based on the activeModal parameter */}
							{(() => {
								switch (activeModal) {
								case 'Assets':
									return (<EditorModalAssets assetData={this.state.assetsList} slug={this.props.slug} addAsset={this.addAsset}/>);
								case 'Collaborators':
									return (<EditorModalCollaborators/>);
								case 'Publish':
									return (<EditorModalPublish/>);
								case 'References':
									return (<EditorModalReferences/>);
								case 'Style':
									return (<EditorModalStyle/>);
								default:
									return null;
								}
							})()}

						</div>
					</div>

					{/*	Top Nav. Fixed to the top of the editor page, just below the main pubpub bar */}
					<div style={[styles.editorTopNav, styles.hiddenUntilLoad, styles[editorData.get('status')]]}>
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
							<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.openModalHandler('Style')}>Style</li>

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
						<div style={[styles.common.bottomNavBackground, styles[viewMode].bottomNavBackground]}></div>

						<div className="leftBottomNav" style={[styles.common.bottomNavLeft, styles[viewMode].bottomNavLeft]}>

							{/* Table of Contents Title */}
							<div key="bNav_toc" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, showBottomLeftMenu && styles[viewMode].listTitleActive]} onClick={this.toggleTOC}>Table of Contents</div>

							{/* Table of Contents line separator */}
							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge]}></div>
							</div>

							{/* Table of Contents list */}
							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, showBottomLeftMenu && styles[viewMode].listActive]}>
								{()=>{
									const options = ['Introduction', 'Prior Art', 'Resources', 'Methods', 'A New Approach', 'Data Analysis', 'Results', 'Conclusion'];
									return options.map((item, index)=>{
										return <li key={'blNav' + index} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, this.animateListItem('left', loadStatus, index), showBottomLeftMenu && styles[viewMode].listItemActive]}>{item}</li>;
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
									const options = ['H1', 'H2', 'H3', '# List', '- List', 'Image', 'Video', 'Audio', 'Gallery', 'Hologram'];
									return options.map((item, index)=>{
										return <li key={'brNav' + index} style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, this.animateListItem('right', loadStatus, index), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>{item}</li>;
									});
								}()}
							</ul>
						</div>
					</div>

					{/* Markdown Editing Block */}
					<div style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>

						{/* Insertion point for codemirror and firepad */}
						<div id="codemirror-wrapper"></div>

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
