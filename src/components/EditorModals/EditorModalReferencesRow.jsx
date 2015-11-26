import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Reference} from '../';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

// This file exists because of performance issues.
// With Radium working to inline styles on large tables and rows,
// Every :hover event causes the entire componenet to redraw.
// Furthermore, it uses the components state, so large states which are slower to write,
// will cause even more slowdown with hover events.
// By moving this into it's own component, it will on locally redraw and have an empty state to work with

const EditorModalReferences = React.createClass({
	propTypes: {
		citation: PropTypes.object,
		index: PropTypes.number,
		editRefFunction: PropTypes.func,
		deleteRefFunction: PropTypes.func,
		referenceStyle: PropTypes.string,
	},
	
	render: function() {
		const citation = this.props.citation;
		const index = this.props.index;
		return (
			
			<div style={styles.rowContainer}>
				<div style={[styles.refNameColumn]}>{citation.refName}</div>
				<div style={[styles.bodyColumn]}> <Reference citationObject={citation} mode={this.props.referenceStyle} /> </div>
				<div style={[styles.optionColumn, styles.optionColumnClickable]} key={'referenceListOptionColumnEdit-' + index} onClick={this.props.editRefFunction(citation)}>edit</div>
				<div style={[styles.optionColumn, styles.optionColumnClickable]} key={'referenceListOptionColumnDelete-' + index} onClick={this.props.deleteRefFunction(citation.refName)}>delete</div>
				<div style={styles.clearfix}></div>
			</div>
							
		);
	}
});

export default Radium(EditorModalReferences);

styles = {
	rowContainer: {
		width: 'calc(100% - 30px)',
		padding: 15,
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	refNameColumn: {
		width: 'calc(25% - 20px)',
		padding: '0px 10px',
		float: 'left',
	},
	bodyColumn: {
		width: 'calc(55% - 20px)',
		padding: '0px 10px',
		float: 'left',
		overflow: 'hidden',
	},
	optionColumn: {
		width: 'calc(10% - 10px)',
		padding: '0px 5px',
		float: 'left',
		textAlign: 'center',
	},
	optionColumnClickable: {
		userSelect: 'none',
		color: globalStyles.veryLight,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	clearfix: {
		// necessary because we float elements with variable height 
		display: 'table',
		clear: 'both',
	},
};
