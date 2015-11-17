import React from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const EditorModalPublish = React.createClass({
	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>Publish</h2>

				<div style={styles.optionContainer}>
					<div style={styles.optionHeader}>version state</div>
					<div style={styles.optionChoices}>
						<span key={'publishModal-draft'} style={[styles.option, styles.optionActive]}>draft</span>
						<span style={styles.optionSeparator}>|</span> 
						<span key={'publishModal-journal'} style={[styles.option]}>journal-ready</span>
					</div>
				</div>

				<div style={styles.optionContainer}>
					<div style={styles.optionHeader}>version description</div>
					<textarea placeholder="e.g. Initial draft version,or updating dataset caption"></textarea>
				</div>

				<p>You can publish versions to your Pub as frequently as you like. We encourage you to publish early and often. The full history will be maintained and accessible.</p>

				<div style={styles.publishButton}>Publish Version</div>
			</div>
		);
	}
});

export default Radium(EditorModalPublish);

styles = {
	optionContainer: {
		padding: '15px 25px 40px 25px',
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	optionHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
		height: '30px',
	},
	optionChoices: {
		padding: '5px 0px',
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
