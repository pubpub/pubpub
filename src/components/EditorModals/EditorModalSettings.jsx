/* global CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {LoaderIndeterminate} from '../../components';
import {baseStyles} from './editorModalStyle';
import {globalStyles} from '../../utils/styleConstants';
import cssConvert from 'css-to-radium';

let styles = {};

const EditorModalSettings = React.createClass({
	propTypes: {
		editorFont: PropTypes.string,
		editorColor: PropTypes.string,
		editorFontSize: PropTypes.string,
		pubPrivacy: PropTypes.string,
		pubStyle: PropTypes.object,
		saveUpdatedSettingsUser: PropTypes.func,
		saveUpdatedSettingsFirebase: PropTypes.func,
		saveUpdatedSettingsFirebaseAndPubPub: PropTypes.func,
	},
	getDefaultProps: function() {
		return {
			editorFont: 'mono',
			editorColor: 'light',
			editorFontSize: 'medium',
			pubPrivacy: 'public',
			pubStyle: {
				type: 'science',
				googleFontURL: '',
				cssObjectString: '',
			},
		};
	},

	getInitialState: function() {
		return {
			showAdvanced: false,
			showAdvancedError: false,
			isLoading: false,
		};
	},

	componentDidMount() {
		CodeMirror(document.getElementById('codeMirrorJSX'), {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: true,
			mode: 'css',
			extraKeys: {'Ctrl-Space': 'autocomplete'}
		});
		// codeMirror.setValue(JSON.stringify(this.props.pubStyle.cssObjectString));
	},
	componentWillReceiveProps: function() {
		this.setState({isLoading: false});
	},

	toggleShowAdvanced: function() {
		if (!this.state.showAdvanced) {
			const cm = document.getElementById('codeMirrorJSX').childNodes[0].CodeMirror;
			console.log(this.props.pubStyle.cssObjectString);
			cm.setValue(this.props.pubStyle.cssObjectString || '');
			
		}

		this.setState({
			showAdvanced: !this.state.showAdvanced,	
		});
	},

	handleOptionClick: function(key, option) {

		return ()=>{

			if (key === 'pubStyle' && option === 'custom') {
				return this.toggleShowAdvanced();
			}

			const newSetting = {};
			newSetting[key] = option;

			this.setState({isLoading: true});

			switch (key) {
			case 'editorFont': 
			case 'editorColor':
			case 'editorFontSize':
				return this.props.saveUpdatedSettingsUser(newSetting);
			case 'pubStyle':
				newSetting[key] = {...this.props.pubStyle, type: option};
				return this.props.saveUpdatedSettingsFirebase(newSetting);

			case 'pubPrivacy':
				return this.props.saveUpdatedSettingsFirebaseAndPubPub(newSetting);
			default:
				return console.log('hit default');
			}

		};
	},

	saveCustomSettings: function() {

		// this.setState({showAdvancedError: false});
		const cm = document.getElementById('codeMirrorJSX').childNodes[0].CodeMirror;
		// console.log(cm.getValue());
		console.log(cssConvert(cm.getValue()));
	

		const newSetting = {};

		newSetting.pubStyle = {
			type: 'custom',
			googleFontURL: this.refs.googleFontURL.value,
			cssObjectString: cm.getValue(),
		};
		this.setState({
			showAdvanced: false,
			showAdvancedError: false,
		});

		return this.props.saveUpdatedSettingsFirebase(newSetting);
	},

	render: function() {
		// console.log('this.props.pubStyle', this.props.pubStyle);
		const options = [
			{
				title: 'editor font',
				key: 'editorFont',
				activeOption: this.props.editorFont,
				options: ['serif', 'sans-serif', 'mono'],
			},
			{
				title: 'editor color',
				key: 'editorColor',
				activeOption: this.props.editorColor,
				options: ['light', 'dark'],
			},
			{
				title: 'editor font size',
				key: 'editorFontSize',
				activeOption: this.props.editorFontSize,
				options: ['small', 'medium', 'large'],
			},
			{
				title: 'pub privacy',
				key: 'pubPrivacy',
				activeOption: this.props.pubPrivacy,
				options: ['public', 'private'],
			},
			{
				title: 'pub style',
				key: 'pubStyle',
				activeOption: this.props.pubStyle.type,
				options: ['science', 'magazine', 'custom'],
			}

		];

		return (
			<div style={styles.container}>
				<Style rules={{
					'#codeMirrorJSX .CodeMirror': {
						// backgroundColor: '#efefef',
						border: '1px solid #ccc',
						fontSize: '14px',
						// color: 'red',
						fontFamily: 'Courier',
						padding: '10px 10px',
						width: 'calc(100% - 20px)',
						minHeight: '24px',
					},
				}} />

				<div style={styles.loader}>
					{this.state.isLoading
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<h2 style={baseStyles.topHeader}>Settings<span style={[styles.advancedTitle, styles.advancedTitle[this.state.showAdvanced]]}>: custom style</span></h2>

				<div style={[baseStyles.rightCornerAction, styles.advanced, styles.advanced[this.state.showAdvanced]]} onClick={this.toggleShowAdvanced}>
					Back
				</div>

				<div className="main-ref-content" style={styles.mainContent[this.state.showAdvanced]}>
					
					{/* Iterate over options types */}
					{
						options.map((optionObject)=> {
							return (
								<div key={'settingsOptions-' + optionObject.title} style={styles.optionContainer}>

									{/* Option title */}
									<div style={styles.optionHeader}>{optionObject.title}</div>

									<div style={styles.optionChoices}>

										{/* Iterate over specific options */}
										{
											optionObject.options.map((option, index)=> {
												return (
													<span key={optionObject.title + '-' + index}>
														<span key={optionObject.title + '-' + option} style={[styles.option, optionObject.activeOption === option && styles.optionActive]} onClick={this.handleOptionClick(optionObject.key, option)}>{option}</span>
														{(index !== optionObject.options.length - 1 
															? <span style={styles.optionSeparator}>|</span> 
															: null
														)}
													</span>
												);
											})
										}
									</div>

								</div>
							);
						})
					}
					
				</div>

				{/* Additional options mode */}
				<div className="add-options-content" style={[styles.advanced, styles.advanced[this.state.showAdvanced], styles.advancedContent]}>

					<div>PubPub supports using custom Google Fonts. Paste font css url below.</div>
					<input type="text" ref={'googleFontURL'} style={styles.googleFontInput} defaultValue={this.props.pubStyle.googleFontURL}/>

					<div>Custom style. Javascript CSS (radium, etc).</div>
					<div id={'codeMirrorJSX'} style={styles.codeMirrorWrapper}></div>

					<div onClick={this.saveCustomSettings}>Save</div>
					{
						this.state.showAdvancedError
							? <div>ERROR</div>
							: null
					}
					

				</div>

			</div>
		);
	}
});

