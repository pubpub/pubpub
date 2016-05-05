import ReactDOM from 'react-dom';
import React, {PropTypes} from 'react';
import Radium from 'radium';
import {checkEqualPositions, checkFirstPosition} from './utils/codeMirrorHelpers';
import {debounce} from 'lodash';
import Portal from 'react-portal';

const MarkdownPopover = React.createClass({
	propTypes: {
		cm: PropTypes.object,
		activeRange: PropTypes.object,
	},
	getInitialState: function() {
		return ({x: 0, y: 0, hidden: true, bold: false, italic: false, underline: false});
	},
	componentDidMount: function() {
		this.selectionChange = _.debounce(this._selectionChange, 250);
		this.props.cm.on('beforeSelectionChange', this.selectionChange);
	},
	replaceText: function(replacer) {
		const range = this.state.activeRange;
		// const text = this.props.cm.getRange(range.from, range.to);
		const text = this.props.cm.getSelection();
		const newText = replacer(text);
		// this.props.cm.replaceRange(newText, range.from, range.to);
		this.props.cm.replaceSelection(newText, "around");
	},
	bold: function() {
		this.replaceText((text) => {
			const start = text.slice(0,2);
			const end = text.slice(-2);
			if (start === '**' && end === '**') {
				this.setState({bold: false});
				return text.slice(2, text.length - 2);
			}
			this.setState({bold: true});
			return `**${text}**`;
		});
	},
	italic: function() {
		this.replaceText((text) => {
			const start = text.slice(0,1);
			const end = text.slice(-1);
			if (start === '*' && end === '*') {
				this.setState({italic: false});
				return text.slice(1, text.length - 1);
			}
			this.setState({italic: true});
			return `*${text}*`;
		});
	},
	underline: function() {
		this.replaceText((text) => {
			const start = text.slice(0,1);
			const end = text.slice(-1);
			if (start === '_' && end === '_') {
				this.setState({underline: false});
				return text.slice(1, text.length - 1);
			}
			this.setState({underline: true});
			return `_${text}_`;
		});
	},

	_selectionChange(evt, changes) {
		if (changes && changes.ranges && changes.ranges.length > 0) {
			const anchor = changes.ranges[0].anchor;
			const head = changes.ranges[0].head;

			if (checkEqualPositions(anchor, head)) {
				this.setState({hidden: true, activeRange: null});
				return;
			}

			let coords;

			if (checkFirstPosition(anchor,head)) {
				coords = this.props.cm.charCoords(anchor, 'page');
			} else {
				coords = this.props.cm.charCoords(head, 'page');
			}
			 this.props.cm.charCoords(anchor, 'page');
			const x = coords.left;
			const y = coords.top;
			this.setState({x, y, hidden: false});
		}
	},


	render: function() {

		const dynamicPosition = {
			top: this.state.y - 32,
			left: this.state.x - 25,
			display: (this.state.hidden) ? 'none' : 'block'
		};

		return (
			<Portal isOpened={true}>
				<div style={[styles.popoverStyle, dynamicPosition]}>
					<span key="bold" style={[styles.formattingOption, styles.bold]} onClick={this.bold}>B</span>
					<span key="italics" style={[styles.formattingOption, styles.italic]} onClick={this.italic}>I</span>
					<span key="underline" style={[styles.formattingOption, styles.underline]} onClick={this.underline}>U</span>
				</div>
			</Portal>
		);
	}
});

const popUpward = Radium.keyframes({
  '0%': {
		transform: 'matrix(0.97,0,0,1,0,12)',
		opacity: 0,
	},
	'20%': {
		transform: 'matrix(0.99,0,0,1,0,2)',
		opacity: 0.7,
	},
	'40%': {
		transform: 'matrix(1,0,0,1,0,-1)',
		opacity: 1,
	},
	'70%': {
		transform: 'matrix(1,0,0,1,0,0)',
		opacity: 1,
	},
	'100%': {
		transform: 'matrix(1,0,0,1,0,0)',
		opacity: 1,
	},
}, 'popupwards');


const styles = {
	popoverStyle: {
		position: 'fixed',
		backgroundColor: '#2C2A2B',
		zIndex: 100,
		animation: 'x 180ms forwards linear',
		// animation: 'x 1s linear infinite',
		animationName: popUpward,
		padding: '5px 10px',
		borderRadius: '2px',
	},
	formattingOption: {
		padding: '5px 15px',
		color: '#F3F3F4',
		cursor: 'pointer',
		transition: 'all .2s ease-out',
		':hover': {
			color: '#2C2A2B',
			backgroundColor: '#F3F3F4',
		},
	},
	bold: {
		fontWeight: '700'
	},
	italic: {
		fontStyle: 'italic',
	},
	underline: {
		textDecoration: 'underline'
	},
};


export default Radium(MarkdownPopover);
