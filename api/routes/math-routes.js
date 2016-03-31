const app = require('../api');
let mjAPI = undefined;

function startMathJax() {
	mjAPI = require('MathJax-node/lib/mj-single');
	mjAPI.config({
		MathJax: {
			SVG: {
				font: 'STIX-Web'
			},
			tex2jax: {
				preview: ['[math]'],
				processEscapes: true,
				processClass: ['math'],
				inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
				displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
				skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
			},
			TeX: {
				noUndefined: {disabled: true},
				Macros: {
					mbox: ['{\\text{#1}}', 1],
					mb: ['{\\mathbf{#1}}', 1],
					mc: ['{\\mathcal{#1}}', 1],
					mi: ['{\\mathit{#1}}', 1],
					mr: ['{\\mathrm{#1}}', 1],
					ms: ['{\\mathsf{#1}}', 1],
					mt: ['{\\mathtt{#1}}', 1]
				}
			}
		}
	});
	mjAPI.start();
	return mjAPI;
}

export function mathtest(req, res) {
	const equation = req.query.equation;

	if (!mjAPI) {
		console.log('Starting mathjax!');

		try {
			mjAPI = startMathJax();
		} catch (err) {
			console.log('Error starting mathjax!!');
		}
	}

	const params = {
		'format': 'TeX',
		// 'math': 'b + y = \\sqrt{f} = \\sum_n^5 {x}',
		'math': equation,
		'svg': true,
		'mml': false,
		'png': false,
		'speakText': true,
		'speakRuleset': 'mathspeak',
		'speakStyle': 'default',
		'ex': 6,
		'width': 1000000,
		'linebreaks': false
	};

	try {

		mjAPI.typeset(params, function(result) {
			console.log('Rendered ' + equation);
			if (!result.errors) {
				if (params.svg) {
					res.writeHead(200, {'Content-Type': 'image/svg+xml'});
					res.end(result.svg);
				} else if (params.mml) {
					res.writeHead(200, {'Content-Type': 'application/mathml+xml'});
					res.end(result.mml);
				} else if (params.png) {
					res.writeHead(200, {'Content-Type': 'image/png'});
					res.end(new Buffer(result.png.slice(22), 'base64'));
				}
			} else {
				res.writeHead(400, {'Content-Type': 'text/plain'});
				res.write('Error 400: Request Failed. \n');
				res.write(String(result.errors) + '\n');
				res.end();
			}
		});
	} catch (err) {
		res.write('error!');
	}

	return;
}
app.get('/mathtest', mathtest);
