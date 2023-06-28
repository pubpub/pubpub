import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface UserDismissablesAttributes {
	id: string;
	key: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'UserDismissables', timestamps: true })
export class UserDismissables
	extends Model<UserDismissablesAttributes, UserDismissablesAttributes>
	implements UserDismissablesAttributes
{
	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'UserDismissables_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	key!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	@Index({ name: 'user_dismissables_user_id', using: 'btree', unique: false })
	userId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
