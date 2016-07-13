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
			place: document.getElementById('prosemirror-wrapper'),
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
					'.ProseMirror-content': {outline: 'none'},
				}} />

				<textarea id="markdown" onChange={this.markdownChange} style={styles.textarea}></textarea>
				<div id={'prosemirror-wrapper'} style={[styles.block, styles.codeBlock]}></div>
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {
	container: {
		display: 'table',
		width: '100%',
	},
	block: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '50%',
	},
	codeBlock: {
		backgroundColor: '#F3F3F4',
	},
	previewBlock: {
		boxShadow: '0px 2px 2px #aaa',
	},
	textarea: {
		width: '90%',
		margin: '0px',
		minHeight: '80vh',
	}
};
