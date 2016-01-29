/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium from 'radium';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {EditorModalAssets, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalSettings} from '../../components/EditorModals';


import {closeModal, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {saveSettingsUser} from '../../actions/login';

import {globalStyles} from '../../utils/styleConstants';

let FireBaseURL;
let styles;

const Editor = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object, // User login data
		slug: PropTypes.string, // equal to project uniqueTitle
		dispatch: PropTypes.func,

		publishVersionHandler: PropTypes.func,
	},

	mixins: [PureRenderMixin, ReactFireMixin],

	getInitialState() {
		return {
			initialized: false,
			firepadData: {
				collaborators: {},
				assets: {},
				references: {},
				selections: [],
				settings: {},
			},
			
		};
	},

	componentDidMount() {
		FireBaseURL = (process.env.NODE_ENV === 'production' && location.hostname !== 'pubpub-dev.herokuapp.com') ? 'https://pubpub.firebaseio.com/' : 'https://pubpub-dev.firebaseio.com/';

		if (! this.props.editorData.get('error')) {

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
	},

	initializeEditorData: function(token) {
		// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
		const ref = new Firebase(FireBaseURL + this.props.slug + '/editorData' );
		ref.authWithCustomToken(token, (error, authData)=> {
			if (error) {
				console.log('Authentication Failed!', error);
			} else {
				this.bindAsObject(ref, 'firepadData');

				this.setState({initialized: true});
			}
		});

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


	render: function() {
				
		const activeModal = this.props.editorData.get('activeModal');

		return (
			<div style={styles.container} className={'editorModals'}>

				{/*	Container for all modals and their backdrop. */}
				<div className="modals">
					<div className="modal-splash" onClick={this.closeModalHandler} style={[styles.modalSplash, activeModal !== undefined && styles.modalSplashActive]}></div>
					<div id="modal-container" className="modal-container" style={[styles.modalContainer, activeModal !== undefined && styles.modalContainerActive]}>
						{/*	Switch which modal is displayed based on the activeModal parameter */}
						{(() => {
							switch (activeModal) {
							case 'Assets':
								return (<EditorModalAssets 
										slug={this.props.slug} 
										assetData={this.state.firepadData.assets} 
										addAsset={this.addAsset} 
										deleteAsset={this.deleteAsset}/>
									);

							case 'Collaborators':
								return (<EditorModalCollaborators 
										collaboratorData={this.state.firepadData.collaborators} 
										updateCollaborators={this.saveUpdatedCollaborators}/>
									);

							case 'Publish':
								return (<EditorModalPublish 
										slug={this.props.slug} 
										handlePublish={this.props.publishVersionHandler}
										currentJournal={this.props.journalData.getIn(['journalData', 'journalName'])}/>
									);

							case 'References':
								return (<EditorModalReferences
										referenceData={this.state.firepadData.references}
										referenceStyle={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubReferenceStyle : undefined}
										updateReferences={this.saveReferences}/>
									);

							case 'Style':
								return (<EditorModalSettings
										editorFont={this.props.loginData.getIn(['userData', 'settings', 'editorFont'])}
										editorFontSize={this.props.loginData.getIn(['userData', 'settings', 'editorFontSize'])}
										editorColor={this.props.loginData.getIn(['userData', 'settings', 'editorColor'])}
										pubPrivacy={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubPrivacy : undefined}
										pubStyle={this.state.firepadData && this.state.firepadData.settings ? this.state.firepadData.settings.pubStyle : undefined}
										saveUpdatedSettingsUser={this.saveUpdatedSettingsUser}
										saveUpdatedSettingsFirebase={this.saveUpdatedSettingsFirebase}
										saveUpdatedSettingsFirebaseAndPubPub={this.saveUpdatedSettingsFirebaseAndPubPub} />
									);
							default:
								return null;
							}
						})()}

					</div>
				</div>

			</div>

		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		editorData: state.editor,
		slug: state.router.params.slug,
		loginData: state.login
	};
})( Radium(Editor) );

styles = {	
	modalSplash: {
		opacity: 0,
		pointerEvents: 'none',
		width: '100vw',
		height: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ')',
		position: 'fixed',
		top: 60,
		backgroundColor: 'rgba(255,255,255,0.7)',
		transition: '.1s linear opacity',
		zIndex: 100,
	},
	modalSplashActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	modalContainer: {
		width: '76vw',
		minHeight: 400,
		maxHeight: 'calc(100vh - 150px)',
		overflow: 'hidden',
		overflowY: 'scroll',
		margin: '0 auto',
		position: 'absolute',
		top: 60,
		left: '12vw',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
		zIndex: 150,

		opacity: 0,
		pointerEvents: 'none',
		transform: 'scale(0.8)',
		transition: '.1s linear opacity, .1s linear transform',

		'@media screen and (min-width: 1600px)': {
			width: 1200,
			left: 'calc(50vw - 600px)',
		},

	},
	modalContainerActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
	},
};
