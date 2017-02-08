if (process.env.NODE_ENV !== 'production') {
	require('./config');
}

require('babel-core/register');

require.extensions['.css'] = () => { return; };

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const dev = require('webpack-dev-middleware');
const hot = require('webpack-hot-middleware');
const config = require('./webpack.config');

const port = process.env.PORT || 3000;
const server = express();
global.__ENVIRONMENT__ = process.env.NODE_ENV || 'default';

// Otherwise errors thrown in Promise routines will be silently swallowed.
// (e.g. any error during rendering the app server-side!)
process.on('unhandledRejection', (reason, promise) => {
	if (reason.stack) {
		console.error(reason.stack);
	} else {
		console.error('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	}
});

server.use('/opensearch.xml', express.static(path.resolve(__dirname, 'static/opensearch.xml')));
server.use('/favicon.ico', express.static(path.resolve(__dirname, 'static/favicon.ico')));
server.use('/robots.txt', express.static(path.resolve(__dirname, 'static/robots.txt')));
server.use('/static', express.static(path.resolve(__dirname, 'static')));
server.use('/dist', express.static(path.resolve(__dirname, 'dist')));


const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	target: process.env.API_URL || 'http://localhost:9876',
});

server.use('/api', (req, res) => {
	proxy.web(req, res);
});

proxy.on('error', (error, req, res) => {
	// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
	if (error.code !== 'ECONNRESET') { console.error('proxy error', error); }
	if (!res.headersSent) { res.writeHead(500, { 'content-type': 'application/json' }); }
	res.end(JSON.stringify({ error: 'proxy_error', reason: error.message }));
});

if (!process.env.NODE_ENV) {
	const compiler = webpack(config);

	server.use(dev(compiler, {
		publicPath: config.output.publicPath,
		stats: {
			colors: true,
			hash: false,
			assets: false,
			children: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false,
		}
	}));
	server.use(hot(compiler));
	compiler.plugin('done', ()=> {
		const translate = require('./translations/compileTranslations');
		translate();
	});

	server.get('/*', function(req, res) {
		res.sendFile(path.resolve(__dirname, 'index.html'));
	});

} else {
	server.use(express.static(path.resolve(__dirname, 'dist')));
	server.get('/*', function(req, res) {
		res.sendFile(path.resolve(__dirname, 'dist/index.html'));
	});
}


server.listen(port, (err) => {
	if (err) console.error(err);
	console.info(`⚡⚡⚡ Server running on http://localhost:${port}/`);
});
