import { Attributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

export type RecursivelySerialized<T extends Model, S extends Attributes<T> = Attributes<T>> = {
	[P in keyof S]: S[P] extends Model | Model[] | undefined
		? S[P] extends Array<infer M extends Model> | undefined
			? RecursivelySerialized<M>[] | undefined
			: RecursivelySerialized<NonNullable<S[P]>> | undefined
		: S[P];
};
