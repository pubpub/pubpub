/* global CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const EditorStylePane = React.createClass({
	propTypes: {
		toggleStyleMode: PropTypes.func,
		saveStyleHandler: PropTypes.func,
		saveStyleError: PropTypes.bool,
		defaultDesktop: PropTypes.string,
		defaultMobile: PropTypes.string,

	},

	getDefaultProps: function() {
		
	},
	getInitialState() {
		return {
			mode: 'desktop',
		};
	},

	componentDidMount() {
		CodeMirror(document.getElementById('codeMirrorPubCSSDesktop'), {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: false,
			mode: 'css',
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: '/* For Example: */\n\n#pub-title { \n    color: red; \n    fontSize: 35px; \n}\nh1, h2, h3 {\n    text-align: right;\n}',
		});
		CodeMirror(document.getElementById('codeMirrorPubCSSMobile'), {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: false,
			mode: 'css',
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: '/* For Example: */\n\n#pub-title { \n    color: red; \n    fontSize: 35px; \n}\nh1, h2, h3 {\n    text-align: right;\n}',
		});
		// codeMirror.setValue(JSON.stringify(this.props.pubStyle.cssObjectString));
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultDesktop !== nextProps.defaultDesktop) {
			const cmDesktop = document.getElementById('codeMirrorPubCSSDesktop').childNodes[0].CodeMirror;	
			cmDesktop.setValue(nextProps.defaultDesktop);
		}

		if (this.props.defaultMobile !== nextProps.defaultMobile) {
			const cmMobile = document.getElementById('codeMirrorPubCSSMobile').childNodes[0].CodeMirror;	
			cmMobile.setValue(nextProps.defaultMobile);
		}
	},

	setMode: function(mode) {
		return ()=>{
			this.setState({mode: mode});
		};
	},

	saveCustomSettings: function() {

		const cmDesktop = document.getElementById('codeMirrorPubCSSDesktop').childNodes[0].CodeMirror;
		const cmMobile = document.getElementById('codeMirrorPubCSSMobile').childNodes[0].CodeMirror;
		const newStyleDesktop = cmDesktop.getValue();
		const newStyleMobile = cmMobile.getValue();

		// const newSetting = {};

		// newSetting.pubStyle = {
		// 	type: 'custom',
		// 	googleFontURL: this.refs.googleFontURL.value,
		// 	cssObjectString: cm.getValue(),
		// };

		// this.props.toggleLeftPanelModeHandler();
		// this.toggleShowAdvanced();
		// this.setState({
		// 	showAdvanced: false,
		// 	showAdvancedError: false,
		// });

		// return this.props.saveUpdatedSettingsFirebase(newSetting);


		this.props.saveStyleHandler(newStyleDesktop, newStyleMobile);
	},

	render: function() {
		return (
			<div style={styles.container}>

				<Style rules={{
					'.codeMirrorPubCSS .CodeMirror': {
						border: '1px solid #ccc',
						fontSize: '14px',
						fontFamily: 'Courier',
						padding: '10px 10px',
						width: 'calc(100% - 20px)',
						minHeight: '150px',
					},
					'.codeMirrorPubCSS .CodeMirror pre.CodeMirror-placeholder': { 
						color: '#999',
					},
					'.codeMirrorPubCSS .CodeMirror-empty .CodeMirror-scroll': { 
						overflow: 'visible !important',
					},
				}} />
				
				<div style={styles.header}>Style Editor</div>
				<div style={[styles.rightCornerAction]} key={'styleCloseButton'} onClick={this.props.toggleStyleMode}>Close</div>

				<div style={styles.customDetail}>Custom styles can be designed for your pub.</div>
				<div style={styles.customDetail}>Available selectors: <span style={styles.url}>#pub-title, #pub-authors, .pub-author, #pub-abstract, #pub-header-divider, .p-block, h1, h2, h3, h4, h5, h6, ul, ol</span></div>
				
				<div style={styles.modeButtons}>
					<div style={[styles.modeButton, this.state.mode === 'desktop' && styles.modeButtonActive]} key={'modeButton0'} onClick={this.setMode('desktop')}>Desktop</div>
					<div style={styles.modeSeparator}>|</div>
					<div style={[styles.modeButton, this.state.mode === 'mobile' && styles.modeButtonActive]} key={'modeButton1'} onClick={this.setMode('mobile')}>Mobile</div>
					<div style={globalStyles.clearFix}></div>
				</div>

				<div id={'codeMirrorPubCSSDesktop'} className={'codeMirrorPubCSS'} style={[styles.codeMirrorWrapper, this.state.mode !== 'desktop' && styles.hidden]}></div>
				<div id={'codeMirrorPubCSSMobile'} className={'codeMirrorPubCSS'} style={[styles.codeMirrorWrapper, this.state.mode !== 'mobile' && styles.hidden]}></div>

				<div style={styles.saveButton} key={'customStyleSaveButton'} onClick={this.saveCustomSettings}>Save</div>
				{
					this.props.saveStyleError
						? <div>{this.props.saveStyleError}</div>
						: null
				}

			</div>
		);
	}
});

export default Radium(EditorStylePane);

styles = {
	container: {
		padding: 20,
		position: 'relative',
	},
	header: {
		margin: 0,
		paddingBottom: 5,
		fontSize: '1.8em',
	},
	rightCornerAction: {
		position: 'absolute',
		padding: '10px 20px',
		top: 20,
		right: 0,
		fontSize: 20,
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	subHeader: {
		margin: 0,
		paddingBottom: 5,
		fontSize: '1.5em',
	},
	customDetail: {
		marginLeft: '10px',
	},
	codeMirrorWrapper: {
		width: 'calc(100% - 20px)',
		margin: '5px 10px 40px 10px',
	},
	hidden: {
		opacity: 0,
		pointerEvents: 'none',
		height: '0px',
		position: 'absolute',
	},
	modeButtons: {
		margin: '15px 0px 0px 10px',
		fontSize: '14px',
	},
	modeButton: {
		color: '#bbb',
		float: 'left',
		':hover': {
			cursor: 'pointer',
			color: '#222',
		},
	},
	modeButtonActive: {
		color: '#444',
	},
	modeSeparator: {
		padding: '0px 10px',
		color: '#bbb',
		float: 'left',
	},
	saveButton: {
		// textAlign: 'center',
		fontSize: 20,
		// position: 'relative',
		// left: '20px',
		width: '52px',
		// backgroundColor: 'red',
		// float: 'right',
		padding: '0px 20px',
		marginBottom: 20,

		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
};
