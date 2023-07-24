import { Attributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

export type NoRelationsSerizialized<T extends Model, S extends Attributes<T> = Attributes<T>> = {
	[P in keyof S]: S[P] extends Model | Model[] | undefined ? never : S[P];
};

type Prettify<T> = {
	[P in keyof T]: T[P];
} & {};

export type RecursiveAttributes<
	T extends Model,
	S extends Attributes<T> = Attributes<T>,
> = Prettify<{
	[P in keyof S]: S[P] extends Model | Model[] | undefined
		? S[P] extends Array<infer M extends Model> | undefined
			? RecursiveAttributes<M>[] | undefined
			: RecursiveAttributes<NonNullable<S[P]>> | undefined
		: S[P];
}>;
