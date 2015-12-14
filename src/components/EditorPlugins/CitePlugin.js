import React, {PropTypes} from 'react';
import Radium from 'radium';
import {srcRef} from './pluginProps';

export const citeOptions = {srcRef};

let styles = {};

// let styles = {};
const CitePlugin = React.createClass({
	propTypes: {
		reference: PropTypes.object,
		ref: PropTypes.string,
		children: PropTypes.string,
		count: PropTypes.number
	},
	getInitialState: function() {
		return {hover: false, expanded: false};
	},
	mouseOver: function() {
		this.setState({hover: true});
	},
	mouseOut: function() {
		this.setState({hover: false});
	},
	onClick: function() {
		this.setState({expanded: !this.state.expanded, hover: !this.state.expanded});
	},
	render: function() {
		const ref = !(this.props.reference === 'error:type');
		let html;

		if (!ref) {
			html = <span>[COULD NOT FIND REFERENCE]</span>;
		}	else {
			const title = this.props.reference.title;
			const author = this.props.reference.author;
			const date = this.props.reference.date;

			const show = this.state.expanded || this.state.hover;
			const titleStyle = show && ((this.state.expanded && styles.expanded) || (this.state.hover && styles.hover));

			console.log(this.props.reference);
			console.log(titleStyle);

			let expandedElem = null;
			if (show) {
				expandedElem = (<span style={[styles.show, titleStyle]} onClick={this.onClick} onMouseOut={this.mouseOut} >
					<span style={[styles.author]}>({author} , {date})</span> -
					<span style={[styles.title]}>{title}</span>
				</span>);
			}

			html = (
				<span style={[styles.ref]} onClick={this.onClick} onMouseOver={this.mouseOver}>
					[{this.props.count}]
					{expandedElem}
				</span>
			);
		}
		return html;
	}
});


const pulseKeyframes = Radium.keyframes({
	'0%': {width: '10px', height: '17px', color: 'rgba(0,0,0,0)'},
	'90%': {width: '150px', height: '50px', color: 'rgba(0,0,0,0)'},
	'100%': {width: '150px', height: '50px', color: 'black'},
}, 'Spinner');

const expandFrames = Radium.keyframes({
	'0%': {width: '150px', height: '50px'},
	'100%': {width: '250px', height: '150px'}
}, 'Spinner');

styles = {
	ref: {
		'cursor': 'pointer',
		'position': 'relative',
		'overflow': 'visible',
		'display': 'inline-block'
	},
	img: {
		'width': '250px'
	},
	hidden: {
		display: 'none',
		// width: '0px',
		// color: 'rgba(0,0,0,0)',
		// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	},
	author: {
		fontStyle: 'italic'
	},
	title: {
		WebkitLineClamp: 2,
		overflow: 'hidden'
	},
	show: {
		// opacity: '1',
		// color: 'rgba(0,0,0,1.0)',
		animation: `${pulseKeyframes} 0.5s ease 0s 1`,
		display: 'block',
		position: 'absolute',
		zIndex: 100000,
		backgroundColor: 'white',
		borderColor: '#666',
		borderStyle: 'solid',
		borderWidth: '1px',
		padding: '5px',
		textOverflow: 'ellipsis',
		fontSize: '0.75em',
		overflow: 'hidden',
		marginTop: '-17px',
		// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	},
	expanded: {
		height: '150px',
		width: '250px',
		animation: `${expandFrames} 0.5s ease 0s 1`,
	},
	hover: {
		height: '50px',
		width: '150px'
	}
};


export default Radium(CitePlugin);
