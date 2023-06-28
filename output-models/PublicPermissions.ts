import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface PublicPermissionsAttributes {
	id: string;
	canCreateForks?: boolean;
	canCreateReviews?: boolean;
	canCreateDiscussions?: boolean;
	canViewDraft?: boolean;
	canEditDraft?: boolean;
	pubId?: string;
	collectionId?: string;
	communityId?: string;
	organizationId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'PublicPermissions', timestamps: true })
export class PublicPermissions
	extends Model<PublicPermissionsAttributes, PublicPermissionsAttributes>
	implements PublicPermissionsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'PublicPermissions_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.BOOLEAN })
	canCreateForks?: boolean;

	@Column({ type: DataType.BOOLEAN })
	canCreateReviews?: boolean;

	@Column({ type: DataType.BOOLEAN })
	canCreateDiscussions?: boolean;

	@Column({ type: DataType.BOOLEAN })
	canViewDraft?: boolean;

	@Column({ type: DataType.BOOLEAN })
	canEditDraft?: boolean;

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
}
