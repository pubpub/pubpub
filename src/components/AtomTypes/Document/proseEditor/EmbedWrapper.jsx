import AtomViewerPane from 'containers/Atom/AtomViewerPane';
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
		context: PropTypes.oneOf(['reference-list', 'document', 'library']), //where the embed is being used
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

	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });


		const style = {
			width: this.props.size || 'auto',
		};
		if (this.props.align === 'inline') {
			style.display = 'inline-block';
			// style.verticalAlign = 'top';
		} else if (this.props.align === 'full') {
			style.display = 'block';
			style.margin = '0 auto';
			style.textAlign = 'center';
		} else if (this.props.align === 'left') {
			style.display = 'block';
			style.float = 'left';
			style.paddingRight = '2em';
		} else if (this.props.align === 'right') {
			style.display = 'block';
			style.float = 'right';
			style.paddingLeft = '2em';
		} else if (this.props.align === 'inline-word') {
			style.display = 'inline';
		}

		if (this.props.mode === 'cite') {
			const number = this.props.citeCount || '?';

			// if (!this.props.citeCount) {
			// 	const sourceElems = document.getElementsByClassName('cite-wrapper');
			// 	const elemIDs = {};
			// 	for (let index = 0; index < sourceElems.length; index++) {
			// 		const element = sourceElems[index];
			// 		if (element.getAttribute('data-source') in elemIDs === false) {
			// 			elemIDs[element.getAttribute('data-source')] = Object.keys(elemIDs).length + 1;
			// 		}
			// 	}
			// 	number = elemIDs[this.props.source];
			// 	console.log('number is, ', number);
			// }


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
			<div className={'pub-embed ' + this.props.className} id={this.props.id} style={style}>
				<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
				<div className={'caption'}>{this.props.caption}</div>
			</div>
		);
	}
});

export default EmbedWrapper;
