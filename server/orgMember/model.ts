import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

import type { SerializedModel } from 'types';

import {
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Index,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';

import { Org } from '../org/model';
import { User } from '../user/model';

@Table({
	indexes: [
		{
			unique: true,
			fields: ['orgId', 'userId'],
			name: 'OrgMembers_orgId_userId_unique',
		},
	],
})
export class OrgMember extends Model<
	InferAttributes<OrgMember>,
	InferCreationAttributes<OrgMember>
> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	declare id: CreationOptional<string>;

	@ForeignKey(() => Org)
	@Column(DataType.UUID)
	declare orgId: string;

	@ForeignKey(() => User)
	@Index
	@Column(DataType.UUID)
	declare userId: string;

	@BelongsTo(() => Org, { onDelete: 'CASCADE', foreignKey: 'orgId' })
	declare org?: Org;

	@BelongsTo(() => User, { onDelete: 'CASCADE', foreignKey: 'userId' })
	declare user?: User;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	toJSON(): SerializedModel<OrgMember> {
		return super.toJSON() as unknown as SerializedModel<OrgMember>;
	}
}
