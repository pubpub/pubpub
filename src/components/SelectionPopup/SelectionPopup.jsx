import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

import {FormattedMessage} from 'react-intl';

// import {isDescendantOfHash, getAncestorText} from './selectionFunctions';

function getAncestorText(child) {
	let node = child;
	while (node !== null) {
		if (node.className === 'p-block') {
			return node.innerText;
		}
		node = node.parentNode;
	}
	return null;
}


function isDescendantOfHash(child) {
	let node = child;
	while (node !== null) {
		if (node.dataset && node.dataset.hash) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

let Marklib = undefined;
let Rangy = undefined;

let styles = {};

const SelectionPopup = React.createClass({
	propTypes: {
		addSelectionHandler: PropTypes.func,
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
		// We only trigger the selectionPopup for elements that have a data-hash'd ancestor.
		let clickX;
		let clickY;
		const element = document.getElementsByClassName('pubScrollContainer')[0];
		const offsetTop = element.parentNode.style.top ? parseInt(element.parentNode.style.top, 10) : 0;
		if (event.pageX || event.pageY) {
			clickX = event.pageX - element.getBoundingClientRect().left;
			clickY = event.pageY + element.scrollTop - offsetTop;
		} else {
			clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - element.getBoundingClientRect().left;
			clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop + element.scrollTop - offsetTop;
		}

		const selection = Rangy.getSelection();
		let range;
		try {
			range = selection.getRangeAt(0);
		} catch (err) {
			console.log('caught range error', err);
			return;
		}
		// console.log(range);
		// console.log(range.commonAncestorContainer);

		if (!selection.isCollapsed && isDescendantOfHash(range.commonAncestorContainer)) {

			Rangy.getSelection().expand('word');
			const ancestorText = getAncestorText(range.commonAncestorContainer);
			// console.log(ancestorText);
			this.setState({
				popupVisible: true,
				xLoc: clickX,
				yLoc: clickY,

				range: Rangy.getSelection().getRangeAt(0),
				selectionText: Rangy.getSelection().toString(),
				ancestorText: ancestorText,

			});

		} else {
			this.setState({
				popupVisible: false,
			});
		}

	},

	replacePathWithHash: function(path) {
		let newPath = '';

		const splitOnSemicolonArray = path.split(';');

		if (splitOnSemicolonArray.length === 2) {
			newPath = ';' + splitOnSemicolonArray[1];
		}

		const chunkedPath = splitOnSemicolonArray[0].split('>');
		for (let index = chunkedPath.length; index--;) {
			const tempPath = chunkedPath.slice(0, index + 1).join('>');
			const tempElement = document.querySelector(tempPath);
			if (tempElement.dataset && tempElement.dataset.hash) {
				newPath = '[data-hash="' + tempElement.dataset.hash + '"]' + newPath;
				break;
			} else {
				newPath = '>' + chunkedPath[index] + newPath;
			}
		}

		return newPath;
	},

	onHighlightSave: function() {
		const renderer = new Marklib.Rendering(document, {className: 'tempHighlight'}, document);
		const result = renderer.renderWithRange(this.state.range);

		// Note - these containers will fail if identical paragraphs or list-items exist (they'll have an identical hash).
		const newStartContainer = this.replacePathWithHash(result.startContainerPath);
		const newEndContainer = this.replacePathWithHash(result.endContainerPath);

		const highlightObject = {
			text: this.state.selectionText,
			context: this.state.ancestorText,

			startContainerPath: newStartContainer,
			endContainerPath: newEndContainer,
			startOffset: result.startOffset,
			endOffset: result.endOffset
		};

		this.props.addSelectionHandler(highlightObject);

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
					<div key={'addToComment Button'} style={styles.button} onClick={this.onHighlightSave}>
						<FormattedMessage id="pub.addToComment" defaultMessage="Add to Comment"/>
					</div>
				</div>
			</div>
		);

	}
});

export default Radium(SelectionPopup);

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
