import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ReleasesAttributes {
	id: string;
	noteContent?: object;
	noteText?: string;
	pubId: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	historyKey: number;
	historyKeyMissing?: boolean;
	docId?: string;
}

@Table({ tableName: 'Releases', timestamps: true })
export class Releases
	extends Model<ReleasesAttributes, ReleasesAttributes>
	implements ReleasesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Releases_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.JSONB })
	noteContent?: object;

	@Column({ type: DataType.STRING })
	noteText?: string;

	@Column({ allowNull: false, type: DataType.UUID })
	pubId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.INTEGER })
	historyKey!: number;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	historyKeyMissing?: boolean;

	@Column({ type: DataType.UUID })
	docId?: string;
}
