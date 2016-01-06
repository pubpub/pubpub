import React, {PropTypes} from 'react';
import Radium from 'radium';
import Media from './baseMediaPlugin';

import {propQuote, propAttribution, propSize, propAlign, propSrcRef} from './pluginProps';
export const quoteOptions = {quote: propQuote, attribution: propAttribution, size: propSize, align: propAlign, reference: propSrcRef};

// let styles = {};

const QuotePlugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOfType([React.PropTypes.oneOf(['small', 'medium', 'large']), React.PropTypes.number]),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		quote: PropTypes.string,
		attribution: PropTypes.string,
		reference: PropTypes.object
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		const size = this.props.size;
		const align = this.props.align;
		const quote = this.props.quote;
		const attribution = this.props.attribution;

		let html;

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else {
			html = (<Media size={size} align={align}>
				{quote}
				<div>
				{attribution}
				</div>
			</Media>
		);
		}
		return html;
	}
});


export default Radium(QuotePlugin);
