import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader} from 'components';
let styles = {};

let iframeResizer;

export const JupyterEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: '',
			isUploading: false,
			isLoading: true,
			JupyterSourceHtmlUrl: '',
			mounted: false,

		};
	},

	componentDidMount() {
		iframeResizer = require('iframe-resizer').iframeResizer;
		this.setState({mounted: true});
	},

	getSaveVersionContent: function() {
		this.setState({isUploading: true});
		return {
			url: this.state.url || safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']),
		};
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({isUploading: true});
			s3Upload(evt.target.files[0], ()=>{}, this.onFileFinish, 0);
		}
	},

	onFileFinish: function(evt, index, type, filename) {
		this.setState({
			url: 'https://assets.pubpub.org/' + filename,
			isUploading: false,
		});
	},

	onIframeLoad: function() {
		iframeResizer = require('iframe-resizer').iframeResizer;
		this.setState({isUploading: false});

		iframeResizer({heightCalculationMethod: 'max'}, document.getElementsByTagName('iframe')[0]);
	},

	render: function() {
		const JupyterSourceHtmlUrl = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'htmlUrl']);
		return (
			<div>
				<h3>Preview</h3>

				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={false}/>
				</div>
				<div style={styles.iframeOuter}>
					{this.state.mounted &&
						<iframe id={'jupyter'} ref="iframe" style={styles.iframe} src={JupyterSourceHtmlUrl} onLoad={this.onIframeLoad}></iframe>
					}

				</div>
				<h3>Choose new file</h3>
				<input id={'jupyterFile'} name={'jupyter file'} type="file" accept=".ipynb" onChange={this.handleFileSelect} />

			</div>
		);
	}
});

export default Radium(JupyterEditor);

styles = {
	loaderWrapper: {
		display: 'inline-block',
	},
	originalLink: {
		display: 'table-cell',
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '0.9em',
	},
	iframe: {
		border: 'none',
		width: '93%',
	},
};
