import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PubTagsAttributes {
	id: string;
	pubId?: string;
	tagId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PubTags', timestamps: true })
export class PubTags
	extends Model<PubTagsAttributes, PubTagsAttributes>
	implements PubTagsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PubTags_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	pubId?: string;

	@Column({ type: DataType.UUID })
	tagId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
