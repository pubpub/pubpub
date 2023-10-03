import { Model } from 'sequelize-typescript';
import {
	Thread,
	ThreadComment,
	ThreadEvent,
	Visibility,
	includeUserModel,
	Commenter,
} from 'server/models';
import { Prettify, SerializedModel } from 'types';

export const stripFalsyIdsFromQuery = (whereQueryObject) => {
	return Object.fromEntries(Object.entries(whereQueryObject).filter((entry) => entry[1]));
};

type PossiblyNestedModels =
	| Model
	| {
			[K: string]:
				| PossiblyNestedModels[]
				| PossiblyNestedModels
				| Model
				| Record<string, any>
				| string
				| boolean
				| number
				| undefined
				| null;
	  };

type SerializedModels<S extends PossiblyNestedModels> = {
	[P in keyof S]: S[P] extends (infer M extends Model)[]
		? SerializedModel<M>[]
		: S[P] extends Model | null
		? S[P] extends infer M extends Model
			? M extends M
				? SerializedModel<M>
				: never
			: SerializedModel<NonNullable<S[P]>> | null
		: S[P];
};

export const ensureSerialized = <T extends PossiblyNestedModels>(
	item: T,
): Prettify<SerializedModels<T>> => {
	if (Array.isArray(item)) {
		return item.map(ensureSerialized) as any;
	}
	if (item && typeof item === 'object') {
		if ('toJSON' in item && typeof item.toJSON === 'function') {
			return item.toJSON();
		}
		const res = {};

		Object.keys(item).forEach((key) => {
			res[key] = ensureSerialized(item[key]);
		});
		return res as any;
	}
	return item;
};

export const sanitizeOnVisibility = (objectsWithVisibility, activePermissions, loginId) => {
	const { canView, canAdmin } = activePermissions;
	return objectsWithVisibility.filter((item) => {
		if (item.visibility.access === 'public') {
			return true;
		}
		if (item.visibility.access === 'members') {
			return canView;
		}
		if (item.visibility.access === 'private') {
			return (
				canAdmin ||
				item.visibility.users.find((user) => {
					return user.id === loginId;
				})
			);
		}
		return false;
	});
};

export const baseAuthor = [includeUserModel({ as: 'author' })];
export const baseThread = [
	{
		model: Thread,
		as: 'thread',
		include: [
			{
				model: ThreadComment,
				as: 'comments',
				include: [
					includeUserModel({ as: 'author' }),
					{ model: Commenter, as: 'commenter' },
				],
			},
			{
				model: ThreadEvent,
				as: 'events',
				include: [includeUserModel({ as: 'user' })],
			},
		],
	},
];

export const baseVisibility = [
	{
		model: Visibility,
		as: 'visibility',
		include: [includeUserModel({ as: 'users' })],
	},
];
