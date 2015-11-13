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
	},

	componentWillUnmount() {
		this.props.dispatch(unmountEditor());
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
						<h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p><h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p>
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
