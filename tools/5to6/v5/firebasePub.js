/* eslint-disable no-console, no-restricted-syntax */
const { Step } = require('prosemirror-transform');
const { compressStepJSON, uncompressStepJSON } = require('prosemirror-compress-pubpub');

const { fromFirebaseJson } = require('../util/firebaseJson');
const editorSchema = require('../util/editorSchema');

function Change(steps, clientId, timestamp) {
	this.steps = steps;
	this.clientId = clientId;
	this.timestamp = timestamp;
}

const uncompressChange = (compressedChange) => {
	const { c: clientId, s: compressedStepsJson, t: timestamp } = compressedChange;
	const steps = Object.values(compressedStepsJson).map((stepJson) => {
		const uncompressedStepsJson = uncompressStepJSON(stepJson);
		return Step.fromJSON(editorSchema, uncompressedStepsJson);
	});
	return new Change(steps, clientId, timestamp);
};

const compressChange = (change) => {
	return {
		t: change.timestamp,
		c: change.clientId,
		s: change.steps.map((step) => compressStepJSON(step.toJSON())),
	};
};

const getChangesForPub = (pubDir) => {
	const { changes } = fromFirebaseJson(pubDir.read('firebase-v5.json').toString());
	return (
		(changes &&
			Object.values(changes).reduce((changesArr, compressedChange) => {
				if (compressedChange) {
					return [...changesArr, uncompressChange(compressedChange)];
				}
				return changesArr;
			}, [])) ||
		[]
	);
};

module.exports = {
	uncompressChange: uncompressChange,
	compressChange: compressChange,
	getChangesForPub: getChangesForPub,
	Change: Change,
};
