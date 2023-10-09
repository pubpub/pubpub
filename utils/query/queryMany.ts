import type { TsRestRequest } from '@ts-rest/express';
import { AppRouteQuery, ServerInferRequest } from '@ts-rest/core';
import { ModelCtor } from 'sequelize-typescript';
import { isCommunityAdmin } from 'server/community/queries';
import { ForbiddenError } from 'server/utils/errors';
import { Express, Response } from 'express-serve-static-core';
import { buildWhereClause } from './filter';
import { createIncludes } from './include';
import { GetManyQueryAny } from './createGetManyQuery';

export const queryMany =
	<M extends ModelCtor>(model: M) =>
	async <T extends AppRouteQuery>(
		input: ServerInferRequest<T, Express['request']['headers']> & {
			req: TsRestRequest<T>;
			res: Response;
		},
	) => {
		const { req, query } = input;

		const [canAdmin] = await isCommunityAdmin(req);

		if (!canAdmin) {
			throw new ForbiddenError();
		}

		const { limit, offset, attributes, order, sort, filter, include } =
			(query as GetManyQueryAny) ?? {};
		console.log(query);

		console.log(createIncludes(model, include));

		const result = (await model.findAll({
			...(filter && { where: buildWhereClause(filter) }),
			order: [[sort ?? 'createdAt', order ?? 'DESC']],
			...(attributes && { attributes }),
			limit: limit ?? 10,
			offset: offset ?? 0,
			...(include && { include: createIncludes(model, include) }),
		})) as InstanceType<M>[];

		return {
			body: result,
			status: 200 as const,
		};
	};
