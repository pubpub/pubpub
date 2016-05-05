import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import { Link } from 'react-router';

const InputFields = [
	{title: 'source', type: 'asset', params: {assetType: 'image'}},
	{title: 'text', type: 'text', params: {placeholder: ''}},
	{title: 'url', type: 'text', params: {placeholder: 'http://www.url.com or /pub/example'}},
];

const Config = {
	title: 'link',
	autocomplete: true,
	preview: false,
	color: 'rgba(185, 215, 249, 0.5)',
};

const EditorWidget = (inputProps) => (<span>Link: {inputProps.url || 'Empty'}</span>);

const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,

		source: PropTypes.object,
		text: PropTypes.string,
		url: PropTypes.string,

	},
	getInitialState() {
		return {
			source: {},
			text: '',
			url: ''
		};
	},

	render: function() {
		// Determine if url is relative or note
		// Put into appropriate <Link> or <a>
		const linkURL = this.props.url || '';
		const imageURL = this.props.source ? this.props.source.url : '';
		const text = this.props.text;

		const isExternal = linkURL.indexOf('http://') > -1 || linkURL.indexOf('https://') > -1 || linkURL.indexOf('matilto:') > -1;
		return isExternal
			? <a href={linkURL}>
				{imageURL ? <img src={imageURL} /> : null}
				{text ? <div>{text}</div> : null}
			</a>
			: <Link to={linkURL}>
				{imageURL ? <img src={imageURL} /> : null}
				{text ? <div>{text}</div> : null}
			</Link>;
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
