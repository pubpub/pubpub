import { DataTypes as dataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export const ScopeSummary = sequelize.define(
	'ScopeSummary',
	{
		id: sequelize.idType,
		collections: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		pubs: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		discussions: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		reviews: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		submissions: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
	},
	{
		// @ts-expect-error blaah
		classMethods: {
			associate: (models) => {
				const { ScopeSummary: ScopeSummaryModel, Collection, Pub, Community } = models;

				ScopeSummaryModel.hasOne(Collection, {
					as: 'collection',
					foreignKey: 'scopeSummaryId',
					onDelete: 'CASCADE',
				});

				ScopeSummaryModel.hasOne(Pub, {
					as: 'pub',
					onDelete: 'CASCADE',
					foreignKey: 'scopeSummaryId',
				});

				ScopeSummaryModel.hasOne(Community, {
					as: 'community',
					onDelete: 'CASCADE',
					foreignKey: 'scopeSummaryId',
				});
			},
		},
	},
) as any;
