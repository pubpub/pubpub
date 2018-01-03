import Cite from 'citation-js';
import katex from 'katex';
import app from '../server';

app.post('/api/editor/citation-format', (req, res)=> {
	Cite.async(req.body.input)
	.then((data)=> {
		try {
			const output = data.get({
				format: 'string',
				type: 'html',
				style: 'citation-apa',
				lang: 'en-US'
			});
			if (output === '<div class="csl-bib-body">\n</div>') {
				return res.status(500).json('Error rendering citation');
			}
			return res.status(201).json(output);
		} catch (err) {
			return res.status(500).json(err);
		}
	});
});

app.post('/api/editor/latex-render', (req, res)=> {
	try {
		const renderedHTML = katex.renderToString(req.body.value, {
			displayMode: req.body.isBlock,
			throwOnError: false
		});
		return res.status(201).json(renderedHTML);
	} catch (err) {
		return res.status(201).json('<div class="pub-latex-error">Error rendering equation</div>');
	}
});
