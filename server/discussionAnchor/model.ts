import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	Index,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

@Table
export class DiscussionAnchor extends Model<
	InferAttributes<DiscussionAnchor>,
	InferCreationAttributes<DiscussionAnchor>
> {
	// this overrides the default Date type to be compatible with existing code
	declare createdAt: CreationOptional<string>;
	declare updatedAt: CreationOptional<string>;

	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isOriginal!: boolean;

	@Index({ using: 'BTREE' })
	@AllowNull(false)
	@Column(DataType.UUID)
	discussionId!: string;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	historyKey!: number;

	// TODO: Add validation for selection
	@Column(DataType.JSONB)
	selection!: null | { type: 'text'; anchor: number; head: number };

	@AllowNull(false)
	@Column(DataType.TEXT)
	originalText!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	originalTextPrefix!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	originalTextSuffix!: string;
}
