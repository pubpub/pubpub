import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface DiscussionChannelParticipantsAttributes {
	id: string;
	isModerator?: boolean;
	userId: string;
	discussionChannelId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'DiscussionChannelParticipants', timestamps: true })
export class DiscussionChannelParticipants
	extends Model<DiscussionChannelParticipantsAttributes, DiscussionChannelParticipantsAttributes>
	implements DiscussionChannelParticipantsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'DiscussionChannelParticipants_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ type: DataType.BOOLEAN })
	isModerator?: boolean;

	@Column({ allowNull: false, type: DataType.UUID })
	userId!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	discussionChannelId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
