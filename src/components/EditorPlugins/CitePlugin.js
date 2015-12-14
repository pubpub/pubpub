import React, {PropTypes} from 'react';
import Radium from 'radium';
import {srcRef} from './pluginProps';
import ErrorMsg from './ErrorPlugin';

export const citeOptions = {srcRef};

let styles = {};

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
			html = <ErrorMsg>Could not find reference.</ErrorMsg>;
		}	else {
			const title = this.props.reference.title;
			const author = this.props.reference.author;
			const year = this.props.reference.year;

			const show = this.state.expanded || this.state.hover;
			const titleStyle = show && ((this.state.expanded && styles.expanded) || (this.state.hover && styles.hover));

			let expandedElem = null;
			if (show) {
				expandedElem = (<span style={[styles.show, titleStyle]} onClick={this.onClick} onMouseOut={this.mouseOut} >
					<span style={[styles.author]}>({author} , {year})</span> <br/>
					<span style={[styles.title]}>{title}</span>
					<img style={[styles.img]} src="https://pbs.twimg.com/media/CWLFL0UUsAEtuij.png"></img>
					<a target="_blank" href="http://physics.gu.se/~frtbm/joomla/media/mydocs/Kramers.pdf">Source</a>
				  &nbsp;&nbsp;<a target="_blank" href="http://physics.gu.se/~frtbm/joomla/media/mydocs/Kramers.pdf" >Copy Citation</a>

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

const expandedHeight = '150px';
const expandedWidth = '350px';
const hoverWidth = '150px';
const hoverHeight = '50px';


const pulseKeyframes = Radium.keyframes({
	'0%': {width: '10px', height: '17px', color: 'rgba(0,0,0,0)'},
	'90%': {width: hoverWidth, height: hoverHeight, color: 'rgba(0,0,0,0)'},
	'100%': {width: hoverWidth, height: hoverHeight, color: 'black'},
}, 'Spinner');

const expandFrames = Radium.keyframes({
	'0%': {width: hoverWidth, height: hoverHeight},
	'100%': {width: expandedWidth, height: expandedHeight}
}, 'Spinner');

styles = {
	ref: {
		'cursor': 'pointer',
		'position': 'relative',
		'overflow': 'visible',
		'display': 'inline-block'
	},
	img: {
		'width': expandedWidth
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
		borderColor: '#ddd',
		borderStyle: 'solid',
		borderWidth: '1.5px',
		padding: '5px',
		textOverflow: 'ellipsis',
		fontSize: '0.75em',
		overflow: 'hidden',
		marginTop: '-17px',
		// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	},
	expanded: {
		height: expandedHeight,
		width: expandedWidth,
		animation: `${expandFrames} 0.5s ease 0s 1`,
	},
	hover: {
		height: hoverHeight,
		width: hoverWidth
	}
};


export default Radium(CitePlugin);
