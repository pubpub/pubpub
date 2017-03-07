/* eslint-disable no-mixed-operators */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router';
import { Button } from '@blueprintjs/core';
import * as textQuote from 'dom-anchor-text-quote';
import Rangy from 'rangy';
require('rangy/lib/rangy-textrange');
import * as Marklib from 'marklib';

import { createHighlight } from './actions';

let styles = {};

export const Highlighter = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
		highlightData: PropTypes.object,
		accountData: PropTypes.object,
		params: PropTypes.object,
		query: PropTypes.object,
		dispatch: PropTypes.func,
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
		const container = document.getElementById('highlighter-wrapper');
		if (!container) { console.log('Error: <Highlighter /> must be a child of a div with id="highlighter-wrapper"'); }
		container.addEventListener('mouseup', this.onMouseUp);
	},


	componentWillUnmount() {
		document.getElementById('highlighter-wrapper').removeEventListener('mouseup', this.onMouseUp);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.highlightData.loading && !nextProps.highlightData.loading && !nextProps.highlightData.error) {
			const container = document.getElementById('highlighter-wrapper');
			const highlightObject = this.state.highlightObject;

			const textQuoteRange = textQuote.toRange(container, highlightObject);
			const renderer = new Marklib.Rendering(document, { className: 'highlight' }, document);
			renderer.renderWithRange(textQuoteRange);

			this.setState({
				popupVisible: false,
				ancestorText: false,
				highlightObject: undefined,
			});
		}

		
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
		const container = document.getElementById('highlighter-wrapper');
		const offsetTop = container.parentNode.style.top ? parseInt(container.parentNode.style.top, 10) : 0;
		const offsetLeft = container.getBoundingClientRect().left || 0;
		const yLocOffset = document.body.scrollTop + document.documentElement.scrollTop + container.scrollTop - offsetTop;
		
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
			xLoc: (boundingBox.left + boundingBox.right) / 2 - offsetLeft,
			yLoc: (boundingBox.top + ((boundingBox.bottom - boundingBox.top) / 2) - container.getBoundingClientRect().top - 20),
			// yLoc: (boundingBox.bottom + 0),
			ancestorText: ancestorText,
			highlightObject: highlightObject
		});

	},
	

	saveHighlight: function() {
		const highlightObject = this.state.highlightObject;

		const query = this.props.query || {};
		const params = this.props.params || {};
		const routeFilename = params.filename;
		const pub = this.props.pubData.pub || {};
		const versions = pub.versions || [];
		
		const currentVersion = versions.sort((foo, bar)=> {
			// Sort so that most recent is first in array
			if (foo.createdAt > bar.createdAt) { return -1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			return 0;
		}).reduce((previous, current, index, array)=> {
			const previousDate = new Date(previous.createdAt).getTime();
			const currentDate = new Date(current.createdAt).getTime();
			if (!previous.id) { return current; } // If this is the first loop
			if (query.version === current.hash) { return current; } // If the query version matches current
			if (!query.version && currentDate > previousDate) { return current; }
			return previous;
		}, {});

		const files = currentVersion.files || [];
		const mainFile = files.reduce((previous, current)=> {
			if (currentVersion.defaultFile === current.name) { return current; }
			if (!currentVersion.defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

		const currentFile = routeFile || mainFile;
		
		const createHighlightObject = {
			pubId: pub.id,
			versionId: currentVersion.id,
			versionHash: currentVersion.hash,
			fileId: currentFile.id,
			fileHash: currentFile.hash,
			fileName: currentFile.name,
			prefix: highlightObject.prefix,
			exact: highlightObject.exact,
			suffix: highlightObject.suffix,
			context: this.state.ancestorText,
		};
		this.props.dispatch(createHighlight(createHighlightObject));
	},

	getPluginPopupLoc: function() {
		return {
			top: this.state.yLoc,
			// left: this.state.xLoc,
			right: -48
		};
	},

	render: function() {
		const loggedIn = !!this.props.accountData.user.id;
		const loading = this.props.highlightData.loading;
		return (
			<div style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.popupVisible && styles.pluginPopupVisible]}>

				{/* <div style={styles.pluginPopupArrow} /> */}
				<div style={styles.pluginContent}>
					
					<div>
						{loggedIn &&
							<Button className={'pt-minimal'} onClick={this.saveHighlight} iconName={'comment'} loading={loading} style={styles.createButton}/>

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

function mapStateToProps(state) {
	return {
		highlightData: state.highlight.toJS(),
		accountData: state.account.toJS(),
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Highlighter));

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
		// padding: 5,
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
	createButton: {
		borderRadius: '2px',
		lineHeight: 1,
		padding: '12px',
		width: '38px',
	},
};
