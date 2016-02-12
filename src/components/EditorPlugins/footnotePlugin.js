import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
// import ErrorMsg from './ErrorPlugin';
// import {Reference} from '../';
import createPubPubPlugin from './PubPub';
import Portal from './_parentPortal.js';

let styles = {};


const FootnoteInputFields = [
	{title: 'footnote', type: 'textArea', params: {placeholder: 'Footnote you want to share.'}},
	{title: 'placement', type: 'radio', params: {choices: ['bottom', 'right']}},
	{title: 'reference', type: 'reference'},
];

const FootnoteConfig = {
	title: 'footnote',
	inline: true,
	autocomplete: true,
	color: 'rgba(245, 245, 169, 0.5)',
	prerender: function(globals, pluginProps) {
		if (!globals.asideCount) {
			globals.asideCount = 1;
		} else {
			globals.asideCount = globals.asideCount + 1;
		}
		pluginProps.count = globals.asideCount;
		return {globals, pluginProps};
	}
};


const FootnotePlugin = React.createClass({
	propTypes: {
		reference: PropTypes.object,
		footnote: PropTypes.string,
		placement: PropTypes.string,
		children: PropTypes.string,
		error: PropTypes.string,
		count: PropTypes.number
	},
	getInitialState: function() {
		return {
			hover: false,
			clicked: false
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
	scrollToAside: function() {
		const asideNode = ReactDOM.findDOMNode(this.refs.aside);
		this.setState({clicked: !this.state.clicked});
		if (asideNode && asideNode.scrollIntoViewIfNeeded) {
			asideNode.scrollIntoViewIfNeeded({block: 'start', behavior: 'smooth'});
		}
	},
	componentDidMount: function() {
		if (!this.props.placement || this.props.placement === 'bottom') {
			const node = ReactDOM.findDOMNode(this);
			this.refs.portal.mountOnNode(node);
		}
	},
	render: function() {
		const count = (this.props.count) ? this.props.count : 0;

		if (this.props.error) {
			return <span/>;
		}

		let contentElem;

		if (this.props.placement && this.props.placement === 'right') {
			contentElem = (<div ref="aside" style={styles.asideBox(this.state.hover || this.state.clicked)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.count(this.state.hover)}>{count}</span>.&nbsp;{this.props.footnote}
			</div>);
		} else {
			contentElem = (<Portal portalId={`asidePortal${count}`} ref="portal">
			<div ref="aside" style={styles.aside(this.state.hover || this.state.clicked)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.count(this.state.hover)}>{count}</span>.&nbsp;{this.props.footnote}
			</div>
			</Portal>);
		}

		return (
			<span>
				<sup style={styles.ref(this.state.hover || this.state.clicked)} ref="ref"
				onClick={this.scrollToAside} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					{count}
				</sup>
				{contentElem}
			</span>
		);
	}
});

styles = {
	asideBox: function(highlight) {
		return {
			width: '100px',
			fontSize: '0.65em',
			backgroundColor: 'white',
			float: 'right',
			border: '#D8D8D8 dashed 1px',
			position: 'relative',
			left: '3vw',
			marginLeft: '-2.5vw',
			marginTop: '20px',
			marginBottom: '20px',
			// width: '100px',
			padding: '1em 3px 1em 3px',
			lineHeight: '1.3em',
		};
	},
	count: function(highlight) {
		return {
			fontWeight: (highlight) ? '700' : '400',
		};
	},
	aside: function(highlight) {
		// float: 'right',
		// border: '#D8D8D8 solid 1px'
		return {
			fontSize: '0.75em',
			backgroundColor: (highlight) ? 'rgba(245, 238, 185, 0.6)' : 'white',
			// position: 'relative',
			// left: '5vw',
			// marginLeft: '-5vw',
			// width: '100px',
			padding: '5px 3px 10px 10px',
		};
	},
	ref: function(highlight) {
		return {
			fontWeight: '700',
			backgroundColor: (highlight) ? 'rgba(245, 238, 185, 0.6)' : 'white',
			cursor: 'pointer',
			padding: '0px 3px 0px 3px'
		};
	},

};


export default createPubPubPlugin(FootnotePlugin, FootnoteConfig, FootnoteInputFields);
