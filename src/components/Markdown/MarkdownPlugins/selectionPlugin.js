import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import Radium, {Style} from 'radium';
import smoothScroll from 'utils/smoothscroll';

import {FormattedMessage} from 'react-intl';

const InputFields = [
	{title: 'source', type: 'selection', params: {}},
];

const Config = {
	title: 'highlight',
	inline: true,
	autocomplete: false,
	preview: false,
};

let styles;
let Marklib;

const EditorWidget = (inputProps) => {
	let content;
	if (!inputProps.source || !inputProps.source.text) {
		content = 'No highlight';
	} else if (inputProps.source.text.length > 30) {
		content = '"' + inputProps.source.text.substring(0, 29) + '...' + '"';
	} else {
		content = '"' + inputProps.source.text + '"';
	}
	return (<span>Highlight: {content}</span>);
};


const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
		index: PropTypes.string,
		source: PropTypes.object,
	},

	componentDidMount() {
		Marklib = require('marklib');

		// Timeout is to let DOM elements draw first, so they exist since everything will initially 'mount' at the same time
		setTimeout(()=>{
			this.drawHighlight();
		}, 10);
	},

	getInitialState: function() {
		return {
			showContext: false,
		};
	},

	drawHighlight: function() {
		const selection = this.props.source;
		try {
			const result = {
				startContainerPath: selection.startContainerPath,
				endContainerPath: selection.endContainerPath,
				startOffset: selection.startOffset,
				endOffset: selection.endOffset,
			};

			// const version = parseInt(selection.sourceVersion, 10);
			const renderer = new Marklib.Rendering(document, {className: 'selection selection-' + selection._id}, document);
			renderer.renderWithResult(result);


			renderer.on('click', (item)=> {
				// Find element with selectionPreviousDraft
				// Find parent, until we get the root
				// modify css
				// Add listener that can reset css

				let currentNode = document.getElementById('selection-block-' + selection._id); // The selection block
				while (currentNode.parentNode.className !== 'pub-discussions-wrapper') {
					currentNode = currentNode.parentNode;
				}

				console.log(currentNode);

				function ontheClick(evt) {
					console.log(evt);
					console.log('contains ', currentNode.contains(evt.target));
					if (currentNode.contains(evt.target)) { return; }

					console.log('inside the click');
					currentNode.style.backgroundColor = '';
					currentNode.style.position = '';
					currentNode.style.right = '';
					currentNode.style.zIndex = '';
					currentNode.style.top = '';
					currentNode.style.padding = '';
					currentNode.style.boxShadow = '';

					currentNode.style.opacity = '';
					currentNode.style.transition = '';
					window.removeEventListener('click', ontheClick);
				}
				setTimeout(()=>{
					// Timeout so that the eventListener doesn't fire on this click eventListener bubbling up
					// window.removeEventListener('click', ontheClick);
					const destY = this.getPosition(item.target).yloc;
					currentNode.style.backgroundColor = '#F0F0F0';
					currentNode.style.position = 'absolute';
					currentNode.style.right = '50px';
					currentNode.style.zIndex = '20';
					currentNode.style.top = (destY - 50) + 'px';
					currentNode.style.padding = '10px';
					currentNode.style.boxShadow = '0px 0px 6px #444';
					currentNode.style.opacity = '0';
					setTimeout(()=>{
						currentNode.style.transition = '.1s linear opacity';
						setTimeout(()=>{
							currentNode.style.opacity = '1';
						}, 1);
					}, 1);

					window.addEventListener('click', ontheClick);
				}, 1);

				// document.handleHighlightClick(selection);
				// const selectionElement = document.getElementById('selection-block-' + selection._id);
				// const selectionY = this.getPosition(selectionElement).yloc; // The y-coord of where it is by default
				// const destY = this.getPosition(item.target).yloc; // The y-coord of where it needs to be
				// const scrollAmount = destY - selectionY;
				//
				// const discussions = document.getElementById('pub-discussions-wrapper');
				// discussions.style.webkitTransform = 'translateY(' + scrollAmount + 'px)';
				// discussions.style.MozTransform = 'translateY(' + scrollAmount + 'px)';
				// discussions.style.msTransform = 'translateY(' + scrollAmount + 'px)';
				// discussions.style.OTransform = 'translateY(' + scrollAmount + 'px)';
				// discussions.style.transform = 'translateY(' + scrollAmount + 'px)';


				// const context = version ? document.getElementsByClassName('rightBar')[0] : document.getElementsByClassName('commentsRightBar')[0];
				// smoothScroll(destination, 500, ()=>{}, context, -25);
			});
			renderer.on('hover-enter', function(item) {
				const destination = document.getElementById('selection-block-' + selection._id);
				destination.className = destination.className.replace('selection-block', 'selection-block-active');
			});
			renderer.on('hover-leave', function(item) {
				const destination = document.getElementById('selection-block-' + selection._id);
				destination.className = destination.className.replace('selection-block-active', 'selection-block');
			});

		} catch (err) {
			if (__DEVELOPMENT__) {
				console.log('selection', err);
			}
		}
	},

	scrollToHighlight: function() {
		const destination = document.getElementsByClassName('selection-' + this.props.source._id)[0];
		smoothScroll(destination, 500, ()=>{});
		this.hoverOff();

		// // If we're on the editor, and we can't find the selectoin, redraw.
		// // if (parseInt(this.props.source.sourceVersion, 10) === 0 && !destination) {
		// // 	this.drawHighlight();
		// // 	destination = document.getElementsByClassName('selection-' + this.props.source._id)[0];
		// // }
		// const selectionElement = document.getElementById('selection-block-' + this.props.source._id);
		// const selectionY = this.getPosition(selectionElement).yloc; // The y-coord of where it is by default
		// const destY = this.getPosition(destination).yloc; // The y-coord of where it needs to be
		// const scrollAmount = destY - selectionY;
		//
		// const discussions = document.getElementById('pub-discussions-wrapper');
		// discussions.style.webkitTransform = 'translateY(' + scrollAmount + 'px)';
		// discussions.style.MozTransform = 'translateY(' + scrollAmount + 'px)';
		// discussions.style.msTransform = 'translateY(' + scrollAmount + 'px)';
		// discussions.style.OTransform = 'translateY(' + scrollAmount + 'px)';
		// discussions.style.transform = 'translateY(' + scrollAmount + 'px)';
		//
		// if (!selectionElement) {
		// 	this.setState({showContext: !this.state.showContext});
		// } else {
		// 	// const context = document.getElementsByClassName('pubScrollContainer')[0];
		// 	// const context = document;
		// 	// smoothScroll(selectionElement, 250, ()=>{}, context);
		// 	smoothScroll(destination, 500, ()=>{}, null, -60);
		// 	// smoothScroll(destination, 250, ()=>{});
		// }

	},

	getPosition: function(element) {
		let xPos = 0;
		let yPos = 0;
		let thisElem = element;
		while (thisElem) {
			// for all other non-BODY elements
			xPos += (thisElem.offsetLeft + thisElem.clientLeft);
			yPos += (thisElem.offsetTop + thisElem.clientTop);

			thisElem = thisElem.offsetParent;
		}
		return {
			xloc: xPos,
			yloc: yPos
		};
	},


	hoverOn: function() {
		const items = document.getElementsByClassName('selection-' + this.props.source._id);

		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection ', 'selection selection-active ');
		}

	},
	hoverOff: function() {
		const items = document.getElementsByClassName('selection-' + this.props.source._id);

		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection selection-active ', 'selection ');
		}
	},

	toggleContext: function() {
		const selectionElement = document.getElementsByClassName('selection-' + this.props.source._id)[0];
		this.setState({
			showContext: !this.state.showContext,
			canScroll: selectionElement,
		});

	},

	calculateOffsets: function() {
		if (!this.props.source.context || !this.props.source.text) {
			return [null, null];
		}

		const contextString = this.props.source.context.substring(this.props.source.startOffset, this.props.source.endOffset);

		// If the substring based on our offsets does not match the selection text...
		if (contextString !== this.props.source.text) {
			try {
				const selectionRegex = new RegExp(this.props.source.text, 'g');
				const count = (this.props.source.context.match(selectionRegex) || []).length;

				// If there is more than one occurence of the selection string in the context,
				// we can't recover it right now - so just don't highlight anything
				if (count > 1) {
					return [null, null];
				}

				// otherwise, find where the string actually lives, and use those as offsets.
				const indexOf = this.props.source.context.indexOf(this.props.source.text);
				return [indexOf, indexOf + this.props.source.text.length];
			} catch (err) {
				return [null, null];
			}

		}

		// If the contextString matches, return our original offsets
		return [this.props.source.startOffset, this.props.source.endOffset];

	},

	render: function() {
		if (!this.props.source) {
			return null;
		}

		const offsets = this.calculateOffsets();
		return (
			<div
				id={'selection-block-' + this.props.source._id}
				className={'selection-block'}
				key={'selection-block-' + this.props.source._id}
				style={styles.selectionBlock}
				onClick={this.toggleContext}
				onMouseEnter={this.hoverOn}
				onMouseLeave={this.hoverOff}>

					<Style rules={{
						'.selection-block': {
							boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
							transition: '.05s linear box-shadow, .05s linear transform',
							backgroundColor: 'rgba(255,255,255,0.65)',
						},
						'.selection-block-active': {
							boxShadow: '0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)',
							transition: '.05s linear box-shadow, .05s linear transform',
							transform: 'translateX(-5px)',
							backgroundColor: 'rgba(195, 245, 185, 0.6)',
						},
					}} />

					{/* <span style={styles.quotationMark}>“</span> */}

					{/* Show the context if this.state.showcontext is true */}
					<div style={[this.state.showContext === false && {display: 'none'}]}>
						<div style={styles.versionHeader}>
							{parseInt(this.props.source.sourceVersion, 10) === 0
								? <FormattedMessage id="discussion.selectionPreviousDraft" defaultMessage="Selection made on draft version"/>
								: <FormattedMessage id="discussion.selectionPreviousVersion" defaultMessage="Selection made on Version {version}" values={{version: this.props.source.sourceVersion}}/>
							}
						</div>
						{offsets[0] === null
							? this.props.source.context
							: <span>
								{this.props.source.context.substring(0, offsets[0])}
								<span style={styles.highlight}>{this.props.source.text}</span>
								{this.props.source.context.substring(offsets[1], this.props.source.context.length)}
							</span>
						}
						{this.state.canScroll
							? <div style={styles.contextFooter} onClick={this.scrollToHighlight}><FormattedMessage id="discussion.selectionScrollToHighlight" defaultMessage="Scroll to highlight in Pub"/></div>
							: null
						}
					</div>

					{/* Show just the highlight text if this.state.showcontext is false */}
					<span style={[this.state.showContext === true && {display: 'none'}]}>{this.props.source.text}</span>

			</div>
		);
	}
});

styles = {
	selectionBlock: {
		borderRadius: '1px',
		padding: '10px 8px',
		color: '#5B5B5B',
		cursor: 'pointer',
		margin: '5px 0px 15px 0px',
		fontStyle: 'italic',
		fontSize: '0.9em',
	},
	highlight: {
		backgroundColor: 'rgba(195, 245, 185, 0.6)',
	},
	versionHeader: {
		textAlign: 'center',
		borderBottom: '1px dashed #ddd',
		paddingBottom: '8px',
		marginBottom: '8px',
		fontStyle: 'initial',
		color: '#777',
		fontSize: '0.85em',
	},
	contextFooter: {
		textAlign: 'center',
		borderTop: '1px dashed #ddd',
		paddingTop: '8px',
		marginTop: '8px',
		fontStyle: 'initial',
		color: '#777',
		fontSize: '0.85em',
	},
	// quotationMark: {
	// 	fontSize: '2em',
	// 	fontFamily: 'serif',
	// },
};

export default createPubPubPlugin(Radium(Plugin), Config, InputFields, EditorWidget);
