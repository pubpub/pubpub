import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CommunityAdminsAttributes {
	id: string;
	userId: string;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'CommunityAdmins', timestamps: true })
export class CommunityAdmins
	extends Model<CommunityAdminsAttributes, CommunityAdminsAttributes>
	implements CommunityAdminsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CommunityAdmins_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'CommunityAdmins_userId_communityId_key', using: 'btree', unique: true })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'CommunityAdmins_userId_communityId_key', using: 'btree', unique: true })
	communityId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
