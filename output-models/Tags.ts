import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface TagsAttributes {
	id: string;
	title?: string;
	isRestricted?: boolean;
	isPublic?: boolean;
	pageId?: string;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Tags', timestamps: true })
export class Tags extends Model<TagsAttributes, TagsAttributes> implements TagsAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Tags_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ type: DataType.BOOLEAN })
	isRestricted?: boolean;

	@Column({ type: DataType.BOOLEAN })
	isPublic?: boolean;

	@Column({ type: DataType.UUID })
	pageId?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	communityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
