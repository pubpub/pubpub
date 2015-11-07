import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import DocumentMeta from 'react-document-meta';
import Radium from 'radium';


/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
@Radium
export default class Html extends Component {
	static propTypes = {
		assets: PropTypes.object,
		component: PropTypes.node,
		store: PropTypes.object
	}

	render() {
		const {assets, component, store} = this.props;
		const content = component ? ReactDOM.renderToString(component) : '';

		return (
			<html lang="en-us">
				<head>
					<meta charSet="utf-8"/>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					{DocumentMeta.renderAsReact()}

					<link rel="shortcut icon" href="/favicon.ico" />
					<link href='https://fonts.googleapis.com/css?family=Lato:300,900italic' rel='stylesheet' type='text/css' />
					{/* styles (will be present only in production with webpack extract text plugin) */}
					{Object.keys(assets.styles).map((style, key) =>
						<link href={assets.styles[style]} key={key} media="screen, projection"
									rel="stylesheet" type="text/css"/>
					)}
				</head>
				<body style={styles.body}>
					<div id="content" dangerouslySetInnerHTML={{__html: content}}/>
					<script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} />
					<script src={assets.javascript.main}/>
				</body>
			</html>
		);
	}
}


var styles = {
	body:{
		margin: 0,
		width: '100%'
	}
}
