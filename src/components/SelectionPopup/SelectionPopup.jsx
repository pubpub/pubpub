import Radium, {Style} from 'radium';
import React, {PropTypes} from 'react';
import {markdownParser, markdownSerializer, schema} from 'components/AtomTypes/Document/proseEditor';
import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';
import {globalStyles} from 'utils/styleConstants';

let Marklib = undefined;
let Rangy = undefined;

let styles = {};
let pm;

export const SelectionPopup = React.createClass({
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
			popupEditor: false,
			highlightObject: undefined,
		};
	},

	componentDidMount() {
		Marklib = require('marklib');
		Rangy = require('rangy');
		require('rangy/lib/rangy-textrange.js');
		document.getElementById('atom-viewer').addEventListener('mouseup', this.onMouseUp);

		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('components/AtomTypes/Document/proseEditor/pubpubSetup');

		const place = document.getElementById('highlight-reply');
		if (!place) { return undefined; }
		pm = new prosemirror.ProseMirror({
			place: place,
			schema: schema,
			plugins: [pubpubSetup.config({menuBar: false, tooltipMenu: false})],
			doc: null,
		});

	},


	componentWillUnmount() {
		document.getElementById('atom-viewer').removeEventListener('mouseup', this.onMouseUp);
	},

	isDescendantOfHash: function(child) {
		let node = child;
		while (node !== null) {
			if (node.dataset && node.dataset.hash) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	},

	getAncestorText: function(child) {
		let node = child;
		while (node !== null) {
			if (node.className === 'p-block') {
				return node.innerText;
			}
			node = node.parentNode;
		}
		return null;
	},

	onMouseUp: function(event) {
		// We only trigger the selectionPopup for elements that have a data-hash'd ancestor.
		let clickX;
		let clickY;
		const element = document.getElementById('atom-viewer');
		const offsetTop = element.parentNode.style.top ? parseInt(element.parentNode.style.top, 10) : 0;
		if (event.pageX || event.pageY) {
			clickX = event.pageX - element.getBoundingClientRect().left;
			clickY = event.pageY + element.scrollTop - offsetTop - 39;
		} else {
			clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - element.getBoundingClientRect().left;
			clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop + element.scrollTop - offsetTop - 39;
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

		if (!selection.isCollapsed && this.isDescendantOfHash(range.commonAncestorContainer) && !this.state.popupEditor) {

			Rangy.getSelection().expand('word');
			const ancestorText = this.getAncestorText(range.commonAncestorContainer);
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
				popupVisible: this.state.popupEditor || false,
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

	enableEditor: function() {
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

		this.setState({
			popupEditor: true,
			highlightObject: highlightObject,
		});
		pm.focus();
	},
	disableEditor: function() {
		this.setState({
			popupEditor: false,
			popupVisible: false,
			highlightObject: undefined,
		});
		this.clearTempHighlights();
		this.clearTempHighlights();
		pm.setDoc(markdownParser.parse(''));
	},

	onHighlightSave: function() {
		// const renderer = new Marklib.Rendering(document, {className: 'tempHighlight'}, document);
		// const result = renderer.renderWithRange(this.state.range);

		// // Note - these containers will fail if identical paragraphs or list-items exist (they'll have an identical hash).
		// const newStartContainer = this.replacePathWithHash(result.startContainerPath);
		// const newEndContainer = this.replacePathWithHash(result.endContainerPath);

		// const highlightObject = {
		// 	text: this.state.selectionText,
		// 	context: this.state.ancestorText,

		// 	startContainerPath: newStartContainer,
		// 	endContainerPath: newEndContainer,
		// 	startOffset: result.startOffset,
		// 	endOffset: result.endOffset
		// };

		const versionContent = {
			docJSON: pm.doc.toJSON(),
			markdown: markdownSerializer.serialize(pm.doc),
		};

		this.props.addSelectionHandler(versionContent, this.state.highlightObject);
		this.setState({
			popupEditor: false,
			popupVisible: false,
			highlightObject: undefined,
		});

		this.clearTempHighlights();
		this.clearTempHighlights();
		pm.setDoc(markdownParser.parse(''));
	},

	clearTempHighlights: function() {
		const tempHighlights = document.getElementsByClassName('tempHighlight');
		for (let index = 0; index < tempHighlights.length; index++) {
			tempHighlights[index].className = '';
		}
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

				<Style rules={{'.plugin-popup .ProseMirror-content': { minHeight: '50px', border: '1px solid #ddd', padding: '0em .5em'} }} />

				<div style={styles.pluginPopupArrow}></div>
				<div style={styles.pluginContent}>
					{!this.state.popupEditor &&
						<div key={'addToComment Button'} style={styles.button} onClick={this.enableEditor}>
							<FormattedMessage id="pub.AddComment" defaultMessage="Add Comment"/>
						</div>
					}


					<div style={[{width: '300px'}, !this.state.popupEditor && {opacity: '0', pointerEvents: 'none', position: 'absolute'}]}>
						<div id="highlight-reply" style={styles.inputWrapper}></div>
						<div className={'button'} style={styles.editorButton} onClick={this.disableEditor}> <FormattedMessage {...globalMessages.Cancel}/> </div>
						<div className={'button'} style={styles.editorButton} onClick={this.onHighlightSave}> <FormattedMessage {...globalMessages.PublishReply}/> </div>
					</div>

				</div>
			</div>
		);

	}
});

export default Radium(SelectionPopup);

styles = {
	inputWrapper: {
		margin: '.5em 0em',
	},
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
	editorButton: {
		marginRight: '1em',
		padding: '.25em 1em',
		fontSize: '.85em',
	},
	clearfix: {
		display: 'table',
		clear: 'both',
	}
};
