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

			html = (
				<span style={[styles.ref]} onClick={this.onClick} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					[{this.props.count}]
					<span style={[show && styles.show, !show && styles.hidden, titleStyle]}>
						<span style={[styles.author]}>({author} , {date})</span> -
						<span style={[styles.title]}>{title}</span>
					</span>
				</span>
			);
		}
		return html;
	}
});


styles = {
	ref: {
		'cursor': 'pointer',
		'position': 'relative',
		'overflow': 'visible'
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
		marginLeft: '61px',
		marginTop: '-17px',
		// transition: 'width 0.5s ease 0.1s, color 0.5s ease 0.5s'
	},
	expanded: {
		height: '150px',
		width: '150px'
	},
	hover: {
		height: '50px',
		width: '150px'
	}
};


export default Radium(CitePlugin);
