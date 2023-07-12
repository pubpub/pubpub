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
	IsEmail,
	HasMany,
	HasOne,
} from 'sequelize-typescript';
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	CreationAttributes,
} from 'sequelize';
import type { Strategy } from 'passport';
import {
	PubAttribution,
	Discussion,
	UserNotificationPreferences,
	ZoteroIntegration,
} from '../models';

/**
 * Basically typings for passport-local-sequelize
 */
declare abstract class ModelWithPassport<
	T extends {} = any,
	C extends {} = T,
	User = any,
> extends Model<T, C> {
	declare setPassword: (password: string, cb: (err: any, user?: User) => void) => void;

	declare setActivationKey: (cb: (err: any, user?: User) => void) => void;

	declare authenticate: (
		password: string,
		cb: ((err: any, user?: boolean, info?: any) => void) &
			((err: any, user?: User, info?: any) => void),
	) => void;

	declare static authenticate: () => (
		username: string,
		password: string,
		cb: ((err: any, user?: boolean, info?: any) => void) &
			((err: any, user?: InstanceType<typeof ModelWithPassport>, info?: any) => void),
	) => void;

	declare static serializeUser: () => (
		user: InstanceType<typeof ModelWithPassport>,
		cb: (err: any, id?: string) => void,
	) => void;

	declare static deserializeUser: () => (
		username: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static register: (
		user:
			| InstanceType<typeof ModelWithPassport>
			| string
			| CreationAttributes<ModelWithPassport>,
		password: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static activate: (
		username: string,
		password: string,
		activationKey: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static findByUsername: (
		username: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static setResetPasswordKey: (
		username: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static resetPassword: (
		username: string,
		password: string,
		resetPasswordKey: string,
		cb: (err: any, user?: InstanceType<typeof ModelWithPassport>) => void,
	) => void;

	declare static createStrategy: () => Strategy;

	declare isShadowUser?: boolean;

	declare feedback?: string;

	declare sha3hashedPassword: CreationOptional<string>;
}

@Table
export class User extends ModelWithPassport<
	InferAttributes<User>,
	InferCreationAttributes<User>,
	User
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
	slug!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	firstName!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	lastName!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	fullName!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	initials!: string;

	@Column(DataType.TEXT)
	avatar?: string | null;

	@Column(DataType.TEXT)
	bio?: string | null;

	@Column(DataType.TEXT)
	title?: string | null;

	@AllowNull(false)
	@IsLowercase
	@IsEmail
	@Unique
	@Column(DataType.TEXT)
	email!: string;

	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	publicEmail?: string | null;

	@Column(DataType.TEXT)
	authRedirectHost?: string | null;

	@Column(DataType.TEXT)
	location?: string | null;

	@Column(DataType.TEXT)
	website?: string | null;

	@Column(DataType.TEXT)
	facebook?: string | null;

	@Column(DataType.TEXT)
	twitter?: string | null;

	@Column(DataType.TEXT)
	github?: string | null;

	@Column(DataType.TEXT)
	orcid?: string | null;

	@Column(DataType.TEXT)
	googleScholar?: string | null;

	@Column(DataType.DATE)
	resetHashExpiration?: Date | null;

	@Column(DataType.TEXT)
	resetHash?: string | null;

	@Column(DataType.BOOLEAN)
	inactive?: boolean | null;

	@Column(DataType.INTEGER)
	pubpubV3Id?: number | null;

	@Column(DataType.TEXT)
	passwordDigest?: string | null;

	@AllowNull(false)
	@Column(DataType.TEXT)
	hash!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.TEXT)
	salt!: CreationOptional<string>;

	@Default(null)
	@Column(DataType.BOOLEAN)
	gdprConsent?: CreationOptional<boolean | null>;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isSuperAdmin!: CreationOptional<boolean>;

	@HasMany(() => PubAttribution, {
		onDelete: 'CASCADE',
		as: 'attributions',
		foreignKey: 'userId',
	})
	attributions?: PubAttribution[];

	@HasMany(() => Discussion, { onDelete: 'CASCADE', as: 'discussions', foreignKey: 'userId' })
	discussions?: Discussion[];

	@HasOne(() => UserNotificationPreferences, {
		onDelete: 'CASCADE',
		as: 'userNotificationPreferences',
		foreignKey: 'userId',
	})
	userNotificationPreferences?: UserNotificationPreferences;

	@HasOne(() => ZoteroIntegration, {
		as: 'zoteroIntegration',
		foreignKey: { name: 'userId', allowNull: false },
	})
	zoteroIntegration?: ZoteroIntegration;
}
