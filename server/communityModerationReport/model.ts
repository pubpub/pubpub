import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

import type { SerializedModel } from 'types';

import {
	AllowNull,
	BelongsTo,
	Column,
	DataType,
	Default,
	Index,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';

import { Community, Discussion, SpamTag, User } from '../models';

export type ModerationReportReason =
	| 'spam-content'
	| 'hateful-language'
	| 'harassment'
	| 'impersonation'
	| 'other';

export type ModerationReportStatus = 'active' | 'retracted' | 'dismissed' | 'escalated';

@Table({ tableName: 'CommunityModerationReports' })
export class CommunityModerationReport extends Model<
	InferAttributes<CommunityModerationReport>,
	InferCreationAttributes<CommunityModerationReport>
> {
	public declare toJSON: <M extends Model>(this: M) => SerializedModel<M>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@AllowNull(false)
	@Index
	@Column(DataType.UUID)
	declare userId: string;

	@AllowNull(false)
	@Index
	@Column(DataType.UUID)
	declare communityId: string;

	@AllowNull(false)
	@Column(DataType.UUID)
	declare flaggedById: string;

	@AllowNull(false)
	@Column(
		DataType.ENUM('spam-content', 'hateful-language', 'harassment', 'impersonation', 'other'),
	)
	declare reason: ModerationReportReason;

	@Column(DataType.TEXT)
	declare reasonText: string | null;

	@Column(DataType.UUID)
	declare sourceDiscussionId: string | null;

	@Column(DataType.UUID)
	declare spamTagId: string | null;

	@AllowNull(false)
	@Default('active')
	@Column(DataType.ENUM('active', 'retracted', 'dismissed', 'escalated'))
	declare status: CreationOptional<ModerationReportStatus>;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	declare user?: User;

	@BelongsTo(() => Community, { onDelete: 'CASCADE', as: 'community', foreignKey: 'communityId' })
	declare community?: Community;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'flaggedBy', foreignKey: 'flaggedById' })
	declare flaggedBy?: User;

	@BelongsTo(() => Discussion, {
		onDelete: 'SET NULL',
		as: 'sourceDiscussion',
		foreignKey: 'sourceDiscussionId',
	})
	declare sourceDiscussion?: Discussion;

	@BelongsTo(() => SpamTag, { onDelete: 'SET NULL', as: 'spamTag', foreignKey: 'spamTagId' })
	declare spamTag?: SpamTag;
}
