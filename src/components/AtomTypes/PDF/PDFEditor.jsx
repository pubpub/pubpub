import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader} from 'components';

import PDFJS from 'pdfjs-dist/build/pdf.combined';


let styles = {};

export const PDFEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: '',
			isUploading: false,
		};
	},


	getSaveVersionContent: function() {
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

	componentDidMount: function() {
		const url = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']) || '';

		PDFJS.disableWorker = true;
		PDFJS.getDocument(url).then(renderPages);
	},

	render: function() {
		const title = safeGetInToJS(this.props.atomEditData, ['atomData', 'title']);
		const url = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']) || '';

		return (
			<div>
				<h3>Preview</h3>

				<div id="holder"></div>

				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={true}/>
				</div>
				<a href={url} alt={'Original Size: ' + title} target="_blank" className={'underlineOnHover'} style={styles.originalLink}>View File</a>

				<h3>Choose new file</h3>
				<input id={'pdfFile'} name={'pdf file'} type="file" accept="pdf/*" onChange={this.handleFileSelect} />

			</div>
		);
	}
});
const renderPage = (page) => {
	const options = {
		scale: 1.2
	};
	const canvasContainer = document.getElementById('holder');
	const viewport = page.getViewport(options.scale);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const renderContext = {
		canvasContext: ctx,
		viewport: viewport
	};

	canvas.height = viewport.height;
	canvas.width = viewport.width;
	canvasContainer.appendChild(canvas);

	page.render(renderContext);
};

const renderPages = (pdfDoc) => {
	console.log('renderPages');
	for (let num = 1; num <= pdfDoc.numPages; num++) {
		pdfDoc.getPage(num).then(renderPage);
	}
};

export default Radium(PDFEditor);

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
};
