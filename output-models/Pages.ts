import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PagesAttributes {
	id: string;
	title: string;
	slug: string;
	description?: string;
	avatar?: string;
	isPublic?: boolean;
	isNarrowWidth?: boolean;
	viewHash?: string;
	layout: object;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
	layoutAllowsDuplicatePubs?: boolean;
}

@Table({ tableName: 'Pages', timestamps: true })
export class Pages extends Model<PagesAttributes, PagesAttributes> implements PagesAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Pages_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	slug!: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	isPublic?: boolean;

	@Column({ type: DataType.BOOLEAN })
	isNarrowWidth?: boolean;

	@Column({ type: DataType.STRING })
	viewHash?: string;

	@Column({ allowNull: false, type: DataType.JSONB })
	layout!: object;

	@Column({ allowNull: false, type: DataType.UUID })
	communityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	layoutAllowsDuplicatePubs?: boolean;
}
