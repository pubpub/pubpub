import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import ReactDOM from 'react-dom';
import React, {PropTypes} from 'react';
import {ensureImmutable} from 'reducers';

// import {safeGetInToJS} from 'utils/safeParse';

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
		updateParams: PropTypes.number,
		editing: PropTypes.bool,
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
		// console.log('Mounted atom!');
	},

	componentWillUnmount: function() {
		// console.log('unmounted atom!');
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



	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });


		const style = {
			// width: this.props.size || 'auto',
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

		return (
			<div ref="embedroot" className={'pub-embed ' + this.props.className} id={this.props.id} style={style}>
				<AtomViewerPane selected={this.state.selected} atomData={atomData} renderType={'embed'} context={this.props.context}>
					<span style={{width: '100%', display: 'inline-block'}} ref="menupointer"></span>
					<span style={{textAlign: 'left'}}>{this.props.caption}</span>
				</AtomViewerPane>
			</div>
		);
	}
});

export default EmbedWrapper;
