import React, {PropTypes} from 'react';
import {AtomViewerPane} from 'containers/AtomReader/AtomViewerPane';
import {ensureImmutable} from 'reducers';
import {safeGetInToJS} from 'utils/safeParse';

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
			style.verticalAlign = 'top';
		} else if (this.props.align === 'full') {
			style.display = 'block';
			style.margin = '0 auto';
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
			return (
				<span className={'showChildOnHover cite-wrapper'} >
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
