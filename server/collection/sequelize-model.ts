import {
	Model,
	HasMany,
	HasOne,
	BelongsTo,
	Table,
	Column,
	DataType,
	PrimaryKey,
	IsLowercase,
	Length,
	Is,
	AllowNull,
	Default,
} from 'sequelize-typescript';
import { Attributes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {
	CollectionAttribution,
	CollectionPub,
	Community,
	DepositRecord,
	Member,
	Page,
	ScopeSummary,
	SubmissionWorkflow,
} from 'types';
import {
	CollectionPub as CollectionPubModel,
	CrossrefDepositRecord as CrossrefDepositRecordModel,
	SubmissionWorkflow as SubmissionWorkflowModel,
	Member as MemberModel,
	Page as PageModel,
	ScopeSummary as ScopeSummaryModel,
	Community as CommunityModel,
	CollectionAttribution as CollectionAttributionModel,
} from '../models';

@Table
export class Collection extends Model<
	InferAttributes<Collection>,
	InferCreationAttributes<Collection>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Column(DataType.TEXT)
	title?: string | null;

	@AllowNull(false)
	@IsLowercase
	@Length({ min: 1, max: 280 })
	@Is(/^[a-zA-Z0-9-]+$/)
	@Column(DataType.TEXT)
	slug!: string;

	@Column(DataType.TEXT)
	avatar?: string | null;

	@Column(DataType.BOOLEAN)
	isRestricted?: boolean | null;

	@Column(DataType.BOOLEAN)
	isPublic?: boolean | null;

	@Column(DataType.STRING)
	viewHash?: string | null;

	@Column(DataType.STRING)
	editHash?: string | null;

	@Column(DataType.JSONB)
	metadata?: object | null;

	@Column(DataType.TEXT)
	kind?: string | null;

	@Column(DataType.TEXT)
	doi?: string | null;

	@Default('choose-best')
	@Column(DataType.ENUM('none', 'minimal', 'medium', 'choose-best'))
	readNextPreviewSize!: CreationOptional<string>;

	@Default({})
	@Column(DataType.JSONB)
	layout!: CreationOptional<object>;

	@Default(false)
	@Column(DataType.BOOLEAN)
	layoutAllowsDuplicatePubs!: CreationOptional<boolean>;

	@Column(DataType.UUID)
	pageId?: string | null;

	@Column(DataType.UUID)
	communityId?: string | null;

	@Column(DataType.UUID)
	scopeSummaryId?: string | null;

	@HasMany(() => CollectionAttributionModel, {
		onDelete: 'CASCADE',
		as: 'attributions',
		foreignKey: 'collectionId',
	})
	attributions?: CollectionAttribution[];

	@HasMany(() => CollectionPubModel, {
		as: 'collectionPubs',
		foreignKey: 'collectionId',
	})
	collectionPubs?: CollectionPub[];

	@BelongsTo(() => CrossrefDepositRecordModel)
	crossrefDepositRecord?: DepositRecord;

	@HasOne(() => SubmissionWorkflowModel)
	submissionWorkflow?: SubmissionWorkflow;

	@HasMany(() => MemberModel)
	members?: Member[];

	@BelongsTo(() => PageModel)
	page?: Page;

	@BelongsTo(() => ScopeSummaryModel)
	scopeSummary?: ScopeSummary;

	@BelongsTo(() => CommunityModel)
	community?: Community;
}

export type CollectionType = Attributes<Collection>;
