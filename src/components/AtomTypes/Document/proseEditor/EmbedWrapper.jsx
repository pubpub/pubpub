import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import React, {PropTypes} from 'react';
import {ensureImmutable} from 'reducers';

import ElementSchema from './elementSchema';
import EmbedEditor from './EmbedEditor';

// import {safeGetInToJS} from 'utils/safeParse';

let styles = {};

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
		id: PropTypes.string,
		align: PropTypes.oneOf(['inline', 'full', 'left', 'right', 'inline-word']),
		size: PropTypes.string,
		caption: PropTypes.string,
		mode: PropTypes.oneOf(['embed', 'cite']),
		data: PropTypes.object,
		citeCount: PropTypes.number,
		context: PropTypes.oneOf(['reference-list', 'document', 'library']), // where the embed is being used
		updateParams: PropTypes.func,
		nodeId: PropTypes.number,
	},
	getInitialState: function() {
		return {
			selected: false,
		};
	},
	getDefaultProps: function() {
		return {
			context: 'document',
		};
	},
	componentDidMount: function() {
		/*
		const checkCallback = () => {
			ElementSchema.checkAndRender(this.props.nodeId);
		};
		window.setTimeout(checkCallback, 0);
		*/
	},

	componentWillUpdate: function(nextProps, nextState) {
	},

	componentWillUnmount: function() {
		console.log('unmounted atom!');
	},

	getSize: function() {
		const elem = ReactDOM.findDOMNode(this.refs.menupointer);
		return {
			width: elem.clientWidth,
			left: elem.offsetLeft,
			top: elem.offsetTop,
		};
	},

	setCiteCount: function(citeCount) {
		console.log('set cite count!', citeCount);
		this.setState({citeCount});
	},

	setSelected: function(selected) {
		this.setState({selected});
	},

	updateParams: function(newAttrs) {
		this.props.updateParams(this.props.nodeId, newAttrs);
	},

	typeNewCaption: function() {
		const newCaption = this.refs.captionInput.value;
		console.log('got new caption!', newCaption);
		this.updateParams({caption: newCaption});
		this.refs.captionInput.focus();
	},

	preventClick: function(evt) {
		// evt.preventDefault();
		console.log('preventing click!');
		evt.stopPropagation();
		this.refs.captionInput.focus();
	},

	preventKey: function(evt) {
		// evt.preventDefault();
		console.log('preventing key!');
		evt.stopPropagation();
		this.refs.captionInput.focus();
	},

	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });

		if (this.props.mode === 'cite') {
			const number = this.state.citeCount || this.props.citeCount || '?';

			return (
				<span className={'light-button arrow-down-button cite-wrapper no-arrow'} style={styles.button} data-source={this.props.source}>
					<span style={styles.number}>
						{number}
					</span>
					<div className={'hoverChild arrow-down-child'} style={styles.hover}>
						<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
					</div>
				</span>
			);
		}

		const selected = this.state.selected;

		return (
			<div ref="embedroot" className={'pub-embed ' + this.props.className} id={this.props.id}>
				<figure style={styles.figure({size: this.props.size, align: this.props.align})}>
				<div style={{width: this.props.size, position: 'relative', display: 'table-row'}}>
				<Resizable
				  width={'100%'}
				  height={'auto'}
					maxWidth={650}
					customStyle={styles.outline({selected})}
					onResizeStop={(direction, styleSize, clientSize, delta) => {
						const ratio = (clientSize.width / 650) * 100;
						console.log(ratio);
						this.updateParams({size: ratio + "%" });
					}}>
						<AtomViewerPane selected={this.state.selected} atomData={atomData} renderType={'embed'} context={this.props.context}/>
				</Resizable>
			</div>
			<figcaption style={styles.caption({size: this.props.size, align: this.props.align})}>
				<span
					onMouseDown={this.preventClick}
					onKeyDown={this.preventKey}
					onKeyUp={this.preventKey}
					draggable="false"
					onClick={this.preventClick}
					onInput={this.typeNewCaption}
					className="caption"
					ref="captionInput"
					contentEditable
					style={styles.captionText({align: this.props.align})}>
					{this.props.caption}
				</span>
				{(this.state.selected) ? <div style={{zIndex: 10000, pointerEvents: 'all', position: 'absolute'}}><EmbedEditor embedAttrs={this.props} updateParams={this.updateParams}/></div> : null }
			</figcaption>
			</figure>
			</div>
		);
	}
});

styles = {
	button: {
		padding: '0em 0em',
		height: '0.75em',
		width: '0.75em',
		position: 'relative',
		top: '-0.15em',
		verticalAlign: 'middle',
		display: 'inline-block',
		cursor: 'pointer',
		// border: 'none'
	},
	hover: {
		minWidth: '275px',
		padding: '1em',
		fontSize: '0.85em'
	},
	number: {
		display: 'inline-block',
		height: '100%',
		verticalAlign: 'top',
		position: 'relative',
		top: '-0.45em',
		fontSize: '0.85em',
	},
	outline: function({selected}) {
		return {
			outline: (selected) ? '3px solid #BBBDC0' : '3px solid transparent',
			transition: 'outline-color 0.15s ease-in',

		};
	},
	figure: function({size, align, selected}) {
		const style = {
			width: size,
			display: 'table',
		};
		if (align === 'left') {
			style.float = 'left';
		} else if (align === 'right') {
			style.float = 'right';
		} else if (align === 'full') {
			style.margin = '0 auto';
		}
 		return style;
	},
	caption: function({size, align}) {
		const style = {
			width: size,
			display: 'table-row',
		};
		return style;
	},
	captionText: function({align}) {
		const style = {
			width: '100%',
			display: 'inline-block',
		};
		return style;
	}
};

export default EmbedWrapper;
