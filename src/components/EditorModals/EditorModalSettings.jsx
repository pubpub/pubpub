/* global CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {LoaderIndeterminate} from '../../components';
import {baseStyles} from './editorModalStyle';
import {globalStyles} from '../../utils/styleConstants';
import cssConvert from '../../utils/cssToRadium';

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
		toggleLeftPanelModeHandler: PropTypes.func,
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
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: '/* For Example: */\n\n#pub-title { \n    color: red; \n    fontSize: 35px; \n}\nh1, h2, h3 {\n    text-align: right;\n}',
		});
		// codeMirror.setValue(JSON.stringify(this.props.pubStyle.cssObjectString));
	},
	componentWillReceiveProps: function() {
		this.setState({isLoading: false});
	},

	toggleShowAdvanced: function() {
		if (!this.state.showAdvanced) {
			const cm = document.getElementById('codeMirrorJSX').childNodes[0].CodeMirror;
			// console.log(this.props.pubStyle.cssObjectString);
			cm.setValue(this.props.pubStyle.cssObjectString || '');
			
		}

		this.props.toggleLeftPanelModeHandler();
		this.setState({
			showAdvanced: !this.state.showAdvanced,	
			showAdvancedError: false,
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
		
		// We should test before save
		cssConvert(cm.getValue());
	
		const newSetting = {};

		newSetting.pubStyle = {
			type: 'custom',
			googleFontURL: this.refs.googleFontURL.value,
			cssObjectString: cm.getValue(),
		};

		this.props.toggleLeftPanelModeHandler();
		this.toggleShowAdvanced();
		// this.setState({
		// 	showAdvanced: false,
		// 	showAdvancedError: false,
		// });

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
			// {
			// 	title: 'pub privacy',
			// 	key: 'pubPrivacy',
			// 	activeOption: this.props.pubPrivacy,
			// 	options: ['public', 'private'],
			// },
			// {
			// 	title: 'pub style',
			// 	key: 'pubStyle',
			// 	activeOption: this.props.pubStyle.type,
			// 	options: ['science', 'magazine', 'custom'],
			// }

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
						minHeight: '150px',
					},
					'#codeMirrorJSX .CodeMirror pre.CodeMirror-placeholder': { 
						color: '#999',
					},
					'#codeMirrorJSX .CodeMirror-empty .CodeMirror-scroll': { 
						overflow: 'visible !important',
					},
				}} />

				<div style={styles.loader}>
					{this.state.isLoading
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={baseStyles.topHeader}>Settings<span style={[styles.advancedTitle, styles.advancedTitle[this.state.showAdvanced]]}>: custom style</span></div>

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

					<div style={styles.subHeader}>Custom Fonts</div>
					<div style={styles.customDetail}>PubPub supports using custom Google Fonts. To add new fonts, paste the Google fonts url.</div>
					<div style={styles.customDetail}>e.g. <span style={styles.url}>https://fonts.googleapis.com/css?family=Raleway:400,100|Merriweather:400,300</span> </div>
					<input type="text" ref={'googleFontURL'} style={styles.googleFontInput} defaultValue={this.props.pubStyle.googleFontURL}/>

					<div style={styles.subHeader}>Custom CSS</div>
					<div style={styles.customDetail}>Custom styles can be designed for your pub by overwriting the default CSS. Custom fonts specified above can be used in this custom CSS.</div>
					<div style={styles.customDetail}>Available selectors: <span style={styles.url}>#pub-title, #pub-authors, .pub-author, #pub-abstract, #pub-header-divider, .p-block, h1, h2, h3, h4, h5, h6, ul, ol</span></div>
					<div id={'codeMirrorJSX'} style={styles.codeMirrorWrapper}></div>

					<div style={styles.saveButton} key={'customStyleSaveButton'} onClick={this.saveCustomSettings}>Save</div>
					{
						this.state.showAdvancedError
							? <div>Error</div>
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
			overflow: 'visible',
		},
		// display: 'none',
		opacity: 0,
		height: 0,
		pointerEvents: 'none',
		overflow: 'hidden',
		
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
	subHeader: {
		margin: 0,
		paddingBottom: 5,
		fontSize: '1.5em',
	},
	url: {
		fontFamily: 'Courier',
		fontSize: '14px',
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
	customDetail: {
		marginLeft: '10px',
	},
	codeMirrorWrapper: {
		width: 600,
		margin: '20px 0px 40px 10px',
	},
	googleFontInput: {
		width: 580,
		padding: '10px 10px',
		fontSize: '16px',
		color: '#555',
		outline: 'none',
		margin: '20px 0px 30px 10px',
	}
};
