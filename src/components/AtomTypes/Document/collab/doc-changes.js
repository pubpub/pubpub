import {sendableSteps, getVersion} from 'prosemirror-collab';
import {receiveAction} from 'prosemirror-collab';
import {Step} from 'prosemirror-transform';

import {schema as pubSchema} from '../proseEditor/schema';

export class ModCollabDocChanges {
	constructor(mod) {
		mod.docChanges = this;
		this.mod = mod;

		this.unconfirmedSteps = {};
		this.confirmStepsRequestCounter = 0;
		this.awaitingDiffResponse = false;
		this.receiving = false;
		this.currentlyCheckingVersion = false;
	}

	checkHash(version, hash) {
		if (version === getVersion(this.mod.editor.getState())) {
			if (hash === this.mod.editor.getHash()) {
				return true;
			}
			this.disableDiffSending();
			this.mod.editor.askForDocument();
			return false;
		}
		this.checkDiffVersion();
		return false;
	}

	cancelCurrentlyCheckingVersion() {
		this.currentlyCheckingVersion = false;
		window.clearTimeout(this.enableCheckDiffVersion);
	}

	checkUnconfirmedSteps = () => {
		return Object.keys(this.unconfirmedSteps).length;
	}

	checkDiffVersion() {
		const that = this;
		if (this.currentlyCheckingVersion) {
			return;
		}
		this.currentlyCheckingVersion = true;
		this.enableCheckDiffVersion = window.setTimeout(function() {
			that.currentlyCheckingVersion = false;
		}, 1000);
		if (this.mod.editor.mod.serverCommunications.connected) {
			this.disableDiffSending();
		}
		this.mod.editor.mod.serverCommunications.send({
			type: 'check_diff_version',
			diff_version: getVersion(this.mod.editor.getState())
		});
	}

	disableDiffSending() {
		const that = this;
		this.awaitingDiffResponse = true;
		// If no answer has been received from the server within 2 seconds, check the version
		this.checkDiffVersionTimer = window.setTimeout(function() {
			that.awaitingDiffResponse = false;
			that.sendToCollaborators();
			that.checkDiffVersion();
		}, 2000);
	}

	enableDiffSending() {
		window.clearTimeout(this.checkDiffVersionTimer);
		this.awaitingDiffResponse = false;
		this.sendToCollaborators();
	}

	sendToCollaborators = () => {
		if (this.awaitingDiffResponse ||
			!sendableSteps(this.mod.editor.getState())) {
			// this.mod.editor.mod.comments.store.unsentEvents().length === 0) {
			// We are waiting for the confirmation of previous steps, so don't
			// send anything now, or there is nothing to send.
			return;
		}

		const toSend = sendableSteps(this.mod.editor.getState());
		const requestId = this.confirmStepsRequestCounter++;
		const aPackage = {
			type: 'diff',
			diff_version: getVersion(this.mod.editor.getState()),
			diff: toSend.steps.map(sIndex => {
				const step = sIndex.toJSON();
				step.client_id = this.mod.editor.getId();
				return step;
			}),
			// footnote_diff: fnToSend.steps.map(s => {
			//     let step = s.toJSON()
			//     step.client_id = this.mod.editor.mod.footnotes.fnPm.mod.collab.clientID
			//     return step
			// }),
			// comments: this.mod.editor.mod.comments.store.unsentEvents(),
			// comment_version: this.mod.editor.mod.comments.store.version,
			request_id: requestId,
			hash: this.mod.editor.getHash(),
			token: this.mod.editor.token,
		};
		this.mod.editor.mod.serverCommunications.send(aPackage);
		this.unconfirmedSteps[requestId] = {
			diffs: toSend.steps,
			// footnote_diffs: fnToSend.steps,
			// comments: this.mod.editor.mod.comments.store.hasUnsentEvents()
		};
		this.disableDiffSending();
	}

