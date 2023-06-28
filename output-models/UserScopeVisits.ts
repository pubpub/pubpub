import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UserScopeVisitsAttributes {
	id: string;
	userId?: string;
	pubId?: string;
	collectionId?: string;
	communityId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'UserScopeVisits', timestamps: true })
export class UserScopeVisits
	extends Model<UserScopeVisitsAttributes, UserScopeVisitsAttributes>
	implements UserScopeVisitsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'UserScopeVisits_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'user_scope_visits_user_id_collection_id', using: 'btree', unique: true })
	@Index({ name: 'user_scope_visits_user_id_pub_id', using: 'btree', unique: true })
	userId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'user_scope_visits_user_id_pub_id', using: 'btree', unique: true })
	pubId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'user_scope_visits_user_id_collection_id', using: 'btree', unique: true })
	collectionId?: string;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
