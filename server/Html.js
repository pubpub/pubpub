import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'containers/Wrapper';

let manifest;
try {
	/* eslint-disable-next-line global-require, import/no-unresolved */
	manifest = require('../dist/manifest.json');
} catch (err) {
	// No Manifest file. Must be dev mode.
}

const propTypes = {
	// children: PropTypes.node.isRequired,
	chunkName: PropTypes.string.isRequired,
	initialData: PropTypes.object.isRequired,
	viewData: PropTypes.object,
	headerComponents: PropTypes.array.isRequired,
};

const defaultProps = {
	viewData: {},
};

const Html = (props) => {
	const getPath = (chunkName, extension) => {
		let manifestUrl = manifest
			? `${manifest[`${chunkName}.${extension}`]}`
			: `${chunkName}.${extension}`;

		/* If we're on a hosted dev server, remove the static path */
		/* Note that fonts will still be sourced from static.pubpub */
		/* so if viewing those needs to be tested, the webpack config */
		/* needs to change. */

		/* TODO: Uncomment when v6 is live */
		// if (!props.initialData.locationData.isPubPubProduction) {
		manifestUrl = manifestUrl.replace('https://static.pubpub.org', '');
		// }

		return manifestUrl;
	};

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{props.headerComponents}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta
					name="google-site-verification"
					content="jmmJFnkSOeIEuS54adOzGMwc0kwpsa8wQ-L4GyPpPDg"
				/>
				<link rel="stylesheet" type="text/css" href={getPath('baseStyle', 'css')} />
				<link rel="stylesheet" type="text/css" href={getPath('vendor', 'css')} />
				<link rel="stylesheet" type="text/css" href={getPath('main', 'css')} />
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title={props.initialData.communityData.title}
					href="/opensearch.xml"
				/>
			</head>
			<body>
				<div id="root">
					<Wrapper
						initialData={props.initialData}
						viewData={props.viewData}
						chunkName={props.chunkName}
					/>
				</div>
				<script
					crossOrigin="anonymous"
					src="https://polyfill.io/v3/polyfill.min.js?features=default,fetch,HTMLCanvasElement.prototype.toBlob,Object.entries,Object.values,URL,Promise,Object.assign,Number.isNaN,String.prototype.includes"
				/>
				<script
					id="initial-data"
					type="text/plain"
					data-json={JSON.stringify(props.initialData)}
				/>
				<script
					id="view-data"
					type="text/plain"
					data-json={JSON.stringify(props.viewData)}
				/>
				<script
					id="chunk-name"
					type="text/plain"
					data-json={JSON.stringify(props.chunkName)}
				/>
				<script src={getPath('vendor', 'js')} />
				<script src={getPath('main', 'js')} />
			</body>
		</html>
	);
};

Html.propTypes = propTypes;
Html.defaultProps = defaultProps;
export default Html;
