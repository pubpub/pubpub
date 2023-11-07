import { z, ZodRawShape, ZodTypeAny } from 'zod';

import { Op, WhereOptions } from 'sequelize';

const plainAndBooleanAndArrayFilter = <Z extends ZodTypeAny>(schema: Z) => {
	const plainOrBooleanOrArray = z.union([schema, z.boolean(), z.array(schema)]);

	return z.union([plainOrBooleanOrArray, z.array(plainOrBooleanOrArray)]);
};

const dateNumberFilter = <Z extends ZodTypeAny>(fieldSchema: Z) =>
	plainAndBooleanAndArrayFilter(
		z.union([
			fieldSchema,
			z.object({
				eq: fieldSchema.optional(),
				gt: fieldSchema.optional(),
				gte: fieldSchema.optional(),
				lt: fieldSchema.optional(),
				lte: fieldSchema.optional(),
				ne: fieldSchema.optional(),
			}),
		]),
	);

const booleanFilter = z.boolean();

const stringFilter = <Z extends z.ZodString>(schema: Z, strict?: boolean) =>
	strict
		? z.union([schema, schema.array()])
		: plainAndBooleanAndArrayFilter(
				z.union([
					schema,
					z.union([
						z.object({
							exact: schema.optional(),
							contains: z.undefined(),
							not: z.undefined(),
						}),
						z.object({
							exact: z.undefined(),
							contains: z.string().optional(),
							not: z.boolean().optional(),
						}),
						z.object({
							exact: z.undefined(),
							contains: z.undefined(),
							not: z.undefined(),
						}),
					]),
				]),
		  ).optional();

const enumFilter = <Z extends z.ZodEnum<any>>(schema: Z) => plainAndBooleanAndArrayFilter(schema);

export const generateFilterSchema = <Z extends z.ZodType<any>>(baseSchema: Z) => {
	/**
	 * Unwrap nested optionals, nullables, and defaults
	 */
	while (
		baseSchema instanceof z.ZodOptional ||
		baseSchema instanceof z.ZodNullable ||
		baseSchema instanceof z.ZodDefault
	) {
		if (baseSchema instanceof z.ZodDefault) {
			baseSchema = baseSchema.removeDefault();
		}
		if (baseSchema instanceof z.ZodNullable || baseSchema instanceof z.ZodOptional) {
			baseSchema = baseSchema.unwrap();
		}
	}

	if (baseSchema instanceof z.ZodUnion || baseSchema instanceof z.ZodDiscriminatedUnion) {
		return z.union(baseSchema.options.map(generateFilterSchema)) as any;
	}

	if (baseSchema instanceof z.ZodArray) {
		return z.array(generateFilterSchema(baseSchema.element)) as any;
	}

	if (baseSchema instanceof z.ZodObject) {
		const shape = Object.entries(baseSchema.shape as ZodRawShape).reduce(
			(acc, [key, value]) => {
				acc[key] = generateFilterSchema(value).optional();
				return acc;
			},
			{} as ZodRawShape,
		);
		return z.object(shape);
	}

	if (baseSchema instanceof z.ZodEnum) {
		return enumFilter(baseSchema);
	}
	if (baseSchema instanceof z.ZodString) {
		return stringFilter(baseSchema, baseSchema.isUUID);
	}
	if (baseSchema instanceof z.ZodNumber || baseSchema instanceof z.ZodDate) {
		return dateNumberFilter(baseSchema);
	}
	if (baseSchema instanceof z.ZodBoolean) {
		return booleanFilter;
	}

	return z.any();
};

export type FilterType<T, isUUID extends boolean = false> = T extends z.ZodType<infer U, any, any>
	? U extends Array<infer X>
		? Array<FilterType<z.ZodType<X, any, any>>>
		: U extends string
		? string extends U
			? isUUID extends false
				? // @ts-expect-error FIXME: Typescript doesn't understand that if
				  StringFilter<T>
				: string | string[]
			: EnumFilter<T>
		: U extends number | Date
		? // @ts-expect-error FIXME: Typescript doesn't understand that if
		  // `U extends number | Date` then `T extends z.ZodType<number> | z.ZodType<Date>`
		  NumberDateFilter<T>
		: U extends boolean
		? boolean
		: U extends object
		? ObjectFilter<U>
		: never
	: never;

type EnumFilter<T> = T extends z.ZodType<infer U, any, any>
	? U | Array<T extends z.ZodType<infer Y, any, any> ? Y : never>
	: never;
type StringFilter<T extends z.ZodString> = z.infer<ReturnType<typeof stringFilter<T>>>;
type NumberDateFilter<T extends z.ZodType<number> | z.ZodType<Date>> = z.infer<
	ReturnType<typeof dateNumberFilter<T>>
>;
type ObjectFilter<T extends Record<string, any>> = {
	[K in keyof T]?: K extends 'id' | `${string}Id`
		? FilterType<z.ZodType<T[K], any, any>, true>
		: FilterType<z.ZodType<T[K], any, any>>;
};

type FilterT<T> = z.ZodType<FilterType<T>>;

export const generateFilterForModelSchema = <Z extends z.ZodObject<any>>(modelSchema: Z) => {
	const result = generateFilterSchema(
		modelSchema.extend({
			createdAt: z.date(),
			updatedAt: z.date(),
		}),
	) as FilterT<Z>;
	return result;
};

type ZodTypes =
	| z.ZodType<number>
	| z.ZodType<string>
	| z.ZodType<Date>
	| z.ZodType<Boolean>
	| z.ZodEnum<[string, ...string[]]>
	| z.ZodType<Record<string, any>>;

type FilterTypess<T> = T extends T ? FilterType<T> : never;
type FilterTypes = FilterTypess<ZodTypes>;

const buildFieldWhereClause = <T extends FilterTypes>(filterField: T, arrayDepth = 0) => {
	if (Array.isArray(filterField)) {
		return {
			[arrayDepth > 0 ? Op.and : Op.or]: filterField.map((filter) =>
				buildFieldWhereClause(filter, arrayDepth + 1),
			),
		};
	}

	if (typeof filterField === 'boolean') {
		if (filterField) {
			return { [Op.not]: null };
		}

		return { [Op.is]: null };
	}

	if (typeof filterField === 'object') {
		const w = Object.entries(filterField).reduce((acc, [key, value]) => {
			if (key === 'exact') {
				acc[Op.eq] = value;
			}
			if (key === 'contains') {
				acc[
					'not' in filterField && filterField.not ? Op.notILike : Op.iLike
				] = `%${value}%`;
			}

			if (['gt', 'lt', 'gte', 'lte', 'eq', 'ne'].includes(key)) {
				acc[Op[key]] = value;
			}

			return acc;
		}, {} as any);

		return w;
	}

	return filterField;
};

/**
 * Builds a Sequelize `where` clause based on the provided filters.
 * @param filters - An object containing the filters to apply to the query.
 * @returns A Sequelize `where` clause object.
 */
export const buildWhereClause = <T extends ObjectFilter<any>>(filters: T) => {
	const where: WhereOptions<z.infer<FilterType<T>>> = {};

	Object.keys(filters).forEach((key) => {
		const filterField = filters[key];
		where[key] = buildFieldWhereClause(filterField);
	});

	return where;
};
