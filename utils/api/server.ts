import { initServer } from '@ts-rest/express';
import { pubServer } from 'server/pub/api';
import { collectionPubServer } from 'server/collectionPub/api';
import { pubAttributionServer } from 'server/pubAttribution/api';
import { collectionAttributionServer } from 'server/collectionAttribution/api';
import { collectionServer } from 'server/collection/api';
import { facetsServer } from 'server/facets/api';
import { logout } from 'server/logout/api';
import { login } from 'server/login/api';
import { exportServer } from 'server/export/api';
import { contract } from './contract';

const s = initServer();

export const server = s.router(contract, {
	collection: collectionServer,
	collectionAttribution: collectionAttributionServer,
	collectionPub: collectionPubServer,
	export: exportServer,
	facets: facetsServer,
	member: {},
	//	memberServer,
	page: {},
	//	pageServer,
	pub: pubServer,
	pubAttribution: pubAttributionServer,
	pubEdge: {},
	//	pubEdgeServer,
	workerTask: {},
	logout,
	login,
});
