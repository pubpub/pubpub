import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { pubContract } from './contracts/pub';
import { collectionPubContract } from './contracts/collectionPub';

extendZodWithOpenApi(z);

const c = initContract();
export const contract = c.router(
	{
		pub: pubContract,
		getCollectionPub: collectionPubContract,
	},
	{
		strictStatusCodes: false,
	},
);
