import { initServer } from '@ts-rest/express';
import { pubServer } from 'server/pub/api';
import { collectionPubServer } from 'server/collectionPub/api';
import { pubAttributionServer } from 'server/pubAttribution/api';
import { collectionAttributionServer } from 'server/collectionAttribution/api';
import { collectionServer } from 'server/collection/api';
import { facetsServer } from 'server/facets/api';
import { logoutRouteImplementation } from 'server/logout/api';
import { loginRouteImplementation } from 'server/login/api';
import { exportRouteImplementation } from 'server/export/api';
import { importRouteImplementation } from 'server/import/api';
import { pageServer } from 'server/page/api';
import { contract } from './contract';

const s = initServer();

export const server = s.router(contract, {
	collection: collectionServer,
	collectionAttribution: collectionAttributionServer,
	collectionPub: collectionPubServer,
	export: exportRouteImplementation,
	facets: facetsServer,
	import: importRouteImplementation,
	member: {},
	//	memberServer,
	page: pageServer,
	//	pageServer,
	pub: pubServer,
	pubAttribution: pubAttributionServer,
	pubEdge: {},
	//	pubEdgeServer,
	workerTask: {},
	logout: logoutRouteImplementation,
	login: loginRouteImplementation,
});
