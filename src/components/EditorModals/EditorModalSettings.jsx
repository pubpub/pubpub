import React, {PropTypes} from 'react';
import Radium from 'radium';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

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
			pubStyle: {type: 'science'},
		};
	},

	getInitialState: function() {
		return {
			showAdvanced: false,
		};
	},
	toggleshowAdvanced: function() {
		this.setState({
			showAdvanced: !this.state.showAdvanced,	
		});
	},

	handleOptionClick: function(key, option) {

		return ()=>{

			const newSetting = {};
			newSetting[key] = option;

			switch (key) {
			case 'editorFont': 
			case 'editorColor':
			case 'editorFontSize':
				return this.props.saveUpdatedSettingsUser(newSetting);
			case 'pubStyle':
				newSetting[key] = {type: option};
				return this.props.saveUpdatedSettingsFirebase(newSetting);
			case 'pubPrivacy':
				return this.props.saveUpdatedSettingsFirebaseAndPubPub(newSetting);
			default:
				return console.log('hit default');
			}

		};
	},

	render: function() {
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
				options: ['science', 'magazine', 'blog'],
			}

		];

		return (
			<div>
				<h2 style={baseStyles.topHeader}>Settings</h2>

				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showAdvanced]]} onClick={this.toggleshowInviteOptions}>
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
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showInviteOptions], styles.addOptionsContent]}>

					<h2 style={styles.sectionHeader}>Advanced Style Options</h2>
					

				</div>

			</div>
		);
	}
});

export default Radium(EditorModalSettings);

styles = {
	mainContent: {
		true: {
			display: 'none',
		},
	},
	addOptions: {
		true: {
			display: 'block',
		},
		display: 'none',
		
	},
	addOptionsContent: {
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
			cursor: 'default',
			color: 'black',
		},
	},
};
