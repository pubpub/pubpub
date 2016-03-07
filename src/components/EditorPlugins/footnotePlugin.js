import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
// import ErrorMsg from './ErrorPlugin';
// import {Reference} from '../';
import createPubPubPlugin from './PubPub';
// import classNames from 'classnames';

let styles = {};


const FootnoteInputFields = [
	{title: 'footnote', type: 'textArea', params: {placeholder: 'Footnote you want to share.'}},
	{title: 'type', type: 'radio', params: {choices: ['hover', 'side']}},
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

const FOOTNOTE_WRAPPER_CLASS = 'pub-footnote-wrapper';
const FOOTNOTE_CLASS = 'pub-footnote';


const FootnotePlugin = React.createClass({
	propTypes: {
		reference: PropTypes.object,
		footnote: PropTypes.string,
		type: PropTypes.string,
		children: PropTypes.string,
		error: PropTypes.string,
		count: PropTypes.number
	},
	getInitialState: function() {
		return {
			hover: false,
			clicked: false,
			flipped: false,
			// expanded: false
		};
	},
	mouseOver: function(evt) {
		// flip the hover if the element is past the half way point
		const flipped = ((evt.pageX / document.body.clientWidth) > 0.5);
		// this.hoverTimeout = setTimeout(this.startHover.bind(this), 100);
		this.setState({hover: true, flipped: flipped});
	},
	mouseOut: function() {
		this.setState({hover: false, flipped: false});
	},
	scrollToAside: function() {
		const asideNode = ReactDOM.findDOMNode(this.refs.aside);
		this.setState({clicked: !this.state.clicked});
		if (asideNode && asideNode.scrollIntoViewIfNeeded) {
			asideNode.scrollIntoViewIfNeeded({block: 'start', behavior: 'smooth'});
		}
	},
	render: function() {
		const count = (this.props.count) ? this.props.count : 0;
		const placement = (this.props.type) ? this.props.type : 'hover';

		if (this.props.error) {
			return <span/>;
		}

		let contentElem;

		if (placement === 'hover') {
			contentElem = (<div ref="aside" style={styles.hoverNote(this.state.hover, this.state.flipped)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.count(this.state.hover)}>{count}</span>.&nbsp;{this.props.footnote}
			</div>);
		} else {
			contentElem = (<div ref="aside" style={styles.asideBox(this.state.hover)}
					onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<span style={styles.count(this.state.hover)}>{count}</span>.&nbsp;{this.props.footnote}
			</div>);
		}

		return (
			<span className={FOOTNOTE_WRAPPER_CLASS}>
				<sup className={FOOTNOTE_CLASS} id={`footnote-${count}`} style={styles.ref(this.state.hover || this.state.clicked)} ref="ref"
				onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
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
			fontSize: '0.65em',
			float: 'right',
			border: (!highlight) ? '#D8D8D8 dashed 1px' : 'white dashed 1px',
			backgroundColor: (highlight) ? 'rgba(245, 238, 185, 0.6)' : 'white',
			position: 'relative',
			left: '3vw',
			marginLeft: '-2.5vw',
			marginTop: '20px',
			marginBottom: '20px',
			// width: '100px',
			padding: '3px 3px 3px 5px',
			lineHeight: '1.3em',
			width: '10vw',
			minWidth: '125px',
			maxWidth: '300px',
		};
	},
	count: function(highlight) {
		return {
			fontWeight: (highlight) ? '700' : '400',
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
	hoverNote: function(hover, flipped) {
		return {
			display: (hover) ? 'inline-block' : 'none',
			position: 'absolute',
			marginLeft: (flipped) ? '-15vw' : '0vw',
			fontSize: '11px',
			boxShadow: '0px 0px 5px rgba(0,0,0,0.7)',
			padding: '10px',
			transform: 'translateY(20px)',
			width: '15vw',
			minWidth: '100px',
			maxWidth: '400px',
			zIndex: 50,
			backgroundColor: 'white',
		};
	},

};

export default createPubPubPlugin(FootnotePlugin, FootnoteConfig, FootnoteInputFields);
