import fs from 'fs';
import request from 'request';
import Promise from 'bluebird';
import nodePandoc from 'node-pandoc';
import tmp from 'tmp-promise';

tmp.setGracefulCleanup();
const dataDir = process.env.NODE_ENV === 'production'
	? '--data-dir=/app/.apt/usr/share/pandoc/data '
	: '';

export default (sourceUrl)=> {
	// - get file, enter into pandoc, get html, convert into pubpub json
	const extension = sourceUrl.split('.').pop().toLowerCase();
	const extensionTypes = {
		docx: { format: 'docx' },
		epub: { format: 'epub' },
		html: { format: 'html' },
		md: { format: 'markdown_strict' },
		odt: { format: 'odt' },
		txt: { format: 'plain' },
		xml: { format: 'jats' },
		tex: { format: 'latex' },
	};

	return tmp.file({ postfix: `.${extension}` })
	.then((tmpFile)=> {
		return new Promise((resolve, reject)=> {
			request.head(sourceUrl, (err)=> {
				if (err) { reject(err); }

				const stream = request(sourceUrl);
				const writeStream = fs.createWriteStream(tmpFile.path)
				.on('error', (writeErr)=> {
					reject(writeErr);
					stream.read();
				});

				stream.pipe(writeStream)
				.on('close', ()=> {
					resolve(tmpFile.path);
				});
			});
		});
	})
	.then((tmpPath)=> {
		const args = `${dataDir}-f ${extensionTypes[extension].format} -t html`;
		return new Promise((resolve, reject)=> {
			nodePandoc(tmpPath, args, (err, result)=> {
				if (err && err.message) {
					console.warn(err.message);
				}
				/* This callback is called multiple times */
				/* err is sent multiple times and includes warnings */
				/* So to check if the file generated, check the size */
				/* of the tmp file. */
				if (result && !err) {
					resolve(result);
				}
				if (result && err) {
					reject(new Error('Error in Pandoc'));
				}
			});
		});
	})
	.then((convertedHtml)=> {
		return { html: convertedHtml };
		// Need to check for media folder - and upload all assets there to server, and then replace urls

		// Send HTML to editor, which converts to json
		// And then editor (I think) writes to firebase
	});
};
