import React, {PropTypes} from 'react';
import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import {ensureImmutable} from 'reducers';
// import {safeGetInToJS} from 'utils/safeParse';

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
		id: PropTypes.string,
		align: PropTypes.string, // inline or full or left or right
		size: PropTypes.string,
		caption: PropTypes.string,
		mode: PropTypes.string, // 'embed' or 'cite'
		data: PropTypes.object,
		citeCount: PropTypes.number,

	},
	componentDidMount: function() {
		console.log('Mounted atom!');
	},

	componentWillUnmount: function() {
		console.log('unmounted atom!');
	},

	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		console.log('Rendering an atom!');

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });


		const style = {
			width: this.props.size || 'auto',
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
			style.paddingRight = '2em';
		} else if (this.props.align === 'right') {
			style.display = 'block';
			style.float = 'right';
			style.paddingLeft = '2em';
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


			return (
				<span className={'showChildOnHover cite-wrapper'} data-source={this.props.source}>
					[{number}]
					<div className={'hoverChild hover-box'}>
						<AtomViewerPane atomData={atomData} renderType={'embed'}/>
					</div>
				</span>
			);
		}

		return (
			<div className={'pub-embed ' + this.props.className} id={this.props.id} style={style}>
				<AtomViewerPane atomData={atomData} renderType={'embed'}/>
				<div className={'caption'}>{this.props.caption}</div>
			</div>
		);
	}
});

export default EmbedWrapper;
