import React, { PropTypes } from 'react';
import Radium from 'radium';
// import PDFJS from 'pdfjs-dist';
import { PDFJS } from 'pdfjs-dist/web/pdf_viewer';

console.log(PDFJS);

PDFJS.workerSrc = '/static/pdf.worker.min.js';
let styles;
// console.log(PDFJS)
// console.log(PDFJS.DefaultAnnotationLayerFactory)
// console.log(PDFJS.PDFJS.DefaultAnnotationLayerFactory)

const renderPage = function(page) {
	const options = {
		scale: 1
	};
	const viewport = page.getViewport(options.scale);

	const canvasContainer = document.getElementById('holder');
	const canvas = document.createElement('canvas');
	canvas.style.width = '100%';
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

export const PreviewPub = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {

		}
	},
	componentDidMount: function() {
		// this.renderItAll();
		const url = this.props.file.url || '';
		PDFJS.getDocument(url).then((pdf)=> {
			this.setState({ pdf: pdf })	;
			this.renderItAll4();
		});
		

		window.addEventListener('resize', this.renderItAll4);

	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.renderItAll4);
	},

	renderPage2: function(page) {
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
	},

	renderItAll2: function() {
		

		// PDFJS.disableWorker = true;
		// PDFJS.getDocument(url).then(renderPages);
		const pdf = this.state.pdf;
	
		// Get div#container and cache it for later use
		var container = document.getElementById("container");
		container.innerHTML = ''

		// Loop from 1 to total_number_of_pages in PDF document
		for (var i = 1; i <= pdf.numPages; i++) {

		    // Get desired page
		    pdf.getPage(i).then(function(page) {

		      const scale = container.offsetWidth / page.getViewport(1.0).width;
		      var viewport = page.getViewport(scale);
		      var div = document.createElement("div");
		      console.log(page.getViewport(1))

		      // Set id attribute with page-#{pdf_page_number} format
		      div.setAttribute("id", "page-" + (page.pageIndex + 1));
		      div.setAttribute("class", "pdf-page");

		      // This will keep positions of child elements as per our needs
		      div.setAttribute("style", "position: relative");

		      // Append div within div#container
		      container.appendChild(div);

		      // Create a new Canvas element
		      var canvas = document.createElement("canvas");

		      // Append Canvas within div#page-#{pdf_page_number}
		      div.appendChild(canvas);

		      var context = canvas.getContext('2d');
		      canvas.height = page.getViewport(1.0).height * scale || viewport.height;
		      canvas.width = container.offsetWidth ||viewport.width;

		      var renderContext = {
		        canvasContext: context,
		        viewport: viewport
		      };

		      // Render PDF page
		      // page.render(renderContext);
		      page.render(renderContext)
			  .then(function() {
			    // Get text-fragments
			    return page.getTextContent();
			  })
			  .then(function(textContent) {
			    // // Create div which will hold text-fragments
			    var textLayerDiv = document.createElement("div");

			    // // Set it's class to textLayer which have required CSS styles
			    textLayerDiv.setAttribute("class", "textLayer");

			    // // Append newly created div in `div#page-#{pdf_page_number}`
			    div.appendChild(textLayerDiv);

			    // // Create new instance of TextLayerBuilder class
			    // // const TextLayerBuilder = PDFJS.TextLayerBuilder;
			    // var textLayer = new TextLayerBuilder({
			    //   textLayerDiv: textLayerDiv, 
			    //   pageIndex: page.pageIndex,
			    //   viewport: viewport
			    // });
			    // console.log(pdf)

			    // // Set text-fragments
			    // textLayer.setTextContent(textContent);

			    // // Render text-fragments
			    // textLayer.render();

			    PDFJS.renderTextLayer({
			        textContent,
			        container: textLayerDiv,
			        viewport,
			        textDivs: []
			      });
			  });
		    });
		}
	},



	renderItAll3: function() {
		

		// PDFJS.disableWorker = true;
		// PDFJS.getDocument(url).then(renderPages);
		const pdf = this.state.pdf;
	
		// Get div#container and cache it for later use
		var container = document.getElementById("container");
		container.innerHTML = ''
			

		// Loop from 1 to total_number_of_pages in PDF document
		var x =[]
		for (var i = 1; i <= pdf.numPages; i++) {
			x.push(i);
		}
		let count = 0;
		// for (var i = 1; i <= 2; i++) {
			// var x = [1,2,3,4];
			x.map((item, index)=>{
				console.log('yooo');
			    return pdf.getPage(index + 1).then(function(pdfPage) {
			      const scale = container.offsetWidth / pdfPage.getViewport(4/3).width;
			      // Dunno why 4/3 is the unit there. In other tests, it made sense to just use 1.0
			      // See https://github.com/mozilla/pdf.js/issues/5628
			      // For optimizations, such as only rendering the visible page: https://github.com/mozilla/pdf.js/issues/7718
				  var pdfPageView = new PDFJS.PDFPageView({
				      container: container,
				      id: index,
				      scale: scale,
				      defaultViewport: pdfPage.getViewport(scale),
				      // We can enable text/annotations layers, if needed
				      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
				      annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
				    });
				    // Associates the actual page with the view, and drawing it
				    
				    
				    pdfPageView.setPdfPage(pdfPage);
				    count++;
				    if (count === 84) {
				    	console.log('done with everything ');
				    }
				    
				    if (index === 0) {
				    	pdfPageView.draw();
				    }

				    // const promise = 
				    // console.log('after the promise ', promise);
			    });
		    })		

	},
	renderItAll4() {
		var container = document.getElementById("container");
		container.innerHTML = ''
		this.renderSinglePage(1);
	},

	renderSinglePage(pageNumber) {
		const pdf = this.state.pdf;
		var container = document.getElementById("container");
			

		// for (var i = 1; i <= pdf.numPages; i++) {
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
			// Associates the actual page with the view, and drawing it
			
			
			pdfPageView.setPdfPage(pdfPage);
			return pdfPageView.draw();
		})
		.then((thing)=> {
			console.log('in thing, with ', pageNumber)
			if (pageNumber < pdf.numPages) {
				return this.renderPageWTF(pageNumber + 1);
			}
			return null;
		});	
	},

	render() {
		const file = this.props.file || {};

		return (
			<div id="container" style={{position: 'relative'}}></div>
		);
	}

});

export default Radium(PreviewPub);

styles = {
	container: {
		
	},
	
};
