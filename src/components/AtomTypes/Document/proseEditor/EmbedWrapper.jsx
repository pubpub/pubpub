import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import ResizableBox from 'react-resizable-component';
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
		console.log('calling here', this.props);
		this.props.updateParams(this.props.nodeId, newAttrs);
	},

	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });


		const style = {
			width: '100%' || 'auto',
		};
		if (this.props.align === 'inline') {
			style.display = 'inline-block';
			style.verticalAlign = 'top';
		} else if (this.props.align === 'full') {
			style.display = 'block';
			style.margin = '0 auto';
			style.textAlign = 'center';
		} else if (this.props.align === 'left') {
			style.display = 'block';
			style.float = 'left';
			style.paddingRight = '1em';
		} else if (this.props.align === 'right') {
			style.display = 'block';
			style.float = 'right';
			style.paddingLeft = '1em';
		} else if (this.props.align === 'inline-word') {
			style.display = 'inline';
		}

		if (this.props.mode === 'cite') {
			const number = this.state.citeCount || this.props.citeCount || '?';

			const styleButton = {
				padding: '0em 0em',
				height: '0.75em',
				width: '0.75em',
				position: 'relative',
				top: '-0.15em',
				verticalAlign: 'middle',
				display: 'inline-block',
				cursor: 'pointer',
				// border: 'none'
			};

			const hoverStyle = {
				minWidth: '275px',
				padding: '1em',
				fontSize: '0.85em'
			};

			const numberStyle = {
				display: 'inline-block',
				height: '100%',
				verticalAlign: 'top',
				position: 'relative',
				top: '-0.45em',
				fontSize: '0.85em',
			};

			return (
				<span className={'light-button arrow-down-button cite-wrapper no-arrow'} style={styleButton} data-source={this.props.source}>
					<span style={numberStyle}>
						{number}
					</span>
					<div className={'hoverChild arrow-down-child'} style={hoverStyle}>
						<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
					</div>
				</span>
			);
		}

		const selected = this.state.selected;
		const maxWidth = 650;
		let size = this.props.size || 100;

		if (typeof size === 'string' || size instanceof String) {
			const match = size.match(/(\d*)%/);
			if (match && match[1]) {
				size = parseInt(match[1], 10);
			} else {
				size = parseInt(size, 10);
			}

			if (isNaN(size)) {
				size = '100%';
			}
		}

		return (
			<div ref="embedroot" className={'pub-embed ' + this.props.className} id={this.props.id} style={style}>
				<Resizable
				  customClass="item"
				  width={this.props.size}
				  height={'auto'}
					maxWidth={650}
					customStyle={{margin: '0px auto'}}
					onResizeStop={(direction, styleSize, clientSize, delta) => {
						console.log('Stopped resize');
						console.log(styleSize);
						console.log(clientSize);
						const ratio = (styleSize.width / 650) * 100;
						console.log(ratio);
						this.updateParams({size: ratio + "%" });
					}}
				>
					<figure style={styles.figure({size: this.props.size})}>
						<AtomViewerPane selected={this.state.selected} atomData={atomData} renderType={'embed'} context={this.props.context}/>
					</figure>
				</Resizable>
			<figcaption style={styles.caption({size: this.props.size})}>
				<span style={{textAlign: 'left', width: '100%', display: 'inline-block'}}>{this.props.caption}</span>
				{(this.state.selected) ? <div style={{zIndex: 10000, pointerEvents: 'all', position: 'absolute'}}><EmbedEditor embedAttrs={this.props} updateParams={this.updateParams}/></div> : null }
			</figcaption>
			</div>
		);
	}
});

styles = {
	figure: function({selected}) {
		return {
			display: 'table',
			// userSelect: 'none',
			width: 'auto',
			margin: 'auto',
		};
	},
	caption: function({size}) {
		return {
			width: size,
			margin: '0px auto',
		};
	}
};

export default EmbedWrapper;
