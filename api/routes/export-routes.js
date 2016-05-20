const app = require('../api');
const pdf = require('html-pdf');
const fs = require('fs');
const Pub = require('../models').Pub;

import React from 'react';
import ReactDOM from 'react-dom/server';
import {PubBody} from 'components';
import {StyleRoot} from 'radium';
import {IntlProvider} from 'react-intl';

export function getPDF(req, res) {
	const css = fs.readFileSync(__dirname + '/../../static/css/basePub.css', 'utf8');
	const exportCSS = fs.readFileSync(__dirname + '/../../static/css/exportPub.css', 'utf8');

	// return res.status(201).json(css);
	Pub.findOne({slug: req.query.slug}, {slug: 1, title: 1, createDate: 1, lastUpdated: 1, markdown: 1, isPublished: 1, history: 1})
	.lean().exec(function(errPubFind, pub) {
		if (errPubFind) { console.log(errPubFind); return res.status(500).json(errPubFind);}
		if (!pub || !pub.history || !pub.history.length) {return res.status(200).json('Pub Not Found');}

		let languageObject = {};
		const locale = 'en';
		fs.readFile(__dirname + '/../../translations/languages/' + locale + '.json', 'utf8', function(errFSRead, data) {
			if (errFSRead) { console.log(errFSRead); }

			languageObject = JSON.parse(data);

			// console.log(pub);
			const pubHTML = ReactDOM.renderToStaticMarkup(
				<IntlProvider locale={'en'} messages={languageObject}>
					<StyleRoot radiumConfig={{userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}>
						<PubBody
							markdown={pub.markdown}
							isPublished={pub.isPublished}
							isFeatured={true} />
					</StyleRoot>
				</IntlProvider>
			);

			const options = {
				format: 'A4',
				border: {
					top: '.5in',
					bottom: '.5in',
				}
			};

			const dynamicStyle = pub.history[pub.history.length - 1] && pub.history[pub.history.length - 1].styleScoped;

			const html = `<!doctype html>
				<html lang="en-us">
					<head>
						<style> ${css} body{font-size:10px;}</style>
						<style> ${exportCSS} </style>
						<style id="dynamicStyle">${dynamicStyle}</style>
					</head>

					<body>
						${pubHTML}
					</body>
				</html>`;

			pdf.create(html, options).toFile('./pdfs/' + pub.title + '.pdf', function(err, result) {
				if (err) return console.log(err);
				res.download(result.filename, result.filename, function(downloadErr, downloadResult) {
					res.status(200).end();
				});

			});

		});

	});

}
app.get('/print', getPDF);
