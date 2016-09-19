/* Sets up communicating with server (retrieving document,
saving, collaboration, etc.).
*/

import {collabServerUrl} from 'config';

export class ModServerCommunications {
	constructor(editor) {
		editor.mod.serverCommunications = this;
		this.editor = editor;
		/* A list of messages to be sent. Only used when temporarily offline.
		Messages will be sent when returning back online. */
		this.messagesToSend = [];
		this.connected = false;
		/* Whether the connection is established for the first time. */
		this.firstTimeConnection = true;
		this.retryTimeout = null;
		this.statusInterval = null;

		this.stats = {
			lastMessage: null,
			lastConnection: null,
		};
	}

	init() {
		this.createWSConnection();
	}

	createWSConnection() {
		const that = this;
		// const websocketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

		const wsServer = collabServerUrl;
		let websocketProtocol;
		if (wsServer.indexOf('localhost') !== -1) {
			websocketProtocol = 'ws:';
		} else {
			websocketProtocol = 'wss:';
		}


		const randomInt = Math.round(Math.random() * 100000);
		try {
			this.ws = new window.WebSocket(`${websocketProtocol}//${wsServer}/ws/doc/${this.editor.doc.id}?user=${this.editor.username }&token=${this.editor.token}&avatar_url=${this.editor.img}&random=${randomInt}`);
			// console.log('opening with', `${websocketProtocol}//${wsServer}/ws/doc/${this.editor.doc.id}?user=${this.editor.username }&token=${this.editor.token}&avatar_url=${this.editor.img}&random=${randomInt}`);
			console.log('Opening connection');
			this.ws.onopen = function() {
				console.log('Opened Connection');
				that.editor.setConnectionStatus('loading');
			};

			this.ws.onerror = function(err) {
				console.log('error with socket');
				console.log(arguments);
			};

		} catch (err) {
			console.log(err);
		}

		this.ws.onmessage = function(event) {
			const data = JSON.parse(event.data);
			that.stats.lastMessage = new Date();
			that.receive(data);
		};
		this.ws.onclose = function(event) {
			console.log('Closed connection');
			that.connected = false;
			window.clearInterval(that.wsPinger);
			that.updateConnectionStatus();

			this.retryTimeout = window.setTimeout(function() {
				that.createWSConnection();
			}, 2000);
				// console.log('attempting to reconnect');
			if (that.editor.pm.mod.collab.hasSendableSteps()) {
				// jQuery('#unobtrusive_messages').html('<span class="warn">'+gettext('Warning! Not all your changes have been saved! You could suffer data loss. Attempting to reconnect...')+'</span>')
			} else {
				// jQuery('#unobtrusive_messages').html(gettext('Disconnected. Attempting to reconnect...'))
			}

		};
		this.wsPinger = window.setInterval(function() {
			that.send({
				'type': 'ping'
			});
		}, 30000);
	}

	close() {
		// console.log('Closed ws');
		console.log('trying to close ws');
		window.clearTimeout(this.retryTimeout);
		window.clearTimeout(this.wsPinger);
		this.ws.close();
	}

	activateConnection() {
		// console.log('Activating connection');
		this.connected = true;
		this.updateConnectionStatus();
		if (this.firstTimeConnection) {
			this.editor.waitingForDocument = false;
			this.editor.askForDocument();
		} else {
			// this.editor.mod.footnotes.fnEditor.renderAllFootnotes()
			this.editor.mod.collab.docChanges.checkDiffVersion();
			this.send({
				type: 'participant_update'
			});
			while (this.messagesToSend.length > 0) {
				this.send(this.messagesToSend.shift());
			}
		}
		this.firstTimeConnection = false;
	}

	/** Sends data to server or keeps it in a list if currently offline. */
	send(data) {
		data.token = this.editor.token;
		data.id = this.editor.doc_id;
		data.user = this.editor.username;
		if (this.connected) {
			try {
				this.ws.send(JSON.stringify(data));
			} catch (err) {
				console.log('Error sending');
				this.updateConnectionStatus();
				// that.updateConnectionStatus();
			}

		} else if (data.type !== 'diff') {
			this.messagesToSend.push(data);
		}
	}

	updateConnectionStatus = () => {
		const now = new Date();
		console.log('updating status', this.connected);
		if (this.connected) {
			if (this.statusInterval) {
				clearTimeout(this.statusInterval);
			}
			// this.editor.setLoadingState(false);
			this.editor.setConnectionStatus('connected');
		} else if (now - this.stats.lastMessage <= (30 * 1000)) {
			// this.editor.setErrorState('disconnect');
			this.editor.setConnectionStatus('reconnecting');
			if (!this.statusInterval) {
				this.statusInterval = window.setInterval(this.updateConnectionStatus.bind(this), 1000);
			}
		} else {
			this.editor.setConnectionStatus('disconnected');
			if (this.statusInterval) {
				clearTimeout(this.statusInterval);
			}
			// this.editor.setErrorState('timeout');
		}
	}

	receive(data) {
		// console.log(data);
		switch (data.type) {
		case 'chat':
			this.editor.mod.collab.chat.newMessage(data);
			break;
		case 'connections':
			// console.log('got connections!');
			// this.editor.mod.collab.updateParticipantList(data.participant_list);
			this.editor.updateParticipants(data.participant_list);
			break;
		case 'welcome':
			this.activateConnection();
			break;
		case 'document_data':
			this.editor.receiveDocument(data);
			break;
		case 'confirm_diff_version':
			this.editor.mod.collab.docChanges.cancelCurrentlyCheckingVersion();
			if (data.diff_version !== this.editor.pm.mod.collab.version) {
				this.editor.mod.collab.docChanges.checkDiffVersion();
				return;
			}
			this.editor.mod.collab.docChanges.enableDiffSending();
			break;
		case 'selection_change':
			// this.editor.mod.collab.docChanges.cancelCurrentlyCheckingVersion()
			// if (data.diff_version !== this.editor.pm.mod.collab.version) {
			//     this.editor.mod.collab.docChanges.checkDiffVersion()
			//     return
			// }
			this.editor.mod.collab.carets.receiveSelectionChange(data);
			break;
		case 'diff':
			this.editor.mod.collab.docChanges.receiveFromCollaborators(data);
			break;
		case 'confirm_diff':
			this.editor.mod.collab.docChanges.confirmDiff(data.request_id);
			break;
		case 'setting_change':
			this.editor.mod.settings.set.setSetting(data.variable, data.value, false);
			break;
		case 'check_hash':
			this.editor.mod.collab.docChanges.checkHash(data.diff_version, data.hash);
			break;
		default:
			break;

		}
	}
}