	receiveFromCollaborators(data) {
		const that = this;
		if (this.mod.editor.waitingForDocument) {
			// We are currently waiting for a complete editor update, so
			// don't deal with incoming diffs.
			return undefined;
		}
		const editorHash = this.mod.editor.getHash();
		if (data.diff_version !== getVersion(this.mod.editor.getState())) {

			this.checkDiffVersion();
			return undefined;
		}

		if (data.hash && data.hash !== editorHash) {
			return false;
		}
		if (data.diff && data.diff.length) {
			data.diff.forEach(function(diff) {
				that.applyDiff(diff);
			});
		}
		if (data.reject_request_id) {
			console.log('Rejected this diff');
			this.rejectDiff(data.reject_request_id);
		}
		if (!data.hash) {
			// No hash means this must have been created server side.
			this.cancelCurrentlyCheckingVersion();
			this.enableDiffSending();

		}
	}

	confirmDiff = (requestId) => {
		const that = this;
		const diffs = this.unconfirmedSteps[requestId].diffs;

		const clientIds = diffs.map(function(step) {
			return that.mod.editor.getId();
		});

		const action = this.receiveAction(diffs, clientIds, true);
		action.requestDone = true;
		if (!action) {
			console.log('Could not apply diff!');
		}
		this.mod.editor.applyAction(action);

		// let sentFnSteps = this.unconfirmedSteps[requestId]["footnote_diffs"]
		// this.mod.editor.mod.footnotes.fnPm.mod.collab.receive(sentFnSteps, sentFnSteps.map(function(step){
		//     return that.mod.editor.mod.footnotes.fnPm.mod.collab.clientID
		// }))

		// let sentComments = this.unconfirmedSteps[requestId]["comments"]
		// this.mod.editor.mod.comments.store.eventsSent(sentComments)

		if (this.unconfirmedSteps[requestId]) {
			delete this.unconfirmedSteps[requestId];
		} else {
			console.log('Could not enable diff');
			console.log(requestId);
			console.log(this.unconfirmedSteps);
		}

		this.enableDiffSending();
	}

	rejectDiff(requestId) {
		this.enableDiffSending();
		delete this.unconfirmedSteps[requestId];
		this.sendToCollaborators();
	}

	applyDiff = (diff) => {
		this.receiving = true;
		const steps = [diff].map(jIndex => Step.fromJSON(pubSchema, jIndex));
		const clientIds = [diff].map(jIndex => jIndex.client_id);
		const action = this.receiveAction(steps, clientIds);
		this.mod.editor.applyAction(action);
		this.receiving = false;
	}

	applyAllDiffs = (diffs) => {
		let action = null;
		this.receiving = true;

		try {
			const steps = diffs.map(jIndex => Step.fromJSON(pubSchema, jIndex));
			const clientIds = diffs.map(jIndex => jIndex.client_id);
			action = this.receiveAction(steps, clientIds);
			this.mod.editor.applyAction(action);
		} catch (err) {
			console.log('ERROR: ', err);
		}

		this.receiving = false;
		return action;

	}


	applyAllDiffsSequential(diffs) {
		let action = null;
		this.receiving = true;

		for (const diff of diffs) {
			try {
				const steps = [diff].map(jIndex => Step.fromJSON(pubSchema, jIndex));
				const clientIds = [diff].map(jIndex => jIndex.client_id);
				action = this.receiveAction(steps, clientIds);
				this.mod.editor.applyAction(action);
			} catch (err) {
				console.log('ERROR: ', err);
				console.log(diff);
			}

		}
		this.receiving = false;
		return action;

	}

	receiveAction = (steps, clientIDs, ours = false) => {

		const state = this.mod.editor.getState();
		const userID = this.mod.editor.getId();
		let modifiedClientIDs;

		if (!ours) {
			modifiedClientIDs = clientIDs.map(clientID => {
				if (clientID === userID) {
					return 'self';
				} else {
					return clientID;
				}
			});
		} else {
			modifiedClientIDs = clientIDs;
		}

		return receiveAction(state, steps, modifiedClientIDs);
	}



}
