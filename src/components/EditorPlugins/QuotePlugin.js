import React, {PropTypes} from 'react';
import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';
import Media from './baseMediaPlugin';

import {propSize, propAlign, propCaption, propSrcRef} from './pluginProps';
export const quoteOptions = {caption: propCaption, size: propSize, align: propAlign, reference: propSrcRef};

// let styles = {};

const QuotePlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOfType([React.PropTypes.oneOf(['small', 'medium', 'large']), React.PropTypes.number]),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		caption: PropTypes.string,
		attribution: PropTypes.string,
		reference: PropTypes.object
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		const url = this.props.url;
		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;

		let html;

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else {
			html = (<Media size={size} align={align}>
				{caption}
			</Media>
		);
		}
		return html;
	}
});


export default Radium(QuotePlugin);
