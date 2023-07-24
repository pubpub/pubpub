import { Model, Table, Column, DataType, PrimaryKey, Default, HasOne } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { RecursiveAttributes } from 'types';
import { ZoteroIntegration } from '../models';

@Table({
	tableName: 'IntegrationDataOAuth1',
})
export class IntegrationDataOAuth1 extends Model<
	InferAttributes<IntegrationDataOAuth1>,
	InferCreationAttributes<IntegrationDataOAuth1>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	public declare toJSON: <M extends Model>(this: M) => RecursiveAttributes<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.TEXT)
	accessToken!: string | null;

	@HasOne(() => ZoteroIntegration, {
		foreignKey: { allowNull: false, name: 'integrationDataOAuth1Id' },
		as: 'zoteroIntegration',
		onDelete: 'CASCADE',
	})
	zoteroIntegration?: ZoteroIntegration;
}
