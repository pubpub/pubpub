import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {EditorModalAssets, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalSettings} from './';

let styles = {};

const EditorModals = React.createClass({
	propTypes: {
		closeModalHandler: PropTypes.func,
		activeModal: PropTypes.string,
		slug: PropTypes.string,

		// Asset Props
		assetData: PropTypes.object,
		addAsset: PropTypes.func,
		deleteAsset: PropTypes.func,

		// Collaborator Props
		collaboratorData: PropTypes.object,
		updateCollaborators: PropTypes.func,

		// Publish Props
		handlePublish: PropTypes.func,

		// References Props
		referenceData: PropTypes.object,
		referenceStyle: PropTypes.string,
		updateReferences: PropTypes.func,

		// Style Props
		editorFont: PropTypes.string,
		editorFontSize: PropTypes.string,
		editorColor: PropTypes.string,
		pubPrivacy: PropTypes.string,
		pubStyle: PropTypes.object,
		saveUpdatedSettingsUser: PropTypes.func,
		saveUpdatedSettingsFirebase: PropTypes.func,
		saveUpdatedSettingsFirebaseAndPubPub: PropTypes.func,

		
	},

	render: function() {
		return (
			<div style={styles.container}>

				{/*	Container for all modals and their backdrop. */}
				<div className="modals">
					<div className="modal-splash" onClick={this.props.closeModalHandler} style={[styles.modalSplash, this.props.activeModal !== undefined && styles.modalSplashActive]}></div>
					<div id="modal-container" className="modal-container" style={[styles.modalContainer, this.props.activeModal !== undefined && styles.modalContainerActive]}>
						{/*	Switch which modal is displayed based on the activeModal parameter */}
						{(() => {
							switch (this.props.activeModal) {
							case 'Assets':
								return (<EditorModalAssets 
										slug={this.props.slug} 
										assetData={this.props.assetData} 
										addAsset={this.props.addAsset} 
										deleteAsset={this.props.deleteAsset}/>
									);

							case 'Collaborators':
								return (<EditorModalCollaborators 
										collaboratorData={this.props.collaboratorData} 
										updateCollaborators={this.props.updateCollaborators}/>
									);

							case 'Publish':
								return (<EditorModalPublish 
										handlePublish={this.props.handlePublish}/>
									);

							case 'References':
								return (<EditorModalReferences
										referenceData={this.props.referenceData}
										referenceStyle={this.props.referenceStyle}
										updateReferences={this.props.updateReferences}/>
									);

							case 'Style':
								return (<EditorModalSettings
										editorFont={this.props.editorFont}
										editorFontSize={this.props.editorFontSize}
										editorColor={this.props.editorColor}
										pubPrivacy={this.props.pubPrivacy}
										pubStyle={this.props.pubStyle}
										saveUpdatedSettingsUser={this.props.saveUpdatedSettingsUser}
										saveUpdatedSettingsFirebase={this.props.saveUpdatedSettingsFirebase}
										saveUpdatedSettingsFirebaseAndPubPub={this.props.saveUpdatedSettingsFirebaseAndPubPub}/>
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

export default Radium(EditorModals);

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
