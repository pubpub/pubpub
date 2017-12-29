import React from 'react';
import PropTypes from 'prop-types';

let manifest;
try {
	manifest = require('../dist/manifest.json');
} catch (err) {
	console.log('No Manifest file');
}


const propTypes = {
	children: PropTypes.node.isRequired,
	chunkName: PropTypes.string.isRequired,
	initialData: PropTypes.object.isRequired,
	headerComponents: PropTypes.array.isRequired,
};

const Html = (props) => {
	const getPath = (chunkName, extension)=> {
		return manifest
			? `/dist/${manifest[`${chunkName}.${extension}`]}`
			: `/dist/${chunkName}.${extension}`;
	};

	return (
		<html lang="en">
			<head>
				{props.headerComponents}
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="icon" type="image/png" sizes="256x256" href="/favicon.png" />
				<link rel="stylesheet" type="text/css" href={getPath('baseStyle', 'css')} />
				<link rel="stylesheet" type="text/css" href={getPath(props.chunkName, 'css')} />
			</head>
			<body>
				<div id="root">
					{props.children}
				</div>
				<script id="initial-data" type="text/plain" data-json={JSON.stringify(props.initialData)} />
				<script src={getPath('vendor', 'js')} />
				<script src={getPath(props.chunkName, 'js')} />
			</body>
		</html>
	);
};

Html.propTypes = propTypes;
export default Html;
