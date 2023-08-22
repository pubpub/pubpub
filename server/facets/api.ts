/* eslint-disable @typescript-eslint/no-shadow */
import app, { wrap } from 'server/server';
import { BadRequestError, ForbiddenError } from 'server/utils/errors';
import {
	ALL_FACET_DEFINITIONS,
	FacetDefinition,
	FacetName,
	FacetProp,
	FacetPropType,
	FacetSourceScope,
	getScopeId,
} from 'facets';

import { validate } from 'utils/api';
import { ZodRawShape, z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { canUserUpdateFacetsForScope } from './permissions';
import { UpdateFacetsQuery, updateFacetsForScope } from './update';

extendZodWithOpenApi(z);

type FacetSchema = {
	[name in FacetName]: z.ZodObject<{
		[K in keyof (typeof ALL_FACET_DEFINITIONS)[name]['props']]: (typeof ALL_FACET_DEFINITIONS)[name]['props'][K] extends FacetProp<
			FacetPropType<infer S>
		>
			? S
			: never;
	}>;
};

const facetSchemas = Object.entries(ALL_FACET_DEFINITIONS).reduce((acc, [njame, facet]) => {
	const name = njame as typeof facet extends FacetDefinition<infer N, any> ? N : never;

	const rawShape = Object.entries(facet.props).reduce((acc, [propNjame, prop]) => {
		const propName = propNjame as any;
		acc[propName] = prop.propType.schema.openapi({
			description: prop.label,
			example: prop.rootValue,
		});
		return acc;
	}, {} as FacetSchema[typeof name] extends z.ZodObject<infer S extends ZodRawShape> ? S : never);

	acc[name as any] = z.object(rawShape).partial().openapi({
		description: facet.label,
	});
	return acc;
}, {} as FacetSchema);

const facetSchema = z.object({
	facets: z.object(facetSchemas).partial() satisfies z.ZodType<UpdateFacetsQuery>,
	scope: z.object({
		kind: z.enum(['community', 'collection', 'pub']),
		id: z.string().uuid(),
	}) satisfies z.ZodType<FacetSourceScope>,
});

app.post(
	'/api/facets',
	validate({
		summary: 'Update facets for a scope',
		description:
			'Facets are properties that cascade down from a community, collection, or publication to all of its children, like the style of citation used or the license for content.\n\nYou cannot "unset" facets, so passing an empty object will just be treated as no change.',
		tags: ['Facets'],
		body: facetSchema,
		response: {},
	}),
	wrap(async (req, res) => {
		const { facets, scope } = req.body;
		const scopeId = getScopeId(scope);
		const canUpdate = await canUserUpdateFacetsForScope(scopeId, req.user?.id);
		if (!canUpdate) {
			throw new ForbiddenError();
		}
		try {
			await updateFacetsForScope(scopeId, facets, req.user?.id);
		} catch (err) {
			throw new BadRequestError();
		}
		return res.status(200).json({});
	}),
);
