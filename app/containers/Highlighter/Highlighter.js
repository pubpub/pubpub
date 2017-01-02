/* eslint-disable no-mixed-operators */
import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

import * as textQuote from 'dom-anchor-text-quote';
import Rangy from 'rangy';
require('rangy/lib/rangy-textrange');
import * as Marklib from 'marklib';

let styles = {};

export const Highlighter = React.createClass({
	propTypes: {

	},
	getInitialState() {
		return {
			popupVisible: false,
			xLoc: 0,
			yLoc: 0,
			ancestorText: false,
			highlightObject: undefined,
		};
	},

	componentDidMount() {
		const container = document.getElementById('content-wrapper');
		if (!container) { console.log('Error: <Highlighter /> must be a child of a div with id="content-wrapper"'); }
		container.addEventListener('mouseup', this.onMouseUp);
	},


	componentWillUnmount() {
		document.getElementById('content-wrapper').removeEventListener('mouseup', this.onMouseUp);
	},

	getAncestorText: function(child) {
		let node = child;
		while (node !== null) {
			if (node.nodeName === 'P') {
				return node.innerText;
			}
			node = node.parentNode;
		}
		return null;
	},

	onMouseUp: function(event) {
		const container = document.getElementById('content-wrapper');
		const offsetTop = container.parentNode.style.top ? parseInt(container.parentNode.style.top, 10) : 0;
		const yLocOffset = document.body.scrollTop + document.documentElement.scrollTop + container.scrollTop - offsetTop - 32;
		
		const selection = Rangy.getSelection();
		if (selection.isCollapsed) { return this.setState({ popupVisible: false }); }

		// let range;
		// try { range = selection.getRangeAt(0);
		// } catch (err) { console.log('caught range error', err); return null; }
		const range = selection.getRangeAt(0);
		const boundingBox = range.nativeRange.getBoundingClientRect();
		const ancestorText = this.getAncestorText(range.commonAncestorContainer);
		const highlightObject = textQuote.fromRange(container, range);
		
		return this.setState({
			popupVisible: true,
			xLoc: (boundingBox.left + boundingBox.right) / 2,
			yLoc: (boundingBox.bottom + yLocOffset),
			ancestorText: ancestorText,
			highlightObject: highlightObject
		});

	},
	

	saveHighlight: function() {
		const container = document.getElementById('content-wrapper');
		const highlightObject = this.state.highlightObject;
		const textQuoteRange = textQuote.toRange(container, highlightObject);
		const renderer = new Marklib.Rendering(document, { className: 'highlight' }, document);
		renderer.renderWithRange(textQuoteRange);
		this.setState({
			popupVisible: false,
			ancestorText: false,
			highlightObject: undefined,
		});
	},

	getPluginPopupLoc: function() {
		return {
			top: this.state.yLoc,
			left: this.state.xLoc,
		};
	},

	render: function() {
		const loggedIn = true;
		return (
			<div style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.popupVisible && styles.pluginPopupVisible]}>

				<div style={styles.pluginPopupArrow} />
				<div style={styles.pluginContent}>
					
					<div>
						{loggedIn &&
							<button className={'pt-button pt-minimal'} onClick={this.saveHighlight}>Create Highlight</button> 
						}
						{!loggedIn &&
							<Link to={'/login'} className={'pt-button pt-minimal'}>Login to Create Highlight</Link>
						}
					</div>

				</div>
			</div>
		);

	}
});

export default Radium(Highlighter);

styles = {
	pluginPopup: {
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
		// marginLeft: -173,
		marginLeft: -23,
		marginTop: -5,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
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
		zIndex: 5,
	},
};
