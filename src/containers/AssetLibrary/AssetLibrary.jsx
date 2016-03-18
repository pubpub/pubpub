/* global Firebase Firepad CodeMirror */

import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import Radium from 'radium';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFireMixin from 'reactfire';

import {EditorModalAssets, EditorModalCollaborators, EditorModalPublish, EditorModalReferences, EditorModalSettings} from '../../components/EditorModals';
import {Menu} from '../../components';

import {closeModal, saveCollaboratorsToPub, saveSettingsPubPub} from '../../actions/editor';
import {saveSettingsUser} from '../../actions/login';

import {globalStyles} from '../../utils/styleConstants';

let FireBaseURL;
let styles;

const AssetLibrary = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object, // User login data
		slug: PropTypes.string, // equal to project uniqueTitle
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			
		};
	},

	componentDidMount() {
	
	},

	componentWillReceiveProps(nextProps) {
	},

	componentWillUnmount() {
		this.props.dispatch(closeModal());
	},

	render: function() {
		const menuItems = [
			{ key: 'assets', string: 'Assets', function: ()=>{} },
			{ key: 'references', string: 'References', function: ()=>{} },
			{ key: 'highlights', string: 'Highlights', function: ()=>{} },
		];

		const userAssets = this.props.loginData.getIn(['userData', 'assets']).toJS() || [];
		const assets = [];
		const references = [];
		const highlights = [];
		for (let index = 0; index < userAssets.length; index++) {
			if (userAssets[index].assetType === 'reference') {
				references.push(userAssets[index]);
			} else if (userAssets[index].assetType === 'highlight') {
				highlights.push(userAssets[index]);
			} else {
				assets.push(userAssets[index]);
			}
		}
		console.log(assets, references, highlights);


		return (
			<div style={styles.container}>
				<div style={globalStyles.h1}>Media Library</div>
				{/* <div style={[globalStyles.simpleButton, styles.topRight]} key={'libraryClose'}>Close</div> */}

				<div style={globalStyles.subMenu}>
					<Menu items={menuItems} submenu={true}/>
				</div>

				<div style={styles.addSection}>
					<div style={[globalStyles.simpleButton]} key={'addAsset'}>Add New Asset</div>
					<div>or drag files to this window to quickly add</div>
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
})( Radium(AssetLibrary) );

styles = {	
	container: {
		position: 'relative',
	},
	topRight: {
		position: 'absolute',
		top: '20px',
		right: '20px',
	},
	addSection: {
		padding: '20px',
	},
};
