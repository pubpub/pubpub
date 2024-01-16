import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import {
	AllowNull,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { Prettify, SerializedModel } from 'types';

type AnalyticsCredentials =
	| {
			type: 'GA';
			credentials: `G-${string}`;
	  }
	| {
			type: 'GTM';
			credentials: `GTM-${string}`;
	  }
	| {
			type: 'simple';
			credentials: string;
	  }
	| {
			type: 'fathom';
			credentials: string;
	  }
	| {
			type: 'default';
			credentials: null;
	  };

type AnalyticsType = AnalyticsCredentials['type'];

type Analytics<T extends AnalyticsType = AnalyticsType> = Prettify<
	AnalyticsCredentials & { type: T }
>;

@Table
export class AnalyticsSettings<
	T extends AnalyticsType = AnalyticsType,
	A extends Analytics<T> = Analytics<T>,
> extends Model<
	InferAttributes<AnalyticsSettings<T>, { omit: Extract<keyof AnalyticsSettings<T>, keyof A> }> &
		A,
	InferCreationAttributes<
		AnalyticsSettings<T>,
		{ omit: Extract<keyof AnalyticsSettings<T>, keyof A> }
	> &
		A
> {
	public declare toJSON: <M extends Model>(this: M) => SerializedModel<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@Default('default')
	@AllowNull(false)
	@Column(DataType.ENUM('GA', 'simple', 'fathom', 'default'))
	declare type: A['type'];

	@Column(DataType.TEXT)
	declare credentials: A['credentials'];
}
