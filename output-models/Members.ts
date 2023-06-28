import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface MembersAttributes {
	id: string;
	permissions?: any;
	isOwner?: boolean;
	userId: string;
	pubId?: string;
	collectionId?: string;
	communityId?: string;
	organizationId?: string;
	createdAt: Date;
	updatedAt: Date;
	subscribedToActivityDigest?: boolean;
}

@Table({ tableName: 'Members', timestamps: true })
export class Members
	extends Model<MembersAttributes, MembersAttributes>
	implements MembersAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Members_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ defaultValue: Sequelize.literal('\'view\'::"enum_Members_permissions"') })
	permissions?: any;

	@Column({ type: DataType.BOOLEAN })
	isOwner?: boolean;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ type: DataType.UUID })
	pubId?: string;

	@Column({ type: DataType.UUID })
	collectionId?: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ type: DataType.UUID })
	organizationId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	subscribedToActivityDigest?: boolean;
}
