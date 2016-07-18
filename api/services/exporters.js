const Promise = require('bluebird');
const writeFile = Promise.promisify(require('fs').writeFile);
const pdf = require('html-pdf');
// import React from 'react';
// import {StyleRoot} from 'radium';
// import AtomReaderHeader from 'containers/AtomReader/AtomReaderHeader';
// import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor/renderReactFromJSON';
import request from 'superagent';

export function generateMarkdownFile(markdown) {
	let folderName = '';
	const possible = 'abcdefghijklmnopqrstuvwxyz';
	for ( let charIndex = 0; charIndex < 8; charIndex++) { folderName += possible.charAt(Math.floor(Math.random() * possible.length)); }
	const filename = '/tmp/' + folderName + new Date().getTime() + '.md';

	return writeFile(filename, markdown)
	.then(function(result) {
		return filename;
	})
	.catch(function(error) {
		console.log('Error creating markdown file: ', error);
	});
}

export function generatePDFFromJSON(docJSON, title, versionDate, authors) {
	let folderName = '';
	const possible = 'abcdefghijklmnopqrstuvwxyz';
	for ( let charIndex = 0; charIndex < 8; charIndex++) { folderName += possible.charAt(Math.floor(Math.random() * possible.length)); }
	const filename = '/tmp/' + folderName + new Date().getTime() + '.pdf';


	// const reactDOM = (
	// 	<StyleRoot radiumConfig={{userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}>
	// 		<div id={'atom-reader'}>
	// 			<AtomReaderHeader
	// 				title={title}
	// 				authors={'Jane Doe and Marcus Aurilie'}
	// 				versionDate={versionDate} />

	// 			{renderReactFromJSON(docJSON.content)}
	// 		</div>

	// 	</StyleRoot>
	// );
	

	const options = { 
		format: 'A4',
		border: {
			top: '.5in',
			bottom: '.5in',
			left: '.5in',
			right: '.5in',
		}
	};

	const createPDF = new Promise(function(resolve, reject) {
		request.get('http://localhost:3000/a/kitten').end(function(err, res) { 
			console.log(res.res.text);
			console.log(filename);
			pdf.create(res.res.text, options).toFile(filename, function(err2, result) {
				if (err2) { 
					reject('Error Rendering PDF'); 
				} else {
					resolve(filename);
				}
			});
		});
	});
	
	return createPDF
	.then(function(result) {
		return filename;
	})
	.catch(function(error) {
		console.log('Error creating PDF file: ', error);
	});
}
