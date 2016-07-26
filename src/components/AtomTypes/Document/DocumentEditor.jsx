import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Media} from 'containers';

import {markdownParser, markdownSerializer, schema} from './proseEditor';
import {Subscription, StoppableSubscription} from 'subscription';
import {Node} from 'prosemirror/dist/model';

let styles;
let pm;

export const DocumentEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	getInitialState() {
		return {
			showMarkdown: false,
		};
	},

	componentDidMount() {
		const docJSON = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'docJSON']);
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('./proseEditor/pubpubSetup');
		
		pm = new prosemirror.ProseMirror({
			place: document.getElementById('atom-reader'),
			schema: schema,
			plugins: [pubpubSetup],
			doc: !!docJSON ? Node.fromJSON(schema, docJSON) : null,
			on: {
				change: new Subscription,
				doubleClickOn: new StoppableSubscription,
			}
		});

		this.proseChange();

		pm.on.change.add((evt)=>{
			this.proseChange();
		});

		pm.on.doubleClickOn.add((pos, node, nodePos)=>{
			if (node.type.name === 'embed') {
				const done = (attrs)=> { 
					pm.tr.setNodeType(nodePos, node.type, attrs).apply(); 
				};
				window.toggleMedia(pm, done, node);
				return true;
			}
		});

	},

	proseChange: function() {
		const md = markdownSerializer.serialize(pm.doc);
		document.getElementById('markdown').value = md;
	},

	markdownChange: function(evt) {
		pm.setDoc(markdownParser.parse(evt.target.value));
	},

	getSaveVersionContent: function() {
		return {
			markdown: markdownSerializer.serialize(pm.doc),
			docJSON: pm.doc.toJSON(),
		};
	},

	toggleMarkdown: function() {
		this.setState({showMarkdown: !this.state.showMarkdown});
	},

	render: function() {
		return (
			<div style={styles.container}>
				
				<Media/>

				<div className={'opacity-on-hover'} style={styles.iconLeft} onClick={this.toggleMarkdown}></div>

				<textarea id="markdown" onChange={this.markdownChange} style={[styles.textarea, this.state.showMarkdown && styles.textareaVisible]}></textarea>
				<div id={'atom-reader'} className={'atom-reader'} style={[styles.wsywigBlock, this.state.showMarkdown && styles.wsywigWithMarkdown]}></div>

				
			</div>
		);
	}
});

export default Radium(DocumentEditor);

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
	iconLeft: {
		position: 'absolute',
		width: '1.5em',
		height: '100%',
		cursor: 'pointer',
		top: 0,
		left: 0,
		opacity: 0,
		backgroundColor: '#BBBDC0',
		borderRight: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	textarea: {
		margin: '0px',
		minHeight: '80vh',
		opacity: '0',
		position: 'absolute',
		height: 'calc(100% - 2em)',
		pointerEvents: 'none',
		width: 'calc(50% - 4em)',
		maxWidth: 'calc(650px + 10em)',
	},
	textareaVisible: {
		opacity: '1',
		pointerEvents: 'auto',
	},
	wsywigBlock: {
		maxWidth: 'calc(650px + 10em)',
		backgroundColor: 'white',
		margin: '0 auto',
		boxShadow: '0px 1px 3px 1px #BBBDC0',
		minHeight: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100%)',
		},
	},
	wsywigWithMarkdown: {
		position: 'relative',
		left: 'calc(50% + 2em)',
		width: 'calc(50% - 4em)',
		margin: '0',

	},
	
};
