import { Attributes, FindOptions, ModelStatic } from 'sequelize';

import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	IsLowercase,
	Length,
	Is,
	Unique,
	Index,
	HasMany,
	BelongsTo,
	HasOne,
} from 'sequelize-typescript';
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ProjectionAlias,
} from 'sequelize';
import {
	PubAttribution,
	CollectionPub,
	Community,
	Draft,
	Discussion,
	Export,
	ReviewNew,
	Member,
	Release,
	PubVersion,
	PubEdge,
	Submission,
	CrossrefDepositRecord,
	ScopeSummary,
} from 'server/models';

@Table
export class Pub extends ModelWithBetterFind<InferAttributes<Pub>, InferCreationAttributes<Pub>> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@IsLowercase
	@Length({ min: 1, max: 280 })
	@Is(/^[a-zA-Z0-9-]+$/)
	@Unique
	@Column(DataType.TEXT)
	slug!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	title!: string;

	@Column(DataType.TEXT)
	htmlTitle!: string | null;

	@Length({ min: 0, max: 280 })
	@Column(DataType.TEXT)
	description!: string | null;

	@Length({ min: 0, max: 280 })
	@Column(DataType.TEXT)
	htmlDescription!: string | null;

	@Column(DataType.TEXT)
	avatar!: string | null;

	@Column(DataType.DATE)
	customPublishedAt!: Date | null;

	@Column(DataType.TEXT)
	doi!: string | null;

	// TODO: add validation for labels
	@Column(DataType.JSONB)
	labels!:
		| {
				id: string;
				color: string;
				title: string;
				publicApply: boolean;
		  }[]
		| null;

	/**  TODO: add validation for downloads
	// Should be something like
 *   {
    "url": "https://assets.pubpub.org/44k2vnvm/61595701771772.pdf",
    "type": "formatted",
    "branchId": null,
    "createdAt": "2020-07-25T18:29:32.319Z"
  }
 */
	@Column(DataType.JSONB)
	downloads!: any[] | null;

	@Column(DataType.JSONB)
	metadata!: object | null;

	@Column(DataType.STRING)
	viewHash!: string | null;

	@Column(DataType.STRING)
	editHash!: string | null;

	@Column(DataType.STRING)
	reviewHash!: string | null;

	@Column(DataType.STRING)
	commentHash!: string | null;

	@AllowNull(false)
	@Column(DataType.UUID)
	draftId!: string;

	@Index({ using: 'BTREE' })
	@AllowNull(false)
	@Column(DataType.UUID)
	communityId!: string;

	@Column(DataType.UUID)
	crossrefDepositRecordId!: string | null;

	@Column(DataType.UUID)
	scopeSummaryId!: string | null;

	@HasMany(() => PubAttribution, { onDelete: 'CASCADE', as: 'attributions', foreignKey: 'pubId' })
	attributions?: PubAttribution[];

	@HasMany(() => CollectionPub, {
		onDelete: 'CASCADE',
		hooks: true,
		as: 'collectionPubs',
		foreignKey: 'pubId',
	})
	collectionPubs?: CollectionPub[];

	@BelongsTo(() => Community, { onDelete: 'CASCADE', as: 'community', foreignKey: 'communityId' })
	community?: Community;

	@BelongsTo(() => Draft, { as: 'draft', foreignKey: 'draftId' })
	draft?: Draft;

	@HasMany(() => Discussion, { onDelete: 'CASCADE', as: 'discussions', foreignKey: 'pubId' })
	discussions?: Discussion[];

	@HasMany(() => Export, { as: 'exports', foreignKey: 'pubId' })
	exports?: Export[];

	@HasMany(() => ReviewNew, { onDelete: 'CASCADE', as: 'reviews', foreignKey: 'pubId' })
	reviews?: ReviewNew[];

	@HasMany(() => Member, { onDelete: 'CASCADE', as: 'members', foreignKey: 'pubId' })
	members?: Member[];

	@HasMany(() => Release, { onDelete: 'CASCADE', as: 'releases', foreignKey: 'pubId' })
	releases?: Release[];

	@HasMany(() => PubVersion, { onDelete: 'CASCADE', as: 'pubVersions', foreignKey: 'pubId' })
	pubVersions?: PubVersion[];

	@HasMany(() => PubEdge, { onDelete: 'CASCADE', as: 'outboundEdges', foreignKey: 'pubId' })
	outboundEdges?: Omit<PubEdge, 'pub'>[];

	@HasMany(() => PubEdge, { onDelete: 'CASCADE', as: 'inboundEdges', foreignKey: 'targetPubId' })
	inboundEdges?: Omit<PubEdge, 'targetPub'>[];

	@HasOne(() => Submission, { as: 'submission', foreignKey: 'pubId' })
	submission?: Submission;

	@BelongsTo(() => CrossrefDepositRecord, {
		as: 'crossrefDepositRecord',
		foreignKey: 'crossrefDepositRecordId',
		onDelete: 'SET NULL',
	})
	crossrefDepositRecord?: CrossrefDepositRecord;

	@BelongsTo(() => ScopeSummary, {
		as: 'scopeSummary',
		foreignKey: 'scopeSummaryId',
		onDelete: 'SET NULL',
	})
	scopeSummary?: ScopeSummary;
}

type BetterFindAttributeOptions<
	T extends Model,
	A extends keyof Attributes<T> = keyof Attributes<T>,
> =
	| (A | ProjectionAlias)[]
	| {
			exclude: A[];
			include?: (A | ProjectionAlias)[];
	  }
	| {
			exclude?: A[];
			include: (A | ProjectionAlias)[];
	  };

type BetterFindOptions<M extends Model, Attr extends keyof Attributes<M>[]> = Omit<
	FindOptions<Attributes<M>>,
	'attributes'
> & {
	attributes: Attr; // BetterFindAttributeOptions<M, Attr>;
};

export class ModelWithBetterFind<T extends {}, C extends {} = T> extends Model<T, C> {
	declare static findOne:
		| (<
				M extends Model,
				const Attr extends keyof Attributes<M>[],
				const O extends BetterFindOptions<M, Attr>,
		  >(
				this: ModelStatic<M>,
				options: O,
		  ) => O extends { attributes: infer A extends Attr }
				? // Promise<(Omit<M, keyof Attributes<M>> & Pick<M, A>) | null>
				  A
				: never) &
				(<M extends Model, const O extends Omit<FindOptions<Attributes<M>>, 'attributes'>>(
					this: ModelStatic<M>,
					options: O,
				) => Promise<M | null>);
}

const x = await Pub.findOne({
	attributes: ['attributions' as const],
});
x;
// ^?
