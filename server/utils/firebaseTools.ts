import { DocJson } from 'types';

import { createFirebaseChange, buildSchema } from 'client/components/Editor';
import { Node, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';
import { getPubDraftDoc, getPubDraftRef } from './firebaseAdmin';

const documentSchema = buildSchema();

const makeReplaceStepFromTo = (from: number, to: number, slice: Slice, client = 'api') => {
	const replaceStep = new ReplaceStep(from, to, slice);
	const change = createFirebaseChange([replaceStep], client);
	return change;
};

export const writeDocumentToPubDraft = async (
	pubId: string,
	document: DocJson,
	options?: { method?: 'replace' | 'overwrite' | 'append' | 'prepend' },
) => {
	const { method = 'replace' } = options || {};
	const draftRef = await getPubDraftRef(pubId);

	const { size } = await getPubDraftDoc(draftRef);

	const hydratedDocument = Node.fromJSON(documentSchema, document);

	const documentFragment = Fragment.from(hydratedDocument.content);
	const documentSlice = new Slice(documentFragment, 0, 0);

	let from = 0;
	let to = size;

	switch (method) {
		case 'append':
			from = size;
			to = size;
			break;
		case 'prepend':
			from = 0;
			to = 0;
			break;
		case 'overwrite':
			from = 0;
			to = 0;
			break;
		default:
			from = 0;
			to = size;
			break;
	}

	if (method === 'overwrite') {
		const change = makeReplaceStepFromTo(0, 0, documentSlice, 'api');
		await draftRef.child('changes').set({ 0: change });
		return;
	}

	const change = makeReplaceStepFromTo(from, to, documentSlice, 'api');
	const latest = (await draftRef.child('changes').limitToLast(1).once('value')).val();

	const latestKey = latest ? Object.keys(latest)[0] : null;
	const key = latestKey ? Number(latestKey) + 1 : 0;

	await draftRef.child('changes').child(key.toString()).set(change);
};
