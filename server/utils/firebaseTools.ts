import { createFirebaseChange } from 'client/components/Editor';
import { Node, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';
import { getPubDraftDoc, getPubDraftRef } from './firebaseAdmin';

import { buildSchema } from 'client/components/Editor';
import { DocJson } from 'types';

const documentSchema = buildSchema();

const makeReplaceStepFromTo = (from: number, to: number, slice: Slice, client = 'api') => {
	const replaceStep = new ReplaceStep(from, to, slice);
	const change = createFirebaseChange([replaceStep], client);
	return change;
};

export const writeDocumentToPubDraft = async (
	pubId: string,
	document: DocJson,
	options?: { overwrite?: boolean },
) => {
	const { overwrite } = options || {};
	const draftRef = await getPubDraftRef(pubId);

	const { size } = await getPubDraftDoc(draftRef);

	const hydratedDocument = Node.fromJSON(documentSchema, document);

	const documentFragment = Fragment.from(hydratedDocument.content);
	const documentSlice = new Slice(documentFragment, 0, 0);

	if (overwrite) {
		const change = makeReplaceStepFromTo(0, 0, documentSlice, 'api');
		await draftRef.child('changes').set({ 0: change });
		return;
	}

	const change = makeReplaceStepFromTo(0, size, documentSlice, 'api');
	const latest = (await draftRef.child('changes').limitToLast(1).once('value')).val();

	const latestKey = Object.keys(latest)[0];
	const key = latestKey ? Number(latestKey) + 1 : 0;

	await draftRef.child('changes').child(key.toString()).set(change);
};
