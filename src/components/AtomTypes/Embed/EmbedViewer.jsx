import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import request from 'superagent';

import {match} from './oEmbed';

let styles;

export const EmbedViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	getInitialState() {
		return {
			valid: false,
			source: '',
			html: '',
			metaData: {},
			provider: ''
		};
	},

	componentDidMount() {
		const source = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'source']) || '';
		const provider = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'provider']) || '';
		const html = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'html']) || '';
		const metaData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metaData']) || '';
		if (html) {
			this.setState({source, provider, html, metaData});
		} else if (source) {
			const provider = match(source);
			if (provider)	{
				this.setState({source, provider: provider.name}, e => this.loadEmbed(source, provider));
			}
		}
	},

	loadEmbed(source, provider) {
		const {api} = provider;
		const url = __DEVELOPMENT__ ? ('http://crossorigin.me/' + api) : api;
		request.get(url).query({url: source, format: 'json'}).end((err, res) => {
			if (err) {
				console.error(err);
			}	else {
				const {html, ...metaData} = res.body;
				this.setState({html, metaData});
			}
		});
	},
	
	render() {
		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div dangerouslySetInnerHTML={{__html: this.state.html}}></div>;
		case 'full':
		case 'static-full':
			default:
			// consider adding metadata fields here?
			return <div>
				<div dangerouslySetInnerHTML={{__html: this.state.html}}></div>
			</div>;
		}
	}
});

export default Radium(EmbedViewer);

styles = {

};
