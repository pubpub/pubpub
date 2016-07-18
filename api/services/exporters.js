const Promise = require('bluebird');
const writeFile = Promise.promisify(require('fs').writeFile);
const pdf = require('html-pdf');

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

export function generatePDFFromJSON(docJSON) {
	let folderName = '';
	const possible = 'abcdefghijklmnopqrstuvwxyz';
	for ( let charIndex = 0; charIndex < 8; charIndex++) { folderName += possible.charAt(Math.floor(Math.random() * possible.length)); }
	const filename = '/tmp/' + folderName + new Date().getTime() + '.pdf';

	const html = '<h1>Hi</h1><p>Dandy</p>';
	const options = { 
		format: 'A4',
		border: {
			top: '.5in',
			bottom: '.5in',
		}
	};

	const createPDF = new Promise(function(resolve, reject) {
		pdf.create(html, options).toFile(filename, function(err, result) {
			if (err) { 
				reject('Error Creating Promise'); 
			} else {
				resolve(filename);
			}
		});
	});
	
	return createPDF
	.then(function(result) {
		return filename;
	})
	.catch(function(error) {
		console.log('Error creating markdown file: ', error);
	});
}
