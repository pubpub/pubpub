import chash from 'color-hash';
import murmurhash from 'murmurhash';
import Dropzone from 'react-dropzone';
import Radium, {Style} from 'radium';
import React, {PropTypes} from 'react';
import {Media} from 'components';
import {MD5} from 'object-hash';
import {Node} from 'prosemirror-model';
import {FormattedMessage} from 'react-intl';
import {Subscription, StoppableSubscription} from 'subscription';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';

import ElementSchema from './proseEditor/elementSchema';
import EmbedEditor from './proseEditor/EmbedEditor';
import StatusTray from './DocumentEditorStatusTray';
import {schema as pubSchema, migrateMarks, migrateDiffs} from './proseEditor/schema';

// import {markdownParser, markdownSerializer, schema} from './proseEditor';

const ColorHash = new chash();

let styles;
let pm;

let menuBar;
// let currentNodeSelected;
export const DocumentEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		loginData: PropTypes.object,
	},

	getInitialState() {
		return {
			showMarkdown: false,
			participants: [],
			statusMsg: '',
			status: 'loading',
		};
	},


	componentDidMount() {
		// return;

		const {ModServerCommunications} = require('./collab/server-communications');
		const {ModCollab} = require('./collab/mod');


		const token = safeGetInToJS(this.props.atomData, ['token']);
		const tokenValid = safeGetInToJS(this.props.atomData, ['tokenValid']);

		const that = this;

		// Ignore setDoc
		// pm.on.beforeSetDoc.remove(pm.mod.collab.onSetDoc);
	  // pm.mod.collab.onSetDoc = function() {};
		// Trigger reset on setDoc
		/*
		pm.mod.collab.afterSetDoc = function() {
			// Reset all collab values and set document version
			const collab = pm.mod.collab;
			collab.versionDoc = pm.doc;
			collab.unconfirmedSteps = [];
			collab.unconfirmedMaps = [];
		};
		*/
		// pm.on.setDoc.add(pm.mod.collab.afterSetDoc);

		const collab = {};
		collab.docInfo = {
			rights: '',
			last_diffs: [],
			is_owner: false,
			is_new: false,
			titleChanged: false,
			changed: false,
		};
		collab.mod = {};
		collab.waitingForDocument = true;
		collab.schema = pubSchema;
		collab.receiveDocument = this.receiveDocument;
		collab.receiveDocumentValues = this.receiveDocumentValues;
		collab.askForDocument = this.askForDocument;
		collab.getHash = this.getHash;
		collab.updateParticipants = this.updateParticipants;
		collab.applyAction = this.applyAction;
		collab.getId = this.getId;

		collab.getState = () => {
			return this.pm;
		};

		collab.setConnectionStatus = this.setConnectionStatus;

		collab.setParticipants = function(participants) {
			that.setState({participants: participants});
		};


		// Collaboration Authentication information
		const atomID = safeGetInToJS(this.props.atomData, ['atomData', '_id']);
		collab.doc_id = atomID;
		const user = safeGetInToJS(this.props.loginData, ['userData', 'username']);
		collab.username = user;
		collab.token = token;
		const img = safeGetInToJS(this.props.loginData, ['userData', 'image']);
		collab.img = img;


		collab.doc = {id: atomID};

		this.collab = collab;

		new ModServerCommunications(collab);
		new ModCollab(collab);


		/*
		pm.on.change.add(function() {
			that.collab.docInfo.changed = true;
		});
		*/
		this.collab.mod.serverCommunications.init();
		this.setSaveTimers();

		// this.proseChange();

		/*
		pm.on.change.add((evt)=>{
			this.proseChange();
		});
		*/

		/*
		pm.on.doubleClickOn.add((pos, node, nodePos)=>{
			if (node.type.name === 'embed') {
				const done = (attrs)=> {
					pm.tr.setNodeType(nodePos, node.type, attrs).apply();
				};
				window.toggleMedia(pm, done, node);
				return true;
			}
		});
		*/

		// pm.on.transformPastedHTML.add(this.transformHTML);

		//

		// this.moveMenu();
	},

	setConnectionStatus: function(status, statusMsg) {
		this.setState({status, statusMsg});
	},

	transformHTML: function(htmlText) {
		const htmlNode = document.createElement( 'div' );
		htmlNode.innerHTML = htmlText;
		const el = htmlNode.querySelectorAll('.embed');
		for (const element of el) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
		const removeElements = htmlNode.querySelectorAll('.hoverChild');
		for (const element of removeElements) {
			element.remove();
		}
		return htmlNode.innerHTML;
	},

	updateEmbedEditor: function({embedLayoutCoords, embedAttrs}) {
		this.setState({
			embedLayoutCoords,
			embedAttrs,
		});
	},


	// only use block or embed elements
	setEmbedAttribute: function(key, value, evt) {
		const currentSelection = this.pm.selection;
		const currentFrom = currentSelection.$from.pos;
		const currentSelectedNode = currentSelection.node;
		if (evt) { evt.stopPropagation(); }
		let nodeType = currentSelectedNode.type;
		const schema = currentSelectedNode.type.schema;
		if (key === 'align') {
			if (value === 'inline') {
				nodeType = schema.nodes.embed;
			} else {
				nodeType = schema.nodes.block_embed;
			}
		}
		this.pm.tr.setNodeType(currentFrom, nodeType, {...currentSelectedNode.attrs, [key]: value}).apply();
	},

	sizeChange: function(evt) {
		this.setEmbedAttribute('size', evt.target.value);
	},
	captionChange: function(evt) {
		this.setEmbedAttribute('caption', evt.target.value);
	},

	moveMenu: function() {
		if (typeof(document) !== 'undefined') {
			menuBar = document.getElementsByClassName('ProseMirror-menubar')[0];
			const menuBarPlaceholder = document.getElementById('headerPlaceholder');
			menuBarPlaceholder.appendChild(menuBar);
		}
	},
	removeMenu: function() {
		if (typeof(document) !== 'undefined') {
			const menuBarPlaceholder = document.getElementById('headerPlaceholder');
			menuBarPlaceholder.innerHTML = '';

			const participantsPlaceholder = document.getElementById('editor-participants');
			participantsPlaceholder.innerHTML = '';

		}
	},

	componentWillUnmount: function() {
		this.collab.mod.serverCommunications.close();
		window.clearInterval(this.sendDocumentTimer);
		this.removeMenu();
	},
	// Collects updates of the document from ProseMirror and saves it under this.doc
	getUpdates: function(callback) {
		this.collab.doc.hash = this.getHash();
		return;
		const tmpDoc = this.editorToModel(this.collab.pm.mod.collab.versionDoc);
		this.collab.doc.contents = tmpDoc.contents;
		// this.doc.metadata = tmpDoc.metadata
		// this.doc.title = this.pm.mod.collab.versionDoc.firstChild.textContent
		// this.doc.version = this.pm.mod.collab.version
		this.collab.doc.hash = this.getHash();
		// this.doc.comments = this.mod.comments.store.comments
		if (callback) {
			callback();
		}
	},

	setSaveTimers: function() {
		const that = this;
		// Set Auto-save to send the document every two minutes, if it has changed.
		this.sendDocumentTimer = window.setInterval(function() {
			if (that.collab.docInfo && that.collab.docInfo.changed) {
				that.save();
			}
		}, 60000);
	},


	getHash: function() {
		// const doc = this.collab.pm.mod.collab.versionDoc.copy();
		const doc = this.pm.doc;
		// We need to convert the footnotes from HTML to PM nodes and from that
		// to JavaScript objects, to ensure that the attribute order of everything
		// within the footnote will be the same in all browsers, so that the
		// resulting checksums are the same.
		// doc.descendants(function(node){
		// 	if (node.type.name==='footnote') {
		// 		node.attr.contents = this.mod.footnotes.fnEditor.htmlTofootnoteNode(node.attr.contents)
		// 	}
		// })
		return MD5(JSON.parse(JSON.stringify(doc.toJSON())), {unorderedArrays: true});
	},


	//
	// Update - Update document and use a JSON
	//

	applyAction: function(action) {
		const newState = this.view.editor.state.applyAction(action);
		this.pm = newState;
		this.view.updateState(newState);
		// console.log('Action: ', action);
	},

	changeNode: function(currentFrom, nodeType, nodeAttrs) {
		const state = this.pm;
		const transform = state.tr.setNodeType(currentFrom, nodeType, nodeAttrs);
		const action = transform.action();
		this.applyAction(action);
	},


	getId: function() {
		return safeGetInToJS(this.props.loginData, ['userData', '_id']);
	},

	update: function() {

		const that = this;

		const {pubpubSetup, buildMenuItems} = require('./proseEditor/pubpubSetup');
		const {EditorState} = require('prosemirror-state');
		const {MenuBarEditorView, MenuItem} = require('prosemirror-menu');

		const nodeConvert = require('./collab/node-convert');
		this.editorToModel = nodeConvert.editorToModel;
		this.modelToEditor = nodeConvert.modelToEditor;

		const collabEditing = require('prosemirror-collab').collab;
		const {DOMParser} = require("prosemirror-model");


		this.pubpubSetup = pubpubSetup;
		this.collabEditing = collabEditing;
		this.EditorState = EditorState;

		const userId = this.getId();

		const menu = buildMenuItems(pubSchema);
		// TO-DO: USE UNIQUE ID FOR USER AND VERSION NUMBER
		// USE DEFAULT schema

		migrateMarks(this.collab.doc.contents);

		pm = EditorState.create({
			doc: pubSchema.nodeFromJSON(this.collab.doc.contents),
			plugins: [pubpubSetup({schema: pubSchema}), collabEditing({version: this.collab.doc.version, clientID: userId})],
		});

		const view = new MenuBarEditorView(document.getElementById('atom-body-editor'), {
		  state: pm,
		  onAction: (action) => {
				const newState = view.editor.state.applyAction(action);
				this.pm = newState;
				view.updateState(newState);
				that.collab.mod.collab.docChanges.sendToCollaborators();
				if (action.type === "selection" && action.selection.node) {
					ElementSchema.onNodeSelect(newState, action.selection);
				}
			},
		  menuContent: menu.fullMenu,
			spellcheck: true,
		});

		this.pm = pm;
		this.view = view;
		this.collab.pm = pm;
		this.collab.currentPm = pm;

		this.collab.mod.collab.docChanges.cancelCurrentlyCheckingVersion();
		this.collab.mod.collab.docChanges.unconfirmedSteps = {};
		if (this.collab.mod.collab.docChanges.awaitingDiffResponse) {
			this.collab.mod.collab.docChanges.enableDiffSending();
		}

		// that.collab.pm.mod.collab.version = this.collab.doc.version;

		migrateDiffs(this.collab.docInfo.last_diffs);
		const appliedAction = this.collab.mod.collab.docChanges.applyAllDiffs(this.collab.docInfo.last_diffs);
		if (appliedAction) {
				// this.applyAction(appliedAction);
		} else {
				// indicates that the DOM is broken and cannot be repaired
				this.collab.mod.serverCommunications.disconnect();
		}

		ElementSchema.initiateProseMirror({
			changeNode: this.changeNode,
			updateMenuCallback: this.updateEmbedEdito,
			setEmbedAttribute: this.setEmbedAttribute,
		});

		// TO MIGRATE
		// this.collab.doc.hash = this.getHash();
		// this.collab.mod.comments.store.setVersion(this.doc.comment_version)


		// TO MIGRATE
		/*
		this.collab.pm.mod.collab.mustSend.add(function() {
			that.collab.mod.collab.docChanges.sendToCollaborators();
		}, 0);
		*/

		// priority : 0 so that other things cna be scheduled before this.
		// this.collab.pm.mod.collab.receivedTransform.add((transform, options) => {that.onTransform(transform, false)})
		// this.collab.mod.footnotes.fnEditor.renderAllFootnotes()
		// _.each(this.collab.doc.comments, function(comment) {
		// 		that.collab.mod.comments.store.addLocalComment(comment.id, comment.user,
		// 				comment.collab.userName, comment.userAvatar, comment.date, comment.comment,
		// 				comment.collab.answers, comment['review:isMajor'])
		// })
		// this.collab.mod.comments.store.on("mustSend", function() {
		// 		that.collab.mod.collab.docChanges.sendToCollaborators()
		// })
		this.collab.waitingForDocument = false;
	},

	askForDocument: function() {
		if (this.collab.waitingForDocument) {
			return;
		}
		this.collab.waitingForDocument = true;
		this.collab.mod.serverCommunications.send({
			type: 'get_document'
		});
	},

	receiveDocument: function(data) {
		// const that = this;
		this.collab.receiveDocumentValues(data.document, data.document_values);
		this.update();
		if (data.hasOwnProperty('user')) {
			this.collab.user = data.user;
		}

		this.collab.mod.serverCommunications.send({
			type: 'participant_update'
		});

	},

	receiveDocumentValues: function(dataDoc, dataDocInfo) {
		this.collab.doc = dataDoc;
		this.collab.docInfo = dataDocInfo;
		this.collab.docInfo.changed = false;
		this.collab.docInfo.titleChanged = false;
	},

	// Get updates to document and then send updates to the server
	save: function(callback) {
		// console.log('Started save');
		const that = this;
		this.getUpdates(function() {
			that.sendDocumentUpdate(function() {
				// console.log('Finished save');
				if (callback) {
					callback();
				}
			});
		});
	},

	// Send changes to the document to the server
	sendDocumentUpdate: function(callback) {
		const documentData = {
			// title: this.doc.title,
			// metadata: this.doc.metadata,
			contents: this.collab.doc.contents,
			version: this.collab.doc.version,
			hash: this.collab.doc.hash
		};

		this.collab.mod.serverCommunications.send({
			type: 'update_document',
			document: documentData
		});

		this.collab.docInfo.changed = false;

		if (callback) {
			callback();
		}
		return true;
	},

	updateParticipants: function(participants) {
		// console.log('Got participants', participants);
		if (!this._calledComponentWillUnmount) {
			this.collab.mod.collab.updateParticipantList(participants);
			this.setState({participants});
		}

	},

	proseChange: function() {
		// const md = markdownSerializer.serialize(pm.doc);
		// document.getElementById('markdown').value = md;
	},

	markdownChange: function(evt) {
		// this.pm.setDoc(markdownParser.parse(evt.target.value));
	},

	getSaveVersionContent: function() {
		return {
			// markdown: markdownSerializer.serialize(this.pm.doc),
			markdown: '',
			docJSON: '',
			// docJSON: this.getState().toJSON(),
		};
	},

	toggleMarkdown: function() {
		this.setState({showMarkdown: !this.state.showMarkdown});
	},

	// onDrop: function(files) {
	// 	console.log(pm, files);
	// 	console.log(this.refs.mediaRef);
	// 	console.log(this.refs.mediaRef.onDrop);
	// 	// function done(attrs) {
	// 	// 	const newNode = pm.schema.nodes.embed.create(attrs);
	// 	// 	pm.tr.insert(start, newNode).apply();
	// 	// }
	// 	// window.toggleMedia(pm, done, schema.nodes.embed);
	// },

	render: function() {

		const colorMap = {};
		this.state.participants.map((participant, index) => {
			const color = ColorHash.rgb(participant.name);
			const colorStr = `rgba(${color[0]},${color[1]},${color[2]},0.3)`;
			colorMap[`.user-bg-${index}`] = {backgroundColor: colorStr};
		});

		return (

			<div>

			<StatusTray participants={this.state.participants} statusMsg={this.state.statusMsg} status={this.state.status} />

			<div style={styles.container}>
			{/* <Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} > */}
				<Style rules={colorMap} />

				<Media ref={'mediaRef'}/>

				{/* <div className={'opacity-on-hover'} style={styles.iconLeft} onClick={this.toggleMarkdown}></div> */}

				<textarea id="markdown" onChange={this.markdownChange} style={[styles.textarea, this.state.showMarkdown && styles.textareaVisible]}></textarea>
				<div id={'atom-body-editor'} className={'document-body'} style={[styles.wsywigBlock, this.state.showMarkdown && styles.wsywigWithMarkdown]}>

					{this.state.embedLayoutCoords &&
						<div style={[styles.embedLayoutEditor, {left: this.state.embedLayoutCoords.left, top: this.state.embedLayoutCoords.bottom}]}>
							<EmbedEditor embedLayoutCoords={this.state.embedLayoutCoords} embedAttrs={this.state.embedAttrs} saveCallback={this.setEmbedAttribute}/>
						</div>
					}

				</div>



			{/* </Dropzone> */}
			</div>

			</div>

		);
	}
});

export default Radium(DocumentEditor);

styles = {
	container: {
		// width: '100%',
		// padding: '1em 2em',
		// left: '-2em',
		// backgroundColor: '#F3F3F4',
		// minHeight: '100vh',
		// position: 'relative',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	padding: '1em 1em',
		// 	left: '-1em',
		// },
	},
	embedLayoutEditor: {
		position: 'absolute',
		backgroundColor: 'white',
		// border: '2px solid #808284',
		// boxShadow: '0px 2px 4px #58585B',
		zIndex: '10000',
	},
	activeAlign: {
		color: 'red',
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
		// maxWidth: 'calc(650px + 10em)',
		backgroundColor: 'white',
		margin: '0 auto',
		position: 'relative',
		// boxShadow: '0px 1px 3px 1px #BBBDC0',
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
