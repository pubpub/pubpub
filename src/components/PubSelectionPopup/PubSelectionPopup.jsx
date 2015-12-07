import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

import {isDescendantOfP, getAncestorText} from './selectionFunctions';
import SHA1 from 'crypto-js/sha1';
import encHex from 'crypto-js/enc-hex';
let Marklib = undefined;
let Rangy = undefined;

let styles = {};

const PubSelectionPopup = React.createClass({
	propTypes: {
		fake: PropTypes.string,
	},

	getDefaultProps: function() {
		return {};
	},

	getInitialState() {
		return {
			popupVisible: false,
			xLoc: 0,
			yLoc: 0,
		};
	},

	componentDidMount() {
		Marklib = require('marklib');
		Rangy = require('rangy');
		require('rangy/lib/rangy-textrange.js');
		document.getElementById('pubBodyContent').addEventListener('mouseup', this.onMouseUp);
	},
	
	componentWillUnmount() {
		document.getElementById('pubBodyContent').removeEventListener('mouseup', this.onMouseUp);
	},

	onMouseUp: function(event) {
		// Right now, we only trigger the selectionPopup when the selection is
		// contained to a single P element. Support for headers, multiple paragraphs, and UL/OL
		// creates many many edge cases for storing and re-highlighting (especially as new 
		// versions are published). Support for lists could work by wrapping them in a P tag. 
		// Or, perhaps are more broad solution can be eventually built. For now, I think the bulk of
		// functionality is met by only supporting P-tag highlights. 
		// If we aren't supporting the current selection, we make no changes to the range. We could 
		// automatically snap to a supported section within the current range if we wanted to specifically 
		// push behavior, but maybe that's overkill. 
		// We could also start storing the type of element with the selection range. This would allow us to populate across
		// element types and across versions using the same technique as we do for P tags (replacing the nth-child index number
		// based on some hash)
		let clickX;
		let clickY;

		if (event.pageX || event.pageY) {
			clickX = event.pageX;
			clickY = event.pageY;
		} else {
			clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		const selection = Rangy.getSelection();
		const range = selection.getRangeAt(0);
		// console.log(range);
		// console.log(range.commonAncestorContainer);
		if (!selection.isCollapsed && isDescendantOfP(range.commonAncestorContainer)) {
			
			Rangy.getSelection().expand('word');
			const ancestorText = getAncestorText(range.commonAncestorContainer);
			this.setState({
				popupVisible: true,
				xLoc: clickX,
				yLoc: clickY,

				range: Rangy.getSelection().getRangeAt(0),
				selectionText: Rangy.getSelection().toString(),
				ancestorText: ancestorText,
				ancestorHash: SHA1(ancestorText).toString(encHex),

			});

		} else {
			this.setState({
				popupVisible: false,
			});
		}
				
	},

	onHighlightSave: function() {
		const renderer = new Marklib.Rendering(document, {className: 'temp'}, document.getElementById('pubBodyContent'));
		const result = renderer.renderWithRange(this.state.range);
		const highlightObject = {
			text: this.state.selectionText,
			context: this.state.ancestorText,
			ancestorHash: this.state.ancestorHash,
			startContainerPath: result.startContainerPath,
			endContainerPath: result.endContainerPath,
			startOffset: result.startOffset,
			endOffset: result.endOffset
		};
		// console.log(result);
		console.log(highlightObject);
	},

	getPluginPopupLoc: function() {
		return {
			top: this.state.yLoc,
			left: this.state.xLoc,
		};
	},
	
	render: function() {

		return (
			<div id="plugin-popup" className="plugin-popup" style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.popupVisible && styles.pluginPopupVisible]}>
				<div style={styles.pluginPopupArrow}></div>
				<div style={styles.pluginContent}>
					<div key={'addToComment Button'} style={styles.button} onClick={this.onHighlightSave}>Add to Comment</div>
				</div>
			</div>
		);

	}
});

export default Radium(PubSelectionPopup);

styles = {
	pluginPopup: {
		// width: 350,
		// minHeight: 200,
		fontFamily: globalStyles.headerFont,
		backgroundColor: 'white',
		boxShadow: '0px 0px 2px 0px #333',
		position: 'absolute',
		opacity: 0,
		transform: 'scale(1.0) translateY(-10px)',
		transition: '.1s linear transform, .1s linear opacity',
		zIndex: 5,
		pointerEvents: 'none',
		padding: 5,
		borderRadius: '1px',
		marginLeft: -173,
		marginTop: -5,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
		'@media screen and (min-width: 1600px)': {
			marginLeft: -223,
		},
		
	},
	pluginPopupVisible: {
		opacity: 1,
		transform: 'scale(1.0) translateY(0px)',
		pointerEvents: 'auto',
	},
	pluginPopupArrow: {
		position: 'absolute',
		top: -8,
		left: 15,
		width: 16,
		height: 16,
		backgroundColor: 'white',
		transform: 'rotate(45deg)',
		boxShadow: '-1px -1px 1px 0px #9A9A9A',
		zIndex: 4,
	},
	pluginContent: {
		position: 'relative',
		backgroundColor: 'white',
	},
	button: {
		zIndex: 5,
		color: '#555',
		fontSize: '15px',
		padding: '0px 5px',
		':hover': {
			color: '#222',
			cursor: 'pointer',
		},
	},
	clearfix: {
		display: 'table',
		clear: 'both',
	}
};
