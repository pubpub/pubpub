import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface CitationStyleAttributes {
	citationStyle?: string;
	inlineCitationStyle?: string;
	id: string;
	facetBindingId: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({ tableName: 'CitationStyle', timestamps: true })
export class CitationStyle
	extends Model<CitationStyleAttributes, CitationStyleAttributes>
	implements CitationStyleAttributes
{
	@Column({ type: DataType.STRING })
	citationStyle?: string;

	@Column({ type: DataType.STRING })
	inlineCitationStyle?: string;

	@Column({ primaryKey: true, allowNull: false, type: DataType.UUID })
	@Index({ name: 'CitationStyle_pkey', using: 'btree', unique: true })
	id!: string;

	@Column({ allowNull: false, type: DataType.UUID })
	facetBindingId!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	createdAt!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updatedAt!: Date;
}
