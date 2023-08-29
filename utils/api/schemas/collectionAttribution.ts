import * as types from 'types';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { attributionSchema } from './pubAttribution';

extendZodWithOpenApi(z);

export const collectionAttributionSchema = attributionSchema.extend({
	collectionId: z.string().uuid(),
}) satisfies z.ZodType<types.CollectionAttribution>;
