import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { User, FeatureFlag } from '../models';

@Table
export class FeatureFlagUser extends Model<
	InferAttributes<FeatureFlagUser>,
	InferCreationAttributes<FeatureFlagUser>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.UUID)
	featureFlagId!: string | null;

	@Column(DataType.UUID)
	userId!: string | null;

	@Column(DataType.BOOLEAN)
	enabled!: boolean | null;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	user?: User;

	@BelongsTo(() => FeatureFlag, {
		onDelete: 'CASCADE',
		as: 'featureFlag',
		foreignKey: 'featureFlagId',
	})
	featureFlag?: FeatureFlag;
}
