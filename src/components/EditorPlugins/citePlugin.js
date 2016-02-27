import React, {PropTypes} from 'react';
import ErrorMsg from './ErrorPlugin';
import {Reference} from '../';
import createPubPubPlugin from './PubPub';

let styles = {};

const CiteInputFields = [
	{title: 'reference', type: 'reference'},
	{title: 'description', type: 'text', params: {placeholder: 'Caption talking about the reference.'}},
];

const CiteConfig = {
	title: 'cite',
	inline: true,
	autocomplete: true,
	color: 'rgba(245, 245, 169, 0.5)',
	prerender: function(globals, pluginProps) {
		if (pluginProps.reference && !isNaN(pluginProps.reference.count)) {
			const referenceCount = pluginProps.reference.count;
			if (!globals.citationCount) {
				globals.citationCountCounter = 1;
				globals.citationCount = {};
			}

			const localCount = globals.citationCount[referenceCount];
			if (!localCount) {
				globals.citationCount[referenceCount] = globals.citationCountCounter;
				globals.citationCountCounter += 1;
			}

			pluginProps.count = globals.citationCount[referenceCount];
		}

		return {globals, pluginProps};
	}
};

// let styles =

const CitePlugin = React.createClass({
	propTypes: {
		reference: PropTypes.object,
		ref: PropTypes.string,
		children: PropTypes.string,
		error: PropTypes.string,
		count: PropTypes.number
	},
	getInitialState: function() {
		return {
			hover: false,
			// expanded: false
		};
	},
	mouseOver: function() {
		// this.hoverTimeout = setTimeout(this.startHover.bind(this), 100);
		this.setState({hover: true});
	},
	mouseOut: function() {
		this.setState({hover: false});
	},
	// onClick: function() {
	// 	this.setState({expanded: !this.state.expanded, hover: !this.state.expanded});
	// },
	// cancelHover: function() {
	// 	if (this.hoverTimeout) {
	// 		clearTimeout(this.hoverTimeout);
	// 		this.hoverTimeout = null;
	// 	}
	// },
	// startHover: function() {
	// 	this.setState({hover: true});
	// },
	// close: function() {
	// 	this.setState({expanded: false, hover: false});
	// },
	render: function() {
		const count = (this.props.count) ? this.props.count : 0;
		if (this.props.error === 'empty') {
			return <span></span>;
		}
		return (
			<span>
				{this.props.error === 'type'
					? <ErrorMsg>Could not find reference.</ErrorMsg>
					: <span style={[styles.ref]} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
						[{count}]
						<span style={[styles.hoverRef, this.state.hover && styles.hoverRefVisible]}>
							<Reference citationObject={this.props.reference} mode={'mla'} />
						</span>

					</span>
				}
			</span>
		);

		// if (this.props.error === 'empty') {
		// 	html = <span></span>;
		// } else if (this.props.error === 'type') {
		// 	html =
		// }	else {
		// 	const title = this.props.reference.title;
		// 	const author = this.props.reference.author;
		// 	const year = this.props.reference.year;

		// 	const show = this.state.expanded || this.state.hover;
		// 	const titleStyle = show && ((this.state.expanded && styles.expanded) || (this.state.hover && styles.hover));

		// 	let expandedElem = null;
		// 	const fakeElem = null;

			/*
			const fakeElem = (<span><img style={[styles.img]} src="https://pbs.twimg.com/media/CWLFL0UUsAEtuij.png"></img>
								<a target="_blank" href="http://physics.gu.se/~frtbm/joomla/media/mydocs/Kramers.pdf">Source</a>
							  &nbsp;&nbsp;
								<a target="_blank" href="http://physics.gu.se/~frtbm/joomla/media/mydocs/Kramers.pdf" >Copy Citation</a></span>);
			*/

			// if (show) {
			// 	expandedElem = (
			// 	<span>
			// 	<span style={[styles.show, titleStyle]} onClick={this.onClick} onMouseOut={this.mouseOut} >
			// 		<span style={[styles.author]}>({author} , {year})</span> <br/>
			// 		<span style={[styles.title]}>{title}</span>
			// 		{fakeElem}
			// 	</span>
			// 	<span style={[styles.cover]} onClick={this.close}></span>
			// 	</span>
			// 	);
			// }

			// html = (
			// 	<span style={[styles.ref]} onClick={this.onClick} onMouseOver={this.mouseOver} onMouseOut={this.cancelHover}>
			// 		[{this.props.count}]
			// 		{expandedElem}
			// 	</span>
			// );
		// }
		// return html;
	}
});

// const expandedHeight = '150px';
// const expandedWidth = '350px';
// const hoverWidth = '150px';
// const hoverHeight = '50px';


// const pulseKeyframes = Radium.keyframes({
// 	'0%': {width: '10px', height: '17px', color: 'rgba(0,0,0,0)'},
// 	'90%': {width: hoverWidth, height: hoverHeight, color: 'rgba(0,0,0,0)'},
// 	'100%': {width: hoverWidth, height: hoverHeight, color: 'black'},
// }, 'Spinner');

// const expandFrames = Radium.keyframes({
// 	'0%': {width: hoverWidth, height: hoverHeight},
// 	'100%': {width: expandedWidth, height: expandedHeight}
// }, 'Spinner');

styles = {
	ref: {
		// cursor: 'pointer',
		// position: 'relative',
		overflow: 'visible',
		display: 'inline-block',
		backgroundColor: 'white'
	},
	hoverRef: {
		display: 'none',
		position: 'absolute',
		backgroundColor: 'white',
		width: 'calc(80% - 20px)',
		left: '10%',
		wordWrap: 'break-word',
		transform: 'translateY(20px)',
		fontSize: '11px',
		boxShadow: '0px 0px 5px rgba(0,0,0,0.7)',
		padding: '10px',


	},
	hoverRefVisible: {
		display: 'inline-block',
	},

	// img: {
	// 	'width': expandedWidth
	// },
	// hidden: {
	// 	display: 'none',
	// 	// width: '0px',
	// 	// color: 'rgba(0,0,0,0)',
	// 	// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	// },
	// author: {
	// 	fontStyle: 'italic'
	// },
	// title: {
	// 	WebkitLineClamp: 2,
	// 	overflow: 'hidden'
	// },
	// cover: {
	// 	position: 'fixed',
	// 	zIndex: 99999,
	// 	left: 0,
	// 	top: 0,
	// 	width: '100vw',
	// 	height: '100vh',
	// 	opacity: 0
	// },
	// show: {
	// 	// opacity: '1',
	// 	// color: 'rgba(0,0,0,1.0)',
	// 	// animation: `${pulseKeyframes} 0.5s ease 0s 1`,
	// 	display: 'block',
	// 	position: 'absolute',
	// 	zIndex: 100000,
	// 	backgroundColor: 'white',
	// 	borderColor: '#ddd',
	// 	borderStyle: 'solid',
	// 	borderWidth: '1.5px',
	// 	padding: '5px',
	// 	textOverflow: 'ellipsis',
	// 	fontSize: '0.75em',
	// 	overflow: 'hidden',
	// 	marginTop: '-17px',
	// 	// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	// },
	// expanded: {
	// 	height: expandedHeight,
	// 	width: expandedWidth,
	// 	// animation: `${expandFrames} 0.5s ease 0s 1`,
	// },
	// hover: {
	// 	height: hoverHeight,
	// 	width: hoverWidth
	// }
};


export default createPubPubPlugin(CitePlugin, CiteConfig, CiteInputFields);
