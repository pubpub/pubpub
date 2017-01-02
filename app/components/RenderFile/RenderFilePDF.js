import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';

import { PDFJS } from 'pdfjs-dist/web/pdf_viewer';
PDFJS.workerSrc = '/static/pdf.worker.min.js';

let styles;

export const RenderFilePDF = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {
			pdf: undefined,
		};
	},
	componentDidMount() {
		const url = this.props.file.url || '';
		PDFJS.getDocument(url).then((pdf)=> {
			this.setState({ pdf: pdf });
			this.renderPDF();
		});
		window.addEventListener('resize', this.renderPDF);

	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.renderPDF);
	},
	
	renderPDF: function() {
		const container = document.getElementById('container');
		container.innerHTML = '';
		this.renderPage(1);
	},

	renderPage(pageNumber) {
		const pdf = this.state.pdf;
		const container = document.getElementById('container');
			
		return pdf.getPage(pageNumber).then((pdfPage)=> {
			const scale = container.offsetWidth / pdfPage.getViewport(4 / 3).width;
			// Dunno why 4/3 is the unit there. In other tests, it made sense to just use 1.0
			// See https://github.com/mozilla/pdf.js/issues/5628
			// For optimizations, such as only rendering the visible page: https://github.com/mozilla/pdf.js/issues/7718
			const pdfPageView = new PDFJS.PDFPageView({
				container: container,
				id: pageNumber,
				scale: scale,
				defaultViewport: pdfPage.getViewport(scale),
				textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
				annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
			});
			pdfPageView.setPdfPage(pdfPage);
			return pdfPageView.draw();
		})
		.then((thing)=> {
			if (pageNumber < pdf.numPages) {
				return this.renderPage(pageNumber + 1);
			}
			return null;
		});	
	},

	render() {
		return (
			<div>
				<Style rules={{
					'.pdfWrapper .page': { position: 'relative', boxShadow: '0px 2px 5px #888', marginBottom: '0.5em' },
				}} />
				<div id="container" className={'pdfWrapper'} style={styles.container} />
			</div>
				
				
		);
	}

});

export default Radium(RenderFilePDF);

styles = {
	container: {
		position: 'relative',
	},
	
};
