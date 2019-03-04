import firebaseAdmin from 'firebase-admin';
import { buildSchema } from '@pubpub/editor';
import discussionSchema from 'components/DiscussionAddon/discussionSchema';
import { uncompressStateJSON, uncompressStepJSON } from 'prosemirror-compress-pubpub';
import { Step } from 'prosemirror-transform';

/* To encode: Buffer.from(JSON.stringify(serviceAccountJson)).toString('base64'); */
const serviceAccount = JSON.parse(
	Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString(),
);

const firebaseApp = firebaseAdmin.initializeApp(
	{
		credential: firebaseAdmin.credential.cert(serviceAccount),
		databaseURL: 'https://pubpub-v5-development.firebaseio.com',
	},
	'firebase-pub-new',
);

export const getBranchDoc = (pubId, branchId)=> {
	const pubKey = `pub-${pubId}`;
	const branchKey = `branch-${branchId}`;

	const database = firebaseApp.database();
	const firebaseRef = database.ref(`${pubKey}/${branchKey}`);

	/* TODO: Document expected structure of content at firebaseRef. For example: */
	/*
		pubKey/branchKey 
			steps: []
			selections: []
	*/
	return buildFirebaseDoc(firebaseRef);

	

	const editorSchema = buildSchema({ ...discussionSchema }, {});

	let mostRecentRemoteKey;
	const changeArray = [];
	const findContent = firebaseRef
		.child('checkpoint')
		.once('value')
		.then(() => {
			const checkpointSnapshotVal = {
				k: '0',
				d: { type: 'doc', attrs: { meta: {} }, content: [{ type: 'paragraph' }] },
			};

			mostRecentRemoteKey = Number(checkpointSnapshotVal.k);
			const newDoc = Node.fromJSON(
				editorSchema,
				uncompressStateJSON({ d: checkpointSnapshotVal.d }).doc,
			);

			/* Get all changes since mostRecentRemoteKey */
			const getChanges = firebaseRef
				.child('changes')
				.orderByKey()
				.startAt(String(mostRecentRemoteKey + 1))
				// .endAt(String(mostRecentRemoteKey + 105))
				.once('value');

			return Promise.all([newDoc, getChanges]);
		})
		.then(([newDoc, changesSnapshot]) => {
			const changesSnapshotVal = changesSnapshot.val() || {};
			const steps = [];
			const stepClientIds = [];
			const keys = Object.keys(changesSnapshotVal);
			mostRecentRemoteKey = keys.length ? Math.max(...keys) : mostRecentRemoteKey;

			/* Uncompress steps and add stepClientIds */
			Object.keys(changesSnapshotVal).forEach((key) => {
				const compressedStepsJSON = changesSnapshotVal[key].s;
				const uncompressedSteps = compressedStepsJSON.map((compressedStepJSON) => {
					return Step.fromJSON(editorSchema, uncompressStepJSON(compressedStepJSON));
				});
				steps.push(...uncompressedSteps);
				stepClientIds.push(
					...new Array(compressedStepsJSON.length).fill(changesSnapshotVal[key].c),
				);
			});
			const updatedDoc = steps.reduce((prev, curr, index) => {
				const stepResult = curr.apply(prev);
				if (stepResult.failed) {
					console.error('Failed with ', stepResult.failed);
				}
				if (index % 10 === 0 || index === steps.length - 1) {
					changeArray.push({ index: index, doc: stepResult.doc.toJSON() });
				}
				return stepResult.doc;
			}, newDoc);
			return {
				content: updatedDoc.toJSON(),
				changeArray: changeArray,
				changesSnapshotVal: changesSnapshotVal,
			};
		})
		.catch((firebaseErr) => {
			console.error('firebase-firebaseErr', firebaseErr);
		});
};

export const def = 5;