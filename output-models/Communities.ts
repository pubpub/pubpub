import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CommunitiesAttributes {
	id: string;
	subdomain: string;
	domain?: string;
	title: string;
	description?: string;
	avatar?: string;
	favicon?: string;
	accentColor?: string;
	hideCreatePubButton?: boolean;
	headerLogo?: string;
	headerLinks?: object;
	hideHero?: boolean;
	hideHeaderLogo?: boolean;
	heroLogo?: string;
	heroBackgroundImage?: string;
	heroBackgroundColor?: string;
	heroTextColor?: string;
	useHeaderGradient?: boolean;
	heroImage?: string;
	heroTitle?: string;
	heroText?: string;
	heroPrimaryButton?: object;
	heroSecondaryButton?: object;
	heroAlign?: string;
	accentTextColor?: string;
	accentActionColor?: string;
	accentHoverColor?: string;
	accentMinimalColor?: string;
	navigation?: object;
	hideNav?: boolean;
	website?: string;
	facebook?: string;
	twitter?: string;
	email?: string;
	issn?: string;
	isFeatured?: boolean;
	defaultPubCollections?: object;
	accentColorLight?: string;
	accentColorDark?: string;
	headerColorType?: any;
	useHeaderTextAccent?: boolean;
	createdAt: Date;
	updatedAt: Date;
	premiumLicenseFlag?: boolean;
	organizationId?: string;
	navLinks?: object;
	footerTitle?: string;
	footerLinks?: object;
	footerImage?: string;
	viewHash?: string;
	editHash?: string;
	footerLogoLink?: string;
	scopeSummaryId?: string;
	citeAs?: string;
	publishAs?: string;
	spamTagId?: string;
}

@Table({ tableName: 'Communities', timestamps: true })
export class Communities
	extends Model<CommunitiesAttributes, CommunitiesAttributes>
	implements CommunitiesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Communities_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Communities_subdomain_key', using: 'btree', unique: true })
	subdomain!: string;

	@Column({ type: DataType.STRING })
	@Index({ name: 'Communities_domain_key', using: 'btree', unique: true })
	domain?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	title!: string;

	@Column({ type: DataType.STRING })
	description?: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.STRING })
	favicon?: string;

	@Column({ type: DataType.STRING(255) })
	accentColor?: string;

	@Column({ type: DataType.BOOLEAN })
	hideCreatePubButton?: boolean;

	@Column({ type: DataType.STRING })
	headerLogo?: string;

	@Column({ type: DataType.JSONB })
	headerLinks?: object;

	@Column({ type: DataType.BOOLEAN })
	hideHero?: boolean;

	@Column({ type: DataType.BOOLEAN })
	hideHeaderLogo?: boolean;

	@Column({ type: DataType.STRING })
	heroLogo?: string;

	@Column({ type: DataType.STRING })
	heroBackgroundImage?: string;

	@Column({ type: DataType.STRING })
	heroBackgroundColor?: string;

	@Column({ type: DataType.STRING })
	heroTextColor?: string;

	@Column({ type: DataType.BOOLEAN })
	useHeaderGradient?: boolean;

	@Column({ type: DataType.STRING })
	heroImage?: string;

	@Column({ type: DataType.STRING })
	heroTitle?: string;

	@Column({ type: DataType.STRING })
	heroText?: string;

	@Column({ type: DataType.JSONB })
	heroPrimaryButton?: object;

	@Column({ type: DataType.JSONB })
	heroSecondaryButton?: object;

	@Column({ type: DataType.STRING })
	heroAlign?: string;

	@Column({ type: DataType.STRING(255) })
	accentTextColor?: string;

	@Column({ type: DataType.STRING(255) })
	accentActionColor?: string;

	@Column({ type: DataType.STRING(255) })
	accentHoverColor?: string;

	@Column({ type: DataType.STRING(255) })
	accentMinimalColor?: string;

	@Column({ type: DataType.JSONB })
	navigation?: object;

	@Column({ type: DataType.BOOLEAN })
	hideNav?: boolean;

	@Column({ type: DataType.STRING })
	website?: string;

	@Column({ type: DataType.STRING })
	facebook?: string;

	@Column({ type: DataType.STRING })
	twitter?: string;

	@Column({ type: DataType.STRING })
	email?: string;

	@Column({ type: DataType.STRING })
	issn?: string;

	@Column({ type: DataType.BOOLEAN })
	isFeatured?: boolean;

	@Column({ type: DataType.JSONB })
	defaultPubCollections?: object;

	@Column({ type: DataType.STRING(255) })
	accentColorLight?: string;

	@Column({ type: DataType.STRING(255) })
	accentColorDark?: string;

	@Column({ defaultValue: Sequelize.literal('\'dark\'::"enum_Communities_headerColorType"') })
	headerColorType?: any;

	@Column({ type: DataType.BOOLEAN })
	useHeaderTextAccent?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	premiumLicenseFlag?: boolean;

	@Column({ type: DataType.UUID })
	organizationId?: string;

	@Column({ type: DataType.JSONB })
	navLinks?: object;

	@Column({ type: DataType.STRING })
	footerTitle?: string;

	@Column({ type: DataType.JSONB })
	footerLinks?: object;

	@Column({ type: DataType.STRING })
	footerImage?: string;

	@Column({ type: DataType.STRING(255) })
	viewHash?: string;

	@Column({ type: DataType.STRING(255) })
	editHash?: string;

	@Column({ type: DataType.STRING })
	footerLogoLink?: string;

	@Column({ type: DataType.UUID })
	scopeSummaryId?: string;

	@Column({ type: DataType.STRING })
	citeAs?: string;

	@Column({ type: DataType.STRING })
	publishAs?: string;

	@Column({ type: DataType.UUID })
	spamTagId?: string;
}
