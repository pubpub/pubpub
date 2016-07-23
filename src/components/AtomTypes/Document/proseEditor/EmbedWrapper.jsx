import React, {PropTypes} from 'react';
import {AtomViewerPane} from 'containers/AtomReader/AtomViewerPane';
import {ensureImmutable} from 'reducers';

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
			display: 'inline-block',
			width: this.props.size || 'auto',
		};

		return (
			<div className={'pub-embed ' + this.props.className} id={this.props.id} style={style}>
				<AtomViewerPane atomData={atomData} renderType={'embed'} citeCount={this.props.citeCount}/>	
				<div className={'caption'}>{this.props.caption}</div>	
			</div>
		);
	}
});

export default EmbedWrapper;
