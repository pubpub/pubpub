import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import request from 'superagent';

let styles;

export const CodePenViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	getInitialState() {
		return {
			source: '',
			html: '',
			title: '',
			author_name: '',
			author_url: ''
		};
	},

	componentDidMount() {
		const source = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'source']) || '';
		const html = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'html']) || '';
		const title = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'title']) || '';
		const author_name = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'author_name']) || '';
		const author_url = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'author_url']) || '';
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
			} else {
				const {html, title, author_name, author_url} = res.body;
				this.setState({html, title, author_name, author_url});
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
			// consider adding fields for title, author, and author url here
			return <div>
				<div dangerouslySetInnerHTML={{__html: this.state.html}}></div>
			</div>;
		}
	}
});

export default Radium(CodePenViewer);

styles = {

};
