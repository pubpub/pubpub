import React, {PropTypes} from 'react';
import Media from './baseMediaPlugin';
import createPubPubPlugin from './PubPub';
import {Reference} from '../';

const QuoteInputFields = [
	{title: 'quote', type: 'textArea', params: {placeholder: 'Caption for the quote.'}},
	{title: 'attribution', type: 'text', params: {placeholder: 'Who said it'}},
	{title: 'align', type: 'align'},
	{title: 'size', type: 'size'},
	{title: 'reference', type: 'reference'},
];

const QuoteConfig = {
	title: 'quote',
	inline: true,
	autocomplete: true,
	color: 'rgba(245, 245, 169, 0.5)',
};

const QUOTE_WRAPPER_CLASS = 'pub-quote-wrapper';
const QUOTE_CLASS = 'pub-quote';

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

		if (this.props.error === 'empty') {
			html = <span></span>;
		} else {
			html = (<Media className={QUOTE_WRAPPER_CLASS} size={size} align={align}>
				<div className={QUOTE_CLASS}>
					{quote}
					{ (attribution) ? <div style={styles.attribute}> - {attribution}</div> : null}
					{ (reference) ? <div style={styles.reference}> <Reference citationObject={reference} mode={'mla'} /> </div> : null }
				</div>
			</Media>
		);
		}
		return html;
	}
});

styles = {
	line: {
		padding: '1em 0px',
	},
	attribute: {
		fontStyle: 'italic',
		textAlign: 'right',
	},
	reference: {
		fontSize: '0.65em',
		paddingTop: '0.5em '
	}
};

export default createPubPubPlugin(QuotePlugin, QuoteConfig, QuoteInputFields);
