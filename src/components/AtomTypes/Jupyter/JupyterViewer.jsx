import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';


let styles;
let iframeResizer;

export const JupyterViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},
	getInitialState() {
		return {
			isLoading: true,
			jupyterHtml: ''
		};
	},
	componentDidMount() {
		iframeResizer = require('iframe-resizer').iframeResizer;
	},

	onIframeLoad: function() {
		iframeResizer = require('iframe-resizer').iframeResizer;
		this.setState({isUploading: false});
		console.log("HLO")
		iframeResizer({heightCalculationMethod: 'max'}, document.getElementsByTagName('iframe')[0]);
	},

	render: function() {
		// const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		// const JupyterSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const JupyterSourceHtmlUrl = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'htmlUrl']);

		return (
			<div>
				<iframe id={'jupyter'} ref="iframe" style={styles.iframe} src={JupyterSourceHtmlUrl} onLoad={this.onIframeLoad}></iframe>
			</div>
		);
	}


});

export default Radium(JupyterViewer);

styles = {
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
	iframe: {
		border: 'none',
		width: '93%',
	}
};
