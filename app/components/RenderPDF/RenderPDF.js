import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';

import { PDFJS } from 'pdfjs-dist/web/pdf_viewer';
PDFJS.workerSrc = '/static/pdf.worker.min.js';

let styles;

export const PreviewPub = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {
			pdf: undefined,
		}
	},
	componentDidMount: function() {
		const url = this.props.file.url || '';
		PDFJS.getDocument(url).then((pdf)=> {
			this.setState({ pdf: pdf })	;
			this.renderPDF();
		});
		window.addEventListener('resize', this.renderPDF);

	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.renderPDF);
	},

	/*renderPage2: function(page) {
			var container = document.getElementById('container');
			container.innerHTML = ''

			const width = document.getElementById('container').parentElement.offsetWidth;
		  const scale = width / page.getViewport(1.0).width;
	      var viewport = page.getViewport(scale);
	      var div = document.createElement("div");

		  // Get div#the-svg
		  

		  // Set dimensions
		  container.style.width = width;
		  // container.style.height = viewport.height + 'px';

		  // SVG rendering by PDF.js
		  page.getOperatorList()
		    .then(function (opList) {
		      var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
		      return svgGfx.getSVG(opList, viewport);
		    })
		    .then(function (svg) {
		      container.appendChild(svg);
		    });
	},

	renderItAll: function() {
		const pdf = this.state.pdf;
		for (let num = 1; num <= pdf.numPages; num++) {
			pdf.getPage(num).then(this.renderPage2);
		}
	},*/

	
	renderPDF() {
		var container = document.getElementById("container");
		container.innerHTML = ''
		this.renderPage(1);
	},

	renderPage(pageNumber) {
		const pdf = this.state.pdf;
		var container = document.getElementById("container");
			
		return pdf.getPage(pageNumber).then((pdfPage)=> {
			const scale = container.offsetWidth / pdfPage.getViewport(4/3).width;
			// Dunno why 4/3 is the unit there. In other tests, it made sense to just use 1.0
			// See https://github.com/mozilla/pdf.js/issues/5628
			// For optimizations, such as only rendering the visible page: https://github.com/mozilla/pdf.js/issues/7718
			var pdfPageView = new PDFJS.PDFPageView({
				container: container,
				id: pageNumber,
				scale: scale,
				defaultViewport: pdfPage.getViewport(scale),
				// We can enable text/annotations layers, if needed
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
		const file = this.props.file || {};

		return (
			<div>
				<Style rules={{
					'.pdfWrapper .page': { position: 'relative', boxShadow: '0px 2px 5px #888', marginBottom: '0.5em'},
				}} />
				<div id="container" className={'pdfWrapper'} style={styles.container} />
			</div>
				
				
		);
	}

});

export default Radium(PreviewPub);

styles = {
	container: {
		position: 'relative',
	},
	
};
