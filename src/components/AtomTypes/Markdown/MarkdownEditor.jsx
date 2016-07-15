import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import {parser} from './parser';
import {serializer} from './serializer';
import {schema} from './schema';
import {Subscription} from 'subscription';
import {Node} from 'prosemirror/dist/model';

let styles;
let pm;
let prosemirror;

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	componentDidMount() {
		const markdown = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'markdown']);
		prosemirror = require('prosemirror');
		const {pubpubSetup} = require('./pubpubSetup');
		const {buildMenuItems} = require('./menu');
		const {menuBar, MenuItem} = require('prosemirror/dist/menu');
		
		pm = new prosemirror.ProseMirror({
			place: document.getElementById('atom-reader'),
			schema: schema,
			plugins: [pubpubSetup],
			doc: !!markdown ? Node.fromJSON(schema, markdown) : null,
			on: {
				change: new Subscription,
			}

		});

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
		return {
			// markdown: serializer.serialize(pm.doc)
			markdown: pm.doc.toJSON(),
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				<Style rules={{
					'.ProseMirror-content': {outline: 'none', minHeight: '600px', padding: '0em 5em 1em 5em'},
					'.ProseMirror-selectednode': {outline: '2px solid #808284'}
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
		minHeight: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100%)',
		},
	},
	
};
