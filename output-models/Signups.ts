import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface SignupsAttributes {
	id: string;
	email: string;
	hash?: string;
	count?: number;
	completed?: boolean;
	communityId?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Signups', timestamps: true })
export class Signups
	extends Model<SignupsAttributes, SignupsAttributes>
	implements SignupsAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'Signups_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING })
	@Index({ name: 'Signups_email_key', using: 'btree', unique: true })
	email!: string;

	@Column({ type: DataType.STRING })
	hash?: string;

	@Column({ type: DataType.INTEGER })
	count?: number;

	@Column({ type: DataType.BOOLEAN })
	completed?: boolean;

	@Column({ type: DataType.UUID })
	communityId?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
