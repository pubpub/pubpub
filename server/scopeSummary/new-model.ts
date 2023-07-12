import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	HasOne,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Collection, Pub, Community } from '../models';

@Table
class ScopeSummary extends Model<
	InferAttributes<ScopeSummary>,
	InferCreationAttributes<ScopeSummary>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	collections!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	pubs!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	discussions!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	reviews!: CreationOptional<number>;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	submissions!: CreationOptional<number>;

	// @HasOne(() => Collection, {
	// 	as: 'collection',
	// 	foreignKey: 'scopeSummaryId',
	// 	onDelete: 'CASCADE',
	// })
	// 	// collection?: Collection;
	// collection?: any;

	// @HasOne(() => Pub, { as: 'pub', foreignKey: 'scopeSummaryId', onDelete: 'CASCADE' })
	// 	// pub?: Pub;
	// pub?: any;

	// @HasOne(() => Community, { as: 'community', foreignKey: 'scopeSummaryId', onDelete: 'CASCADE' })
	// 	// community?: Community;
	// community?: any;
}

export const ScopeSummaryAnyModel = ScopeSummary as any;
