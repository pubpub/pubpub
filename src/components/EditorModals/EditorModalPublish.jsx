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
						<span key={'publishModal-journal'} style={[styles.option]}>peer-review ready</span>
					</div>
				</div>

				<div style={styles.optionContainer}>
					<div style={styles.optionHeader}>version description</div>
					<textarea style={styles.messageTextarea} placeholder="e.g. Initial draft version,or updating dataset caption"></textarea>
				</div>

				<div style={styles.publishText}>
					<p style={styles.publishTextP}>You can publish versions to your Pub as frequently as you like.</p> 
					<p style={styles.publishTextP}>We encourage you to publish early and often.</p> 
					<p style={styles.publishTextP}>The full history will be maintained and accessible.</p>
				</div>

				<div key="publish-button" style={styles.publishButton}>Publish version</div>
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
	messageTextarea: {
		outline: 'none',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#aaa',
		resize: 'none',
		margin: '15px 0px',
		fontSize: '15px',
		height: 30,
		width: '100%',
		maxWidth: 600,
	},
	publishText: {
		padding: '5px 25px',
		fontSize: '18px',
	},
	publishTextP: {
		margin: 0,
		padding: 0,
	},
	publishButton: {
		fontSize: '35px',
		padding: '25px',
		textAlign: 'right',
		marginLeft: 'calc(100% - 230px - 50px)',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
	}
};
