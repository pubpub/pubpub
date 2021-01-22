import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';

import {
	buildSchema,
	getFirebaseDoc,
	getLatestKeyAndTimestamp,
	getFirstKeyAndTimestamp,
} from 'components/Editor';
import { Pub, Draft } from 'server/models';
import discussionSchema from 'utils/editor/discussionSchema';
import { getFirebaseConfig } from 'utils/editor/firebaseConfig';
import { storeCheckpoint } from 'client/components/Editor/utils';
import { DocJson } from 'utils/types';
import { getPub } from 'dist/server/server/utils/queryHelpers/pubGet';

const getFirebaseApp = () => {
	if (firebaseAdmin.apps.length > 0) {
		return firebaseAdmin.apps[0];
	}
	if (process.env.NODE_ENV === 'test') {
		if (process.env.FIREBASE_TEST_DB_URL) {
			return firebaseAdmin.initializeApp({ databaseURL: process.env.FIREBASE_TEST_DB_URL });
		}
		return null;
	}
	const serviceAccount = JSON.parse(
		Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 as string, 'base64').toString(),
	);
	// eslint-disable-next-line no-console
	console.log(`Firebase App will use: ${getFirebaseConfig().databaseURL}`);
	return firebaseAdmin.initializeApp(
		{
			credential: firebaseAdmin.credential.cert(serviceAccount),
			databaseURL: getFirebaseConfig().databaseURL,
		},
		'firebase-pub-new',
	);
};

const firebaseApp = getFirebaseApp();
const database = firebaseApp && firebaseApp.database();
export const editorSchema = buildSchema({ ...discussionSchema }, {});

export const getDatabaseRef = (key: string): firebase.database.Reference => {
	return (database?.ref(key) as unknown) as firebase.database.Reference;
};

export const getPubDraftRef = async (pubId: string) => {
	const pub = await Pub.findOne({
		where: { id: pubId },
		include: [{ model: Draft, as: 'draft' }],
	});
	return getDatabaseRef(pub.draft.firebasePath);
};

const maybeAddKeyTimestampPair = (key, timestamp) => {
	if (typeof key === 'number' && key >= 0) {
		return { [key]: timestamp };
	}
	return null;
};

export const getPubDraftDoc = async (
	pubId: string,
	historyKey: null | number = null,
	createMissingCheckpoints = false,
) => {
	const draftRef = await getPubDraftRef(pubId);
	const [
		{ doc, docIsFromCheckpoint, key: currentKey, timestamp: currentTimestamp, checkpointMap },
		{ timestamp: firstTimestamp, key: firstKey },
		{ timestamp: latestTimestamp, key: latestKey },
	] = await Promise.all([
		getFirebaseDoc(draftRef, editorSchema, historyKey),
		getFirstKeyAndTimestamp(draftRef),
		getLatestKeyAndTimestamp(draftRef),
	]);

	if (!docIsFromCheckpoint && createMissingCheckpoints && currentKey === latestKey) {
		storeCheckpoint(draftRef, doc, latestKey);
	}

	return {
		doc: doc.toJSON() as DocJson,
		mostRecentRemoteKey: currentKey,
		firstTimestamp: firstTimestamp,
		latestTimestamp: latestTimestamp,
		historyData: {
			timestamps: {
				...checkpointMap,
				...maybeAddKeyTimestampPair(firstKey, firstTimestamp),
				...maybeAddKeyTimestampPair(currentKey, currentTimestamp),
				...maybeAddKeyTimestampPair(latestKey, latestTimestamp),
			},
			currentKey: currentKey,
			latestKey: latestKey,
		},
	};
};

export const getLatestKeyInPubDraft = async (pubId: string) => {
	const pubDraftRef = await getPubDraftRef(pubId);
	const { key } = await getLatestKeyAndTimestamp(pubDraftRef!);
	return key;
};

export const getFirebaseToken = (clientId: string, clientData: any) => {
	return firebaseAdmin.auth(firebaseApp!).createCustomToken(clientId, clientData);
};
