import { Attributes, CreationAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

type Prettify<T> = {
	[P in keyof T]: T[P];
} & {};

export type RecursiveAttributes<
	T extends Model,
	C extends boolean = false,
	S extends C extends false ? Attributes<T> : CreationAttributes<T> = C extends false
		? Attributes<T>
		: CreationAttributes<T>,
> = Prettify<{
	[P in keyof S]: S[P] extends Model | Model[] | undefined
		? S[P] extends Array<infer M extends Model> | undefined
			? RecursiveAttributes<M, C>[] | undefined
			: RecursiveAttributes<NonNullable<S[P]>, C> | undefined
		: S[P];
}>;

export type RecursiveCreationAttributes<T extends Model> = RecursiveAttributes<T, true>;
