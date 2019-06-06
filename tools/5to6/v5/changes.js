/* eslint-disable no-console, no-restricted-syntax */
const uuidv4 = require('uuid/v4');
const { Step, ReplaceStep } = require('prosemirror-transform');
const { Slice } = require('prosemirror-model');
const { compressStepJSON, uncompressStepJSON } = require('prosemirror-compress-pubpub');

const { fromFirebaseJson } = require('../util/firebaseJson');
const editorSchema = require('../util/editorSchema');

const PUBPUB_CLIENT_ID = 'clientId-b242f616-7aaa-479c-8ee5-3933dcf70859-migr8';

function Change(steps, clientId, timestamp, isOrphanedVersionChange) {
	this.steps = steps;
	this.clientId = clientId;
	this.timestamp = timestamp;
	this.isOrphanedVersionChange = isOrphanedVersionChange;
}

const uncompressChange = (compressedChange) => {
	const { c: clientId, s: compressedStepsJson, t: timestamp } = compressedChange;
	const steps = Object.values(compressedStepsJson).map((stepJson) => {
		const uncompressedStepsJson = uncompressStepJSON(stepJson);
		return Step.fromJSON(editorSchema, uncompressedStepsJson);
	});
	return new Change(steps, clientId, timestamp);
};

const compressChange = (change, branchId) => {
	return {
		id: uuidv4(),
		cId: change.clientId,
		bId: branchId,
		t: change.timestamp,
		s: change.steps.map((step) => compressStepJSON(step.toJSON())),
	};
};

const getChangesAndCheckpointForPub = (pubDir) => {
	const { changes, checkpoint } = fromFirebaseJson(pubDir.read('firebase-v5.json').toString());
	return {
		checkpoint: checkpoint,
		changes:
			(changes &&
				Object.values(changes).reduce((changesArr, compressedChange) => {
					if (compressedChange) {
						return [...changesArr, uncompressChange(compressedChange)];
					}
					return changesArr;
				}, [])) ||
			[],
	};
};

const createReplaceWholeDocumentChange = (startDocument, endDocument, isOrphanedVersionChange) => {
	const replaceSlice = new Slice(endDocument.content, 0, 0);
	const replaceStep = new ReplaceStep(0, startDocument.nodeSize - 2, replaceSlice);
	return new Change([replaceStep], PUBPUB_CLIENT_ID, Date.now(), isOrphanedVersionChange);
};

module.exports = {
	uncompressChange: uncompressChange,
	compressChange: compressChange,
	getChangesAndCheckpointForPub: getChangesAndCheckpointForPub,
	createReplaceWholeDocumentChange: createReplaceWholeDocumentChange,
	Change: Change,
};
