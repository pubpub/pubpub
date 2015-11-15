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
		loginData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin, ReactFireMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			return dispatch(getPubEdit(routeParams.slug));
		}
	},
	getInitialState() {
		return { tree: 'test' };
	},
	componentDidMount() {
		const ref = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/assets' );
		this.bindAsObject(ref, 'assetsObject');
		this.bindAsArray(ref, 'assetsList');


		const firepadRef = new Firebase('https://pubpub.firebaseio.com/' + this.props.slug + '/firepad');
		const cmOptions = {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: true,
			mode: 'markdown',
		};
		const codeMirror = CodeMirror(document.getElementById('firepad'), cmOptions);
		const username = (this.props.loginData.get('loggedIn') === false) ? 'cat' : this.props.loginData.getIn(['userData', 'username']);
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
	toggleView: function() {
		return this.props.dispatch(toggleEditorViewMode());
	},
	toggleFormatting: function() {
		return this.props.dispatch(toggleFormatting());
	},
	toggleTOC: function() {
		return this.props.dispatch(toggleTOC());
	},
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

	addAsset: function(asset) {
		let refName = asset.originalFilename.replace(/[^0-9a-z]/gi, '');
		this.state.assetsList.forEach((thisAsset)=>{
			if (thisAsset.refName === refName) {
				refName = refName + '_' + Date.now();
			}
		});
		asset.refName = refName;
		asset.author = this.props.loginData.getIn(['userData', 'username']);

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
		const metaData = {
			title: 'PubPub - Editor'
		};

		const animateListItem = function(side, status, index) {
			const statusOffset = { loaded: 0, loading: 1};
			const offset = { left: -100, right: 100};
			const delay = 0.25 + (index * 0.02);
			return {
				transform: 'translateX(' + statusOffset[status] * offset[side] + 'px)',
				transition: '.3s ease-out transform ' + delay + 's',
			};
		};

		return (
			<div style={[styles.editorContainer]}>

				<DocumentMeta {...metaData} />

				<Style rules={this.codeMirrorStyles()} />

				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile :(</h1>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					<div className="modals">
						<div className="modal-splash" onClick={this.closeModalHandler} style={[styles.modalSplash, this.props.editorData.get('activeModal') !== undefined && styles.modalSplashActive]}></div>
						<div className="modal-container" style={[styles.modalContainer, activeModal !== undefined && styles.modalContainerActive]}>

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

					<div style={[styles.editorTopNav, styles.hiddenUntilLoad, styles[editorData.get('status')]]}>
						<ul style={styles.editorNav}>

							<li key="editorNav0"style={[styles.editorNavItem]} onClick={this.openModalHandler('Assets')}>Assets</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav1"style={[styles.editorNavItem]} onClick={this.openModalHandler('References')}>References</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav2"style={[styles.editorNavItem]} onClick={this.openModalHandler('Collaborators')}>Collaborators</li>

							<li key="editorNav3"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.openModalHandler('Publish')}>Publish</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav4"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.toggleView}>Live Preview</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.openModalHandler('Style')}>Style</li>

						</ul>
					</div>

					<div style={styles.editorLoadBar}>
						<LoaderDeterminate value={loadStatus === 'loading' ? 0 : 100}/>
					</div>


					<div style={[styles.common.editorBottomNav, styles[viewMode].editorBottomNav, styles.hiddenUntilLoad, styles[loadStatus]]}>
						<div style={[styles.common.bottomNavBackground, styles[viewMode].bottomNavBackground]}></div>
						<div className="leftBottomNav" style={[styles.common.bottomNavLeft, styles[viewMode].bottomNavLeft]}>
							<div key="bNav_toc" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, showBottomLeftMenu && styles[viewMode].listTitleActive]} onClick={this.toggleTOC}>Table of Contents</div>
							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge]}></div>
							</div>
							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, showBottomLeftMenu && styles[viewMode].listActive]}>
								<li key="blNav0" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 0), showBottomLeftMenu && styles[viewMode].listItemActive]}>Introduction</li>
								<li key="blNav1" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 1), showBottomLeftMenu && styles[viewMode].listItemActive]}>Prior Art</li>
								<li key="blNav2" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 2), showBottomLeftMenu && styles[viewMode].listItemActive]}>Resources</li>
								<li key="blNav3" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 3), showBottomLeftMenu && styles[viewMode].listItemActive]}>Methods</li>
								<li key="blNav4" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 4), showBottomLeftMenu && styles[viewMode].listItemActive]}>A New Approach</li>
								<li key="blNav5" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 5), showBottomLeftMenu && styles[viewMode].listItemActive]}>Data Analysis</li>
								<li key="blNav6" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 6), showBottomLeftMenu && styles[viewMode].listItemActive]}>Results</li>
								<li key="blNav7" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 7), showBottomLeftMenu && styles[viewMode].listItemActive]}>Conclusion</li>
							</ul>
						</div>

						<div className="rightBottomNav" style={[styles.common.bottomNavRight, styles[viewMode].bottomNavRight]}>
							<div key="bNav_format" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, styles.alignRight, showBottomRightMenu && styles[viewMode].listTitleActive]} onClick={this.toggleFormatting}>Formatting</div>

							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall, styles.floatRight, styles.common.bottomNavDividerRight]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge, styles.floatRight, styles.common.bottomNavDividerLargeRight]}></div>
							</div>


							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, styles[viewMode].bottomNavListRight, styles.alignRight, showBottomRightMenu && styles[viewMode].listActive]}>

								<li key="brNav0" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 0), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H1</li>
								<li key="brNav1" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 1), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H2</li>
								<li key="brNav2" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 2), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H3</li>
								<li key="brNav3" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 3), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}># List</li>
								<li key="brNav4" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 4), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>- List</li>
								<li key="brNav5" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 5), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Image</li>
								<li key="brNav6" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 6), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Video</li>
								<li key="brNav7" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 7), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Audio</li>
								<li key="brNav8" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 8), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Gallery</li>
								<li key="brNav9" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 9), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Hologram</li>
							</ul>
						</div>
					</div>

					<div style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>
						<div id="firepad"></div>
					</div>

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
