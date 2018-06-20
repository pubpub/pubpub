import fs from 'fs';
import request from 'request';
import Promise from 'bluebird';
import nodePandoc from 'node-pandoc';
import tmp from 'tmp-promise';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import Citation from '@pubpub/editor/addons/Citation';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { Pub, Version } from '../server/models';

// const fsReadFile = Promise.promisify(fs.readFile);
tmp.setGracefulCleanup();
// const fsWriteFile = Promise.promisify(fs.writeFile);

const dataDir = process.env.NODE_ENV === 'production'
	? '--data-dir=/app/.apt/usr/share/pandoc/data '
	: '';

export default (pubId, sourceUrl)=> {
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

	tmp.file({ postfix: `.${extension}` })
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
				if (err) reject(err);
				resolve(result);
			});
		});
	})
	.then((convertedHtml)=> {
		console.log(convertedHtml);
	})
	.catch((err)=> {
		console.log('Error!', err);
	});
};
