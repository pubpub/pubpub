import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UsersAttributes {
	id: string;
	slug: string;
	firstName: string;
	lastName: string;
	fullName: string;
	initials: string;
	avatar?: string;
	bio?: string;
	title?: string;
	email: string;
	publicEmail?: string;
	location?: string;
	website?: string;
	facebook?: string;
	twitter?: string;
	github?: string;
	orcid?: string;
	googleScholar?: string;
	resetHashExpiration?: Date;
	resetHash?: string;
	inactive?: boolean;
	pubpubV3Id?: number;
	passwordDigest?: string;
	hash: string;
	salt: string;
	gdprConsent?: boolean;
	createdAt: Date;
	updatedAt: Date;
	isSuperAdmin?: boolean;
	authRedirectHost?: string;
}

@Table({ tableName: 'Users', timestamps: true })
export class Users extends Model<UsersAttributes, UsersAttributes> implements UsersAttributes {
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Users_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Users_slug_key', using: 'btree', unique: true })
	slug!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	firstName!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	lastName!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	fullName!: string;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	initials!: string;

	@Column({ type: DataType.STRING })
	avatar?: string;

	@Column({ type: DataType.STRING })
	bio?: string;

	@Column({ type: DataType.STRING })
	title?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Users_email_key', using: 'btree', unique: true })
	email!: string;

	@Column({ type: DataType.STRING })
	publicEmail?: string;

	@Column({ type: DataType.STRING })
	location?: string;

	@Column({ type: DataType.STRING })
	website?: string;

	@Column({ type: DataType.STRING })
	facebook?: string;

	@Column({ type: DataType.STRING })
	twitter?: string;

	@Column({ type: DataType.STRING })
	github?: string;

	@Column({ type: DataType.STRING })
	orcid?: string;

	@Column({ type: DataType.STRING })
	googleScholar?: string;

	@Column({ type: DataType.DATE })
	resetHashExpiration?: Date;

	@Column({ type: DataType.STRING })
	resetHash?: string;

	@Column({ type: DataType.BOOLEAN })
	inactive?: boolean;

	@Column({ type: DataType.INTEGER })
	pubpubV3Id?: number;

	@Column({ type: DataType.STRING })
	passwordDigest?: string;

	@Column({ allowNull: false, type: DataType.STRING })
	hash!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	salt!: string;

	@Column({ type: DataType.BOOLEAN })
	gdprConsent?: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: Sequelize.literal('false') })
	isSuperAdmin?: boolean;

	@Column({ type: DataType.STRING })
	authRedirectHost?: string;
}
