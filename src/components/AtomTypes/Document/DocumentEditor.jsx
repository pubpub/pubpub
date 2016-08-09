import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Media} from 'containers';
import {MD5} from 'object-hash';
import chash from 'color-hash';

import {markdownParser, markdownSerializer, schema} from './proseEditor';
import {Subscription, StoppableSubscription} from 'subscription';
import {Node} from 'prosemirror/dist/model';

import Dropzone from 'react-dropzone';
import {s3Upload} from 'utils/uploadFile';

import {schema as pubSchema} from './proseEditor/schema';

const ColorHash = new chash();

let styles;
let pm;

let editorToModel;
let modelToEditor;

export const DocumentEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
		token: PropTypes.string,
		collab: PropTypes.string,
	},

	getInitialState() {
		return {
			showMarkdown: false,
			participants: [],
			error: '',
			loading: true,
		};
	},

	componentDidMount() {
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('./proseEditor/pubpubSetup');

		const {ModServerCommunications} = require('./collab/server-communications');
		const nodeConvert = require('./collab/node-convert');
		editorToModel = nodeConvert.editorToModel;
		modelToEditor = nodeConvert.modelToEditor;

		const {ModCollab} = require('./collab/mod');
		const {collabEditing} = require('prosemirror/dist/collab');

		const that = this;

		pm = new prosemirror.ProseMirror({
			place: document.getElementById('atom-reader'),
			schema: schema,
			plugins: [pubpubSetup, collabEditing.config({version: 0})],
			// doc: !!docJSON ? Node.fromJSON(schema, docJSON) : null,
			// doc: null,
			/*
			on: {
			change: new Subscription,
			doubleClickOn: new StoppableSubscription,
			}
			*/
		});
		const token = safeGetInToJS(this.props.atomEditData, ['token']);
		pm.mod = {};
		pm.mod.collab = collabEditing.get(pm);
		// Ignore setDoc
		pm.on.beforeSetDoc.remove(pm.mod.collab.onSetDoc);
		pm.mod.collab.onSetDoc = function() {};
		// Trigger reset on setDoc
		pm.mod.collab.afterSetDoc = function() {
			// Reset all collab values and set document version
			const collab = pm.mod.collab;
			collab.versionDoc = pm.doc;
			collab.unconfirmedSteps = [];
			collab.unconfirmedMaps = [];
		};
		pm.on.setDoc.add(pm.mod.collab.afterSetDoc);

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
		collab.pm = pm;
		collab.currentPm = pm;
		collab.waitingForDocument = true;
		collab.schema = pubSchema;
		collab.receiveDocument = this.receiveDocument;
		collab.receiveDocumentValues = this.receiveDocumentValues;
		collab.askForDocument = this.askForDocument;
		collab.getHash = this.getHash;
		collab.updateParticipants = this.updateParticipants;
		collab.setErrorState = function(error) {
			that.setState({error: error});
		};

		collab.setLoadingState = function(loading) {
			that.setState({loading: loading});

		};


		// Collaboration Authentication information
		const atomID = safeGetInToJS(this.props.atomEditData, ['atomData', '_id']);
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


		pm.on.change.add(function() {
			that.collab.docInfo.changed = true;
		});
		this.collab.mod.serverCommunications.init();
		this.setSaveTimers();

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
		const _collab = safeGetInToJS(this.props.atomEditData, ['collab']);

		if (!_collab) {
			this.setState({error: 'Disconnected. Your changes are not being saved.'})
		}
	},
	componentWillUnmount: function() {
		this.collab.mod.serverCommunications.close();
		window.clearInterval(this.sendDocumentTimer);
	},
	// Collects updates of the document from ProseMirror and saves it under this.doc
	getUpdates: function(callback) {
		const tmpDoc = editorToModel(this.collab.pm.mod.collab.versionDoc);
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
			if (that.docInfo && that.docInfo.changed) {
				that.save();
			}
		}, 120000);
	},


	getHash: function() {
		const doc = this.collab.pm.mod.collab.versionDoc.copy();
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
	update: function() {
		const that = this;
		this.collab.mod.collab.docChanges.cancelCurrentlyCheckingVersion();
		this.collab.mod.collab.docChanges.unconfirmedSteps = {};
		if (this.collab.mod.collab.docChanges.awaitingDiffResponse) {
			this.collab.mod.collab.docChanges.enableDiffSending();
		}
		const pmDoc = modelToEditor(this.collab.doc, this.collab.schema);
		// collabEditing.detach(this.pm)
		this.collab.pm.setDoc(pmDoc);
		that.collab.pm.mod.collab.version = this.collab.doc.version;
		// collabEditing.config({version: this.doc.version}).attach(this.pm)
		while (this.collab.docInfo.last_diffs.length > 0) {
			const diff = this.collab.docInfo.last_diffs.shift();
			this.collab.mod.collab.docChanges.applyDiff(diff);
		}
		this.collab.doc.hash = this.getHash();
		// this.collab.mod.comments.store.setVersion(this.doc.comment_version)
		this.collab.pm.mod.collab.mustSend.add(function() {
			that.collab.mod.collab.docChanges.sendToCollaborators();
		}, 0); // priority : 0 so that other things cna be scheduled before this.
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

		// if (data.hasOwnProperty('user')) {
		//     this.collab.user = data.user
		// } else {
		//     this.collab.user = this.doc.owner
		// }
		// this.getImageDB(this.doc.owner.id, function(){
		//     that.update()
		//     that.mod.serverCommunications.send({
		//         type: 'participant_update'
		//     })
		// })
	},

	receiveDocumentValues: function(dataDoc, dataDocInfo) {
		// let that = this;
		this.collab.doc = dataDoc;
		this.collab.docInfo = dataDocInfo;
		this.collab.docInfo.changed = false;
		this.collab.docInfo.titleChanged = false;
		// let defaultSettings = [
		//     ['papersize', 1117],
		//     ['citationstyle', defaultCitationStyle],
		//     ['documentstyle', defaultDocumentStyle]
		// ]
		//

		// defaultSettings.forEach(function(variable) {
		//     if (that.collab.doc.settings[variable[0]] === undefined) {
		//         that.collab.doc.settings[variable[0]] = variable[1]
		//     }
		// })

		//
		// if (this.collab.docInfo.is_new) {
		//     // If the document is new, change the url. Then forget that the document is new.
		//     window.history.replaceState("", "", "/document/" + this.doc.id +
		//         "/");
		//     delete this.collab.docInfo.is_new
		// }
	},

	// Get updates to document and then send updates to the server
	save: function(callback) {
		const that = this;
		this.getUpdates(function() {
			that.sendDocumentUpdate(function() {
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
			// version: this.doc.version,
			hash: this.collab.doc.hash
		};

		this.mod.serverCommunications.send({
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
		this.collab.mod.collab.updateParticipantList(participants);
		// console.log('Got participants', participants);
		this.setState({participants});
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
		const collab = safeGetInToJS(this.props.atomEditData, ['collab']);

		const colorMap = {};
		this.state.participants.map((participant, index) => {
			const color = ColorHash.rgb(participant.name);
			const colorStr = `rgba(${color[0]},${color[1]},${color[2]},0.3)`;
			colorMap[`.user-bg-${index}`] = {backgroundColor: colorStr};
		});

		let color;

		if (this.state.error) {
			color = 'red';
		} else if (this.state.loading) {
			color = 'yellow';
		} else {
			color = 'green';
		}

		return (
			<div style={styles.container}>
			{/* <Dropzone ref="dropzone" disableClick={true} onDrop={this.onDrop} style={{}} activeClassName={'dropzone-active'} > */}
				<Style rules={colorMap} />

				<div>
					<div style={{backgroundColor: color, width:'10px', height: '10px',borderRadius: '50%',}}></div>
					{(this.state.error
						? <span>Error: {this.state.error}</span>
					: <span></span>
					)}
				</div>

				<Media ref={'mediaRef'}/>

				<div className={'opacity-on-hover'} style={styles.iconLeft} onClick={this.toggleMarkdown}></div>

				<textarea id="markdown" onChange={this.markdownChange} style={[styles.textarea, this.state.showMarkdown && styles.textareaVisible]}></textarea>
				<div id={'atom-reader'} className={'atom-reader'} style={[styles.wsywigBlock, this.state.showMarkdown && styles.wsywigWithMarkdown]}></div>

			{/* </Dropzone> */}
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
