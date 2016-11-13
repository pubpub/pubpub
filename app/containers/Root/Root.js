/* global __ENVIRONMENT__ __MAINBUNDLE__ */

import React, { PropTypes } from 'react';
import Radium from 'radium';

export const Root = React.createClass({
	propTypes: {
		content: PropTypes.object,
		initialState: PropTypes.object,
		head: PropTypes.object,
	},

	renderInitialState: function() {
		if (this.props.initialState) {
			const innerHtml = `window.__INITIAL_STATE__ = ${JSON.stringify(this.props.initialState)}`;
			return <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
		}
		return null;
	},

	renderEnvironment: function() {
		const innerHtml = `window.__ENVIRONMENT__ = '${__ENVIRONMENT__}'`;
		return <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
	},

	render() {
		const head = this.props.head;
		// In production, we load the CSS file to avoid flicker. In dev, we import it to have HMR work.
		const cssString = process.env.NODE_ENV === 'production' ? <link href="/static/style.css" rel="stylesheet" type="text/css" /> : null;

		return (
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en" />
					<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css" />
					<link href="https://assets.pubpub.org/_fonts/Yrsa.css" rel="stylesheet" type="text/css" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="google-site-verification" content="s8F1PnVMuOT2D-UM6acNzl2thVY_e5s_-Uc83bj27KY" />
					<link rel="shortcut icon" href="/static/favicon.ico" />
					{cssString}
					{head.title.toComponent()}
					{head.meta.toComponent()}
					{head.link.toComponent()}
				</head>
				<body>
					<div id="root">{this.props.content}</div>
					{this.renderEnvironment()}
					{this.renderInitialState()}
					{head.script.toComponent()}
					<script src={!process.env.NODE_ENV ? '/app.js' : '/' + __MAINBUNDLE__} />
				</body>
			</html>
		);
	}
});

export default Radium(Root);
