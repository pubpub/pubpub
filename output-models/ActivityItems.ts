import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface ActivityItemsAttributes {
	id: string;
	kind: string;
	pubId?: string;
	payload?: object;
	timestamp: Date;
	communityId: string;
	actorId?: string;
	collectionId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'ActivityItems', timestamps: true })
export class ActivityItems
	extends Model<ActivityItemsAttributes, ActivityItemsAttributes>
	implements ActivityItemsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'ActivityItems_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	kind!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'activity_items_pub_id', using: 'btree', unique: false })
	pubId?: string;

	@Column({ type: DataType.JSONB })
	payload?: object;

	@Column({ allowNull: false, type: DataType.DATE })
	timestamp!: Date;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'activity_items_community_id', using: 'btree', unique: false })
	communityId!: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'activity_items_actor_id', using: 'btree', unique: false })
	actorId?: string;

	@Column({ type: DataType.UUID })
	@Index({ name: 'activity_items_collection_id', using: 'btree', unique: false })
	collectionId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
