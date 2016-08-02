import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader, CustomizableForm} from 'components';

import {isWebUri} from 'valid-url';
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
			title: '', 
			author_name: '', 
			author_url: ''
		};
	},
	
	getSaveVersionContent: function() {
		const {source, html, title, author_name, author_url} = this.state;
		return {source, html, title, author_name, author_url};
	},
	
	componentDidMount() {
		const source = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'source']) || '';
		const html = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'html']) || '';
		const title = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'title']) || '';
		const author_name = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'author_name']) || '';
		const author_url = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'author_url']) || '';
		if (html) {
			this.setState({source, html, title, author_name, author_url});
		} else if (source) {
			this.setState({source}, e => this.loadCodePen(source));
		}
	},
	
	
	loadCodePen(source) {
		const url = __DEVELOPMENT__ ? 'http://crossorigin.me/http://codepen.io/api/oembed' : 'http://codepen.io/api/oembed';
		request.get(url).query({url: source, format: 'json'}).end((err, res) => {
			if (err) {
				console.error(err);
			}	else {
				const {html, title, author_name, author_url} = res.body;
				this.setState({html, title, author_name, author_url});
			}
		});
	},
	
	handleSourceChange(evt) {
		const source = evt.target.value;
		const valid = isWebUri(source) && source !== this.state.source;
		this.setState({source, valid});
	},
	
	updateSource(evt) {
		this.loadCodePen(this.state.source);
	},

	render() {
		const {source, valid, html} = this.state;
		return <div>
			<label htmlFor='source' style={styles.label}>
				Source:
				<input id='source' name='source' type='text' value={source} style={styles.source} onChange={this.handleSourceChange}/>
			</label>
			<button id="update" style={styles.update} onClick={this.updateSource} disabled={!valid}>Update</button>
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
