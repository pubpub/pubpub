import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import PDFJS from 'pdfjs-dist/build/pdf.combined';

export const PDFViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	componentDidMount: function() {
		const url = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']) || '';

		PDFJS.disableWorker = true;
		PDFJS.getDocument(url).then(renderPages);
	},

	render: function() {

		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
			case 'full':
			case 'static-full':
			default:
			return (
				<div id="holder"></div>
			);
		}

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

export default Radium(PDFViewer);
