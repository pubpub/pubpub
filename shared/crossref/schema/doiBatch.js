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

export default ({ body, componentId, timestamp }) => ({
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
