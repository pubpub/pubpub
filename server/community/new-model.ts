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
	BelongsTo,
	HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {
	Organization,
	Collection,
	Pub,
	Page,
	DepositTarget,
	ScopeSummary,
	SpamTag,
} from '../models';

@Table
export class Community extends Model<
	InferAttributes<Community>,
	InferCreationAttributes<Community>
> {
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
	subdomain!: string;

	@Unique
	@Column(DataType.TEXT)
	domain?: string | null;

	@AllowNull(false)
	@Column(DataType.TEXT)
	title!: string;

	@Column(DataType.TEXT)
	citeAs?: string | null;

	@Column(DataType.TEXT)
	publishAs?: string | null;

	@Length({ min: 0, max: 280 })
	@Column(DataType.TEXT)
	description?: string | null;

	@Column(DataType.TEXT)
	avatar?: string | null;

	@Column(DataType.TEXT)
	favicon?: string | null;

	@Column(DataType.STRING)
	accentColorLight?: string | null;

	@Column(DataType.STRING)
	accentColorDark?: string | null;

	@Column(DataType.BOOLEAN)
	hideCreatePubButton?: boolean | null;

	@Column(DataType.TEXT)
	headerLogo?: string | null;

	@Column(DataType.JSONB)
	headerLinks?: object | null;

	@Default('dark')
	@Column(DataType.ENUM('light', 'dark', 'custom'))
	headerColorType?: CreationOptional<string | null>;

	@Column(DataType.BOOLEAN)
	useHeaderTextAccent?: boolean | null;

	@Column(DataType.BOOLEAN)
	hideHero?: boolean | null;

	@Column(DataType.BOOLEAN)
	hideHeaderLogo?: boolean | null;

	@Column(DataType.TEXT)
	heroLogo?: string | null;

	@Column(DataType.TEXT)
	heroBackgroundImage?: string | null;

	@Column(DataType.TEXT)
	heroBackgroundColor?: string | null;

	@Column(DataType.TEXT)
	heroTextColor?: string | null;

	@Column(DataType.BOOLEAN)
	useHeaderGradient?: boolean | null;

	@Column(DataType.TEXT)
	heroImage?: string | null;

	@Column(DataType.TEXT)
	heroTitle?: string | null;

	@Column(DataType.TEXT)
	heroText?: string | null;

	@Column(DataType.JSONB)
	heroPrimaryButton?: object | null;

	@Column(DataType.JSONB)
	heroSecondaryButton?: object | null;

	@Column(DataType.TEXT)
	heroAlign?: string | null;

	@Column(DataType.JSONB)
	navigation?: object | null;

	@Column(DataType.BOOLEAN)
	hideNav?: boolean | null;

	@Column(DataType.JSONB)
	navLinks?: object | null;

	@Column(DataType.JSONB)
	footerLinks?: object | null;

	@Column(DataType.TEXT)
	footerLogoLink?: string | null;

	@Column(DataType.TEXT)
	footerTitle?: string | null;

	@Column(DataType.TEXT)
	footerImage?: string | null;

	@Column(DataType.TEXT)
	website?: string | null;

	@Column(DataType.TEXT)
	facebook?: string | null;

	@Column(DataType.TEXT)
	twitter?: string | null;

	@Column(DataType.TEXT)
	email?: string | null;

	@Column(DataType.TEXT)
	issn?: string | null;

	@Column(DataType.BOOLEAN)
	isFeatured?: boolean | null;

	@Column(DataType.STRING)
	viewHash?: string | null;

	@Column(DataType.STRING)
	editHash?: string | null;

	@Default(false)
	@Column(DataType.BOOLEAN)
	premiumLicenseFlag?: CreationOptional<boolean | null>;

	@Column(DataType.JSONB)
	defaultPubCollections?: object | null;

	@Column(DataType.UUID)
	spamTagId?: string | null;

	@Column(DataType.UUID)
	organizationId?: string | null;

	@Column(DataType.UUID)
	scopeSummaryId?: string | null;

	@BelongsTo(() => Organization, {
		onDelete: 'CASCADE',
		as: 'organization',
		foreignKey: 'organizationId',
	})
	organization?: Organization;

	@HasMany(() => Collection, {
		onDelete: 'CASCADE',
		as: 'collections',
		foreignKey: 'communityId',
	})
	collections?: Collection[];

	@HasMany(() => Pub, { onDelete: 'CASCADE', as: 'pubs', foreignKey: 'communityId' })
	pubs?: Pub[];

	@HasMany(() => Page, { onDelete: 'CASCADE', as: 'pages', foreignKey: 'communityId' })
	pages?: Page[];

	@HasMany(() => DepositTarget, {
		onDelete: 'CASCADE',
		as: 'depositTargets',
		foreignKey: 'communityId',
	})
	depositTargets?: DepositTarget[];

	@BelongsTo(() => ScopeSummary, {
		as: 'scopeSummary',
		foreignKey: 'scopeSummaryId',
		onDelete: 'SET NULL',
	})
	scopeSummary?: ScopeSummary;

	@BelongsTo(() => SpamTag, { as: 'spamTag', foreignKey: 'spamTagId' })
	spamTag?: SpamTag;
}
