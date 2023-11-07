import type { TsRestRequest } from '@ts-rest/express';
import type { AppRouteQuery, ServerInferRequest } from '@ts-rest/core';
import type { ModelCtor } from 'sequelize-typescript';
import { type Attributes, Op } from 'sequelize';
import type { Express, Response } from 'express-serve-static-core';

import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';
import { SerializedModel } from 'types/serializedModel';
import { Collection, Pub } from 'server/models';
import { ForbiddenError } from 'server/utils/errors';

import { buildWhereClause } from './filter';
import { createIncludes } from './include';
import type { GetManyQueryAny } from './createGetManyQuery';

/**
 * Some entries for some models are implicitly scoped to a community
 * E.g. members can have a pubId or collectionId, and even though they do not have a communityId,
 * we don't want users to be able to query members from other communities if they are not an admin
 *
 * This function checks if the community that we are trying to access is the same as the community of the pub or collection
 *
 * @throws ForbiddenError
 */
const extendedAccessCheck = async (
	checkOtherFieldsForAdminAccess: boolean | undefined,
	filterParams: Record<string, any>,
	communityId: string,
) => {
	if (!checkOtherFieldsForAdminAccess) {
		return false;
	}

	const pubOrCollectionIdsInQuery = Object.keys(filterParams).filter((filterParam) =>
		['pubId', 'collectionId'].includes(filterParam),
	);

	if (pubOrCollectionIdsInQuery.length === 0) {
		return false;
	}

	const keyValueModel = pubOrCollectionIdsInQuery.map(
		(key) =>
			[key, filterParams[key] as string, key === 'pubId' ? Pub : Collection] as
				| ['pubId', string | string[], typeof Pub]
				| ['collectionId', string | string[], typeof Collection],
	);

	const accessOrInaccessibleScope = await Promise.all(
		keyValueModel.map(async ([key, value, modelToCheck]) => {
			console.log({ key, value, modelToCheck });
			if (key !== 'pubId' && key !== 'collectionId') {
				return false as const;
			}

			// @ts-expect-error This is fine
			const results = await modelToCheck.findAll({
				where: {
					id: {
						[Op.in]: typeof value === 'string' ? [value] : value,
					},
					communityId,
				},
			});
			console.log(results);

			return results.length > 0 || ([key === 'pubId' ? 'pub' : 'collection', value] as const);
		}),
	);

	const hasAccess = accessOrInaccessibleScope.filter(
		(access): access is ['collection' | 'pub', string] => typeof access !== 'boolean',
	);

	if (hasAccess.length > 0) {
		const [type, id] = hasAccess[0];
		throw new ForbiddenError(
			new Error(
				`You are not the admin of ${type} with id ${id} and therefore cannot access it's members. You can only access members of your own community with id ${communityId}`,
			),
		);
	}

	return true;
};

export const queryMany =
	<M extends ModelCtor>(
		model: M,
		options?: {
			checkOtherFieldsForAdminAccess?: 'pubId' extends keyof Attributes<InstanceType<M>>
				? boolean
				: 'collectionId' extends keyof Attributes<InstanceType<M>>
				? boolean
				: never;
		},
	) =>
	async <T extends AppRouteQuery>(
		input: ServerInferRequest<T, Express['request']['headers']> & {
			req: TsRestRequest<T>;
			res: Response;
		},
	) => {
		const { req, query } = input;

		const community = await ensureUserIsCommunityAdmin(req);

		const { limit, offset, attributes, order, sort, filter, include, ...rest } =
			(query as GetManyQueryAny) ?? {};

		const modelAttributes = model.getAttributes();
		// users can supply things like ?slug=foo instead of ?filter={slug: 'foo'}, we filter those out here
		const restQueryFilterParams = rest
			? Object.fromEntries(Object.entries(rest).filter(([k]) => k in modelAttributes))
			: {};

		const filterParams = {
			...restQueryFilterParams,
			...(filter && filter),
		};

		const modelHasCommunityId = 'communityId' in modelAttributes;

		const shouldScopeToCommunity =
			(await extendedAccessCheck(
				options?.checkOtherFieldsForAdminAccess,
				filterParams,
				community.id,
			)) === false && modelHasCommunityId;

		const whereClause = (filter || restQueryFilterParams) && buildWhereClause(filterParams);

		// if you include a field but aren't adding it to the attributes, sequelize will throw an error
		const filteredInclude = attributes
			? (include ?? []).filter((includeItem) =>
					(attributes as string[]).includes(includeItem),
			  )
			: include ?? [];

		const result = (await model.findAll({
			...(Object.keys(whereClause).length > 0 && {
				where: {
					// @ts-expect-error FIXME: The 'filter' type does not work well generically
					...whereClause,
					...(shouldScopeToCommunity && { communityId: community.id }),
				},
			}),
			order: [[sort ?? 'createdAt', order ?? 'DESC']],
			...(attributes && { attributes }),
			limit: limit ?? 10,
			offset: offset ?? 0,
			...(filteredInclude.length > 0 && { include: createIncludes(model, filteredInclude) }),
			// the 'SerializedModel' type is kind of cheating since this isn't actually a serialized model,
			// but since this is only used to be returned immediately to the client, which forces it to be serialized, it's fine
		})) as SerializedModel<InstanceType<M>>[];

		return {
			body: result,
			status: 200 as const,
		};
	};
