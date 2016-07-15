import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import {parser} from './parser';
import {serializer} from './serializer';
import {schema} from './schema';
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
			showMedia: false,
		};
	},

	componentDidMount() {
		// window.toggleMedia = this.toggleMedia;
		const docJSON = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'docJSON']);
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('./pubpubSetup');
		
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

		pm.on.change.add((evt)=>{
			const md = serializer.serialize(pm.doc);
			document.getElementById('markdown').value = md;
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

	markdownChange: function(evt) {
		pm.setDoc(parser.parse(evt.target.value));
	},

	getSaveVersionContent: function() {
		return {
			markdown: serializer.serialize(pm.doc),
			docJSON: pm.doc.toJSON(),
		};
	},

	// toggleMedia: function(pm, callback, node) {
	// 	console.log(arguments);
	// 	this.setState({showMedia: !this.state.showMedia});
	// 	const cb = callback || function(eee){console.log('You shouldnt be seeing this ', eee);};
	// 	setTimeout(function() {
	// 		cb({source: "omg", className: "sickClass"});	
	// 	}, 1500);
		
	// },

	render: function() {
		return (
			<div style={styles.container}>
				
				<textarea id="markdown" onChange={this.markdownChange} style={styles.textarea}></textarea>
				<div id={'atom-reader'} style={styles.wsywigBlock}></div>
				{/* <div style={[styles.media, !this.state.showMedia && {opacity: 0, pointerEvents: 'none', transform: 'scale(0.9)'}]}>MEDIA</div> */}
				
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
	textarea: {
		width: '90%',
		margin: '0px',
		minHeight: '80vh',
		display: 'none',
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
	media: {
		position: 'fixed',
		width: 100,
		height: 100,
		backgroundColor: 'red',
		top: '50px',
		opacity: 1,
		transform: 'scale(1.0)',
		transition: '.1s linear opacity, .1s linear transform',
	},
	
};
