import { Attributes, CreationAttributes, CreationOptional } from 'sequelize';
import { Model } from 'sequelize-typescript';

export type Prettify<T> = {
	[P in keyof T]: T[P];
} & {};

/**
 * A (sort of) serialized model. The real output of `toJSON` when called on a model, sequelize-typescript's `toJSON` is
 * not recursive, so this is a recursive version of that.
 */
export type SerializedModel<
	T extends Model,
	/**
	 * Whether to get the creation attributes
	 */
	C extends boolean = false,
	S extends C extends false ? Attributes<T> : CreationAttributes<T> = C extends false
		? Attributes<T>
		: CreationAttributes<T>,
> = Prettify<
	Omit<
		{
			[P in keyof S]: P extends 'createdAt' | 'updatedAt'
				? string
				: S[P] extends Model | Model[] | undefined
				? S[P] extends Array<infer M extends Model> | undefined
					? SerializedModel<M, C>[] | undefined
					: SerializedModel<NonNullable<S[P]>, C> | undefined
				: S[P] extends Date | null
				? S[P] extends Date
					? string
					: string | null
				: S[P] extends CreationOptional<infer R>
				? R
				: S[P];
		},
		'version' | 'deletedAt'
	>
>;

export type RecursiveCreationAttributes<T extends Model> = SerializedModel<T, true>;
