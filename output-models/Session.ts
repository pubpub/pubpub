import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface SessionAttributes {
	sid: string;
	expires?: Date;
	data?: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'Session', timestamps: true })
export class Session
	extends Model<SessionAttributes, SessionAttributes>
	implements SessionAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.STRING(36) })
	@Index({ name: 'Session_pkey', using: 'btree', unique: true })
	sid!: string;

	@Column({ type: DataType.DATE })
	expires?: Date;

	@Column({ type: DataType.STRING })
	data?: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
