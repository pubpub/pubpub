import React, { PropTypes } from 'react';
import Radium from 'radium';
import PDFJS from 'pdfjs-dist';

let styles;


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
			this.renderItAll();
		});
		

		window.addEventListener('resize', this.renderItAll);

	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.renderItAll);
	},
	renderItAll: function() {
		

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

	render() {
		const file = this.props.file || {};

		return (
			<div id="container"></div>
		);
	}

});

export default Radium(PreviewPub);

styles = {
	container: {
		
	},
	
};
