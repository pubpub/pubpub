import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader, CustomizableForm} from 'components';

import {match} from './oEmbed';
import request from 'superagent';

let styles = {};

export const EmbedEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
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
	
	getSaveVersionContent() {
		const {source, html, provider, metaData} = this.state;
		return {source, html, provider, metaData};
	},
	
	componentDidMount() {
		const source = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'source']) || '';
		const provider = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'provider']) || '';
		const html = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'html']) || '';
		const metaData = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'metaData']) || '';
		if (html) {
			this.setState({source, provider, html, metaData});
		} else if (source) {
			const provider = match(source);
			if (provider)	{
				this.setState({source, provider: provider.name}, e => this.loadEmbed(source, provider.api));
			}
		}
	},
	
	loadEmbed(source, api) {
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
	
	handleSourceChange(evt) {
		const source = evt.target.value;
		const provider = match(source);
		if (provider && source !== this.state.source) {
			this.setState({source, provider: provider.name}, e => this.loadEmbed(source, provider.api));
		}
	},
	
	render() {
		const {source, html} = this.state;
		return <div>
			<label htmlFor='source' style={styles.label}>
				Source:
				<input id='source' name='source' type='text' value={source} style={styles.source} onChange={this.handleSourceChange}/>
			</label>
			<h3>Preview</h3>
			<div dangerouslySetInnerHTML={{__html: html}}></div>
		</div>;
	}
});

export default Radium(EmbedEditor);

styles = {
	source: {},
	update: {}
};
