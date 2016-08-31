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
			jupyterHtml: '',
			iframeID: '',

		};
	},
	componentWillMount() {
		const versionID = safeGetInToJS(this.props.atomData, ['currentVersionData', '_id']);
		const now = new Date().getTime();
		this.setState({iframeID: 'jupyter-' + versionID + now});
	},
	componentDidMount() {
		iframeResizer = require('iframe-resizer').iframeResizer;
	},

	onIframeLoad: function() {
		iframeResizer = require('iframe-resizer').iframeResizer;
		this.setState({isUploading: false});
		const iframes = document.getElementsByTagName('iframe');
		let thisIframe; // We have to do this because selecting iframe by id doesn't work for some reason.
		for (let index = 0; index < iframes.length; index++) {
			if (iframes[index].id === this.state.iframeID) {
				thisIframe = iframes[index];
			}
		}
		// iframeResizer({heightCalculationMethod: 'max'}, document.getElementsByTagName('iframe')[0]);
		iframeResizer({heightCalculationMethod: 'max'}, thisIframe);
	},

	render: function() {
		// const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		// const JupyterSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const JupyterSourceHtmlUrl = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'htmlUrl']);


		return (
			<div>
				<iframe id={this.state.iframeID} className={'jupyter-iframe'} ref="iframe" style={styles.iframe} src={JupyterSourceHtmlUrl} onLoad={this.onIframeLoad}></iframe>
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
		display: 'block',
		margin: '0 auto',
	}
};
