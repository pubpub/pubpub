/**
 * Code that builds a submission that we can send to Crossref. We build JSON here, and let that
 * get converted to equivalent XML downstream.
 */
import getSkeletonForContent from './skeletonForContent';
import { makeComponentId } from './components';

const SCHEMA_METADATA = {
	'@xmlns': 'http://www.crossref.org/schema/4.4.1',
	'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
	'@version': '4.4.1',
	'@xsi:schemaLocation':
		'http://www.crossref.org/schema/4.4.1 http://www.crossref.org/schema/deposit/crossref4.4.1.xsd',
};

const HEAD_METADATA = {
	depositor: {
		depositor_name: 'PubPub',
		email_address: 'pubpub@media.mit.edu',
	},
	registrant: 'PubPub',
};

const submissionTopLevel = (body, componentId, { timestamp }) => ({
	doi_batch: {
		...SCHEMA_METADATA,
		head: {
			...HEAD_METADATA,
			doi_batch_id: `${componentId}_${timestamp}`,
			timestamp: timestamp,
		},
		body: body,
	},
});

const getGlobals = () => ({
	timestamp: new Date().getTime(),
});

const makeContentTuple = (globals, community, collection, pub) => {
	return { globals: globals, community: community, collection: collection, pub: pub };
};

export default (community, collection, pub) => {
	const globals = getGlobals();
	const contentTuple = makeContentTuple(community, collection, pub);
	const skeleton = getSkeletonForContent(contentTuple);
	const componentId = makeComponentId(contentTuple);
	return submissionTopLevel(skeleton(contentTuple), componentId, globals);
};
