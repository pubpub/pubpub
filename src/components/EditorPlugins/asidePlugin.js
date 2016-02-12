import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ErrorMsg from './ErrorPlugin';
import {Reference} from '../';
import createPubPubPlugin from './PubPub';

let styles = {};

function getParentByClassName(node, classname) {
	let parent;
	if (node === null || classname === '') return null;
	parent = node.parentNode;
	// const className = classname.toUpperCase();

	while (parent) {
		if (parent.className.indexOf(classname) !== -1) {
			return parent;
		}
		parent = parent.parentNode;
	}

	return parent;
}


const Portal = React.createClass({
	propTypes: {
		children: PropTypes.string,
	},
	render: () => null,
	portalElement: null,
	parentNode: null,
	mountOnNode(node) {
		let portal = this.props.portalId && document.getElementById(this.props.portalId);
		this.parentNode = node;
		if (!portal) {
			portal = document.createElement('div');
			portal.id = this.props.portalId;
			node.appendChild(portal);
		}
		this.portalElement = portal;
		this.componentDidUpdate();
	},
	componentWillUnmount() {
		document.body.removeChild(this.portalElement);
	},
	componentDidUpdate() {
		React.render(<div {...this.props}>{this.props.children}</div>, this.portalElement);
	}
});

const AsideInputFields = [
	{title: 'aside', type: 'text', params: {placeholder: 'Aside you want to share.'}},
	{title: 'placement', type: 'radio', params: {choices: ['bottom', 'right']}},
	{title: 'reference', type: 'reference'},
];

const AsideConfig = {
	title: 'aside',
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


const AsidePlugin = React.createClass({
	propTypes: {
		reference: PropTypes.object,
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
		if (!this.props.placement || this.props.placement === 'aside') {
			const node = ReactDOM.findDOMNode(this);
			const pNode = getParentByClassName(node, 'p-block');
			this.refs.portal.mountOnNode(pNode);
		}
	},
	render: function() {
		const count = (this.props.count) ? this.props.count : 0;

		let contentElem;

		if (this.props.placement && this.props.placement === 'right') {
			contentElem = (<div ref="aside" style={styles.asideBox(this.state.hover || this.state.clicked)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.asideCount(this.state.hover)}>^{count}</span>.&nbsp;{this.props.aside}
			</div>);
		} else {
			contentElem = (<Portal portalId={`asidePortal${count}`} ref="portal">
			<div ref="aside" style={styles.aside(this.state.hover || this.state.clicked)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.asideCount(this.state.hover)}>^{count}</span>.&nbsp;{this.props.aside}
			</div>
			</Portal>);
		}

		return (
			<span>
				<sup style={styles.ref(this.state.hover || this.state.clicked)} ref="ref"
				onClick={this.scrollToAside} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					^{count}
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
	asideCount: function(highlight) {
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
			padding: '0px 3px 0px 10px',
		};
	},
	ref: function(highlight) {
		return {
			fontWeight: '700',
			backgroundColor: (highlight) ? 'rgba(245, 238, 185, 0.6)' : 'white',
			cursor: 'pointer',
		};
	},

};


export default createPubPubPlugin(AsidePlugin, AsideConfig, AsideInputFields);
