import { Model, Table, Column, DataType, PrimaryKey, Default, Index } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

@Table
export class UserScopeVisit extends Model<
	InferAttributes<UserScopeVisit>,
	InferCreationAttributes<UserScopeVisit>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Index({ unique: true, name: 'UserScopeVisit_userId_collectionId' })
	@Index({ unique: true, name: 'UserScopeVisit_userId_pubId' })
	@Column(DataType.UUID)
	userId?: string | null;

	@Index({ unique: true, name: 'UserScopeVisit_userId_pubId' })
	@Column(DataType.UUID)
	pubId?: string | null;

	@Index({ unique: true, name: 'UserScopeVisit_userId_collectionId' })
	@Column(DataType.UUID)
	collectionId?: string | null;

	@Column(DataType.UUID)
	communityId?: string | null;
}
