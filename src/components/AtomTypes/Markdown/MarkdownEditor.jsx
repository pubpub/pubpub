import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';

import {parser} from './parser';
import {serializer} from './serializer';
import {schema} from './schema';
const {Subscription} = require('subscription');

let styles;
let pm;
let prosemirror;

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	componentDidMount() {
		prosemirror = require('prosemirror');
		const {exampleSetup, buildMenuItems} = require("prosemirror/dist/example-setup")
		const {tooltipMenu, menuBar} = require("prosemirror/dist/menu")
		pm = new prosemirror.ProseMirror({
			place: document.getElementById('atom-reader'),
			schema: schema,
			plugins: [exampleSetup.config({menuBar: false, tooltipMenu: false})],
			on: {
				change: new Subscription,
			}

		});
		let menu = buildMenuItems(schema);
		menuBar.config({float: true, content: menu.fullMenu}).attach(pm);

		pm.on.change.add((evt)=>{
			// const t0 = performance.now();
			const md = serializer.serialize(pm.doc);
			document.getElementById('markdown').value = md;
			// const t1 = performance.now();
			// console.log('Prose -> Markdown took ' + (t1 - t0) + ' milliseconds.');
		});

	},

	markdownChange: function(evt) {
		// const t0 = performance.now();
		pm.setDoc(parser.parse(evt.target.value));
		// const t1 = performance.now();
		// console.log('Markdown -> Prose took ' + (t1 - t0) + ' milliseconds.');
	},

	getSaveVersionContent: function() {
		// return {
		// 	markdown: this.state.markdown,
		// };
	},

	render: function() {
		return (
			<div style={styles.container}>
				<Style rules={{
					'.ProseMirror-content': {outline: 'none', minHeight: '600px', padding: '0em 5em 1em 5em'},
				}} />

				<textarea id="markdown" onChange={this.markdownChange} style={styles.textarea}></textarea>
				<div id={'atom-reader'} style={styles.wsywigBlock}></div>
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {
	container: {
		width: '100%',
		padding: '1em 2em',
		left: '-2em',
		backgroundColor: '#F3F3F4',
		minHeight: '100vh',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '1em 1em',
			left: '-1em',
		},
	},
	textarea: {
		width: '90%',
		margin: '0px',
		minHeight: '80vh',
		display: 'none',
	},
	wsywigBlock: {
		width: 'calc(650px + 10em)',
		maxWidth: 'initial',
		backgroundColor: 'white',
		margin: '0 auto',
		boxShadow: '0px 1px 3px 1px #BBBDC0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100%)',
		},
	},
	
};
