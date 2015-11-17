import React from 'react';
import Radium from 'radium';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const EditorModalSettings = React.createClass({
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
	render: function() {
		const sampleOptions = [
			{
				title: 'editor font',
				activeOption: 'mono',
				options: ['serif', 'sans-serif', 'mono'],
			},
			{
				title: 'editor color',
				activeOption: 'light',
				options: ['light', 'dark'],
			},
			{
				title: 'editor font size',
				activeOption: 'medium',
				options: ['small', 'medium', 'large'],
			},
			{
				title: 'pub privacy',
				activeOption: 'public',
				options: ['public', 'private'],
			},
			{
				title: 'pub style',
				activeOption: 'science',
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
					
					{
						sampleOptions.map((optionObject)=> {
							return (
								<div key={'settingsOptions-' + optionObject.title} style={styles.optionContainer}>

									<div style={styles.optionHeader}>{optionObject.title}</div>

									<div style={styles.optionChoices}>
										{
											optionObject.options.map((option, index)=> {
												// const separator = index !== optionObject.options.length - 1 ? <span style={styles.optionSeparator}>|</span> : null;
												return (
													<span key={optionObject.title + '-' + index}>
														<span key={optionObject.title + '-' + option} style={[styles.option, optionObject.activeOption === option && styles.optionActive]}>{option}</span>
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
