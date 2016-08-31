import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader} from 'components';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

let iframeResizer;

export const JupyterEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
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
			url: this.state.url || safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']),
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
		const JupyterSourceHtmlUrl = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'htmlUrl']);
		const now = new Date().getTime();
		return (
			<div>
				<h3>
					<FormattedMessage {...globalMessages.Preview}/>
				</h3>

				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={false}/>
				</div>
				<div style={styles.iframeOuter}>
					{this.state.mounted &&
						<iframe id={'jupyter-' + now} className={'jupyter-iframe'} ref="iframe" style={styles.iframe} src={JupyterSourceHtmlUrl} onLoad={this.onIframeLoad}></iframe>
					}

				</div>
				<h3>
					<FormattedMessage {...globalMessages.ChooseNewFile}/>
				</h3>
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
		display: 'block',
		margin: '0 auto',
	},
};
