import React, {PropTypes} from 'react';
import Radium from 'radium';
import Media from './baseMediaPlugin';
import {Reference} from '../';
import {propQuote, propAttribution, propSize, propAlign, propSrcRef} from './pluginProps';
export const quoteOptions = {quote: propQuote, attribution: propAttribution, size: propSize, align: propAlign, reference: propSrcRef};

let styles = {};

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
		const reference = this.props.reference || null;

		let html;

		let style;

		if (align === 'full') {
			style = styles.full;
		} else {
			style = styles.inline;
		}

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else {
			html = (<Media style={style} size={size} align={align}>
				{quote}
				{ (attribution) ? <div style={styles.attribute}> - {attribution}</div> : null}
				{ (reference) ? <div style={styles.reference}> <Reference citationObject={reference} mode={'mla'} /> </div> : null }
			</Media>
		);
		}
		return html;
	}
});

styles = {
	full: {
		borderTop: '#A7A7A7 solid 1px',
		borderBottom: '#A7A7A7 solid 1px',
		padding: '1em',
		textAlign: 'left'
	},
	inline: {
		borderLeft: '#A7A7A7 solid 1px',
		paddingLeft: '1em',
		textAlign: 'left'
	},
	attribute: {
		fontStyle: 'italic',
		textAlign: 'right',
	},
	reference: {
		fontSize: '0.65em',
		paddingTop: '0.5em'
	}
};


export default Radium(QuotePlugin);
