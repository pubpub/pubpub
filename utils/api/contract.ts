import { type AppRouter, initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { type PubRouter, pubRouter } from './contracts/pub';
import { type CollectionPubRouter, collectionPubRouter } from './contracts/collectionPub';
import { type CollectionRouter, collectionRouter } from './contracts/collection';
import {
	type CollectionAttributionRouter,
	collectionAttributionRouter,
} from './contracts/collectionAttribution';
import { type CommunityRouter, communityRouter } from './contracts/community';
import { type CustomScriptRouter, customScriptRouter } from './contracts/customScript';
import { exportRoute } from './contracts/export';
import { type FacetsRouter, facetsRouter } from './contracts/facets';
import { loginRoute } from './contracts/login';
import { logoutRoute } from './contracts/logout';
import { type MemberRouter, memberRouter } from './contracts/member';
import { type PageRouter, pageRouter } from './contracts/page';
import { type PubAttributionRouter, pubAttributionRouter } from './contracts/pubAttribution';
import { type PubEdgeRouter, pubEdgeRouter } from './contracts/pubEdge';
import { type WorkerTaskRouter, workerTaskRouter } from './contracts/workerTask';
import { importRoute } from './contracts/import';
import { type ReleaseRouter, releaseRouter } from './contracts/release';
import { uploadPolicyRoute } from './contracts/uploadPolicy';
import { uploadRoute } from './contracts/upload';

extendZodWithOpenApi(z);

const c = initContract();

const router = {
	collection: collectionRouter as CollectionRouter,
	collectionAttribution: collectionAttributionRouter as CollectionAttributionRouter,
	collectionPub: collectionPubRouter as CollectionPubRouter,
	community: communityRouter as CommunityRouter,
	customScript: customScriptRouter as CustomScriptRouter,
	/**
	 * Export a pub
	 */
	export: exportRoute,
	facets: facetsRouter as FacetsRouter,
	import: importRoute,
	member: memberRouter as MemberRouter,
	page: pageRouter as PageRouter,
	pub: pubRouter as PubRouter,
	pubAttribution: pubAttributionRouter as PubAttributionRouter,
	pubEdge: pubEdgeRouter as PubEdgeRouter,
	release: releaseRouter as ReleaseRouter,
	workerTask: workerTaskRouter as WorkerTaskRouter,
	login: loginRoute,
	logout: logoutRoute,
	uploadPolicy: uploadPolicyRoute,
	upload: uploadRoute,
} as const satisfies AppRouter;

export const contract = c.router<typeof router, '', { strictStatusCodes: true }>(router, {
	strictStatusCodes: true,
});