export default Radium(EditorModalSettings);

styles = {
	container: {
		position: 'relative',
	},
	mainContent: {
		true: {
			display: 'none',
		},
	},
	loader: {
		position: 'absolute',
		top: 10,
		width: '100%',
	},
	advanced: {
		true: {
			// display: 'block',
			opacity: 1,
			pointerEvents: 'auto',
			height: 'auto',
		},
		// display: 'none',
		opacity: 0,
		height: 0,
		pointerEvents: 'none',
		
	},
	advancedTitle: {
		true: {
			display: 'inline-block',
		},
		display: 'none',
		fontSize: '25px',
		
	},
	advancedContent: {
		padding: '15px 25px',
	},
	optionContainer: {
		width: 'calc(50% - 50px)',
		padding: '15px 25px 40px 25px',
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
		float: 'left',
		'@media screen and (min-width: 1400px)': {
			width: 'calc(33% - 50px)',
		},
	},
	optionHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
		height: '30px',
	},
	optionChoices: {
		padding: '5px 0px',
	},
	sectionHeader: {
		margin: 0,
	},
	option: {
		color: globalStyles.veryLight,
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		},
	},
	optionSeparator: {
		padding: '0px 10px',
	},
	optionActive: {
		color: 'black',
		':hover': {
			// cursor: 'default',
			color: 'black',
		},
	},
	codeMirrorWrapper: {
		width: 600,
	},
	googleFontInput: {
		width: 580,
		padding: '10px 10px',
		fontSize: '16px',
		color: '#555',
		outline: 'none',
	}
};
