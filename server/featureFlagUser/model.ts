import { DataTypes as dataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export const FeatureFlagUser = sequelize.define(
	'FeatureFlagUser',
	{
		id: sequelize.idType,
		featureFlagId: { type: dataTypes.UUID },
		userId: { type: dataTypes.UUID },
		enabled: { type: dataTypes.BOOLEAN },
	},
	{
		// @ts-expect-error ts(2345): Argument of type '{ classMethods: { associate: (models: any) => void; }; }' is not assignable to parameter of type 'ModelOptions<Model<any, any>>'. Object literal may only specify known properties, and 'classMethods' does not exist in type 'ModelOptions<Model<any, any>>'.
		classMethods: {
			associate: (models) => {
				const { FeatureFlag, FeatureFlagUser, User } = models;
				FeatureFlagUser.belongsTo(User, {
					onDelete: 'CASCADE',
					as: 'user',
					foreignKey: 'userId',
				});
				FeatureFlagUser.belongsTo(FeatureFlag, {
					onDelete: 'CASCADE',
					as: 'featureFlag',
					foreignKey: 'featureFlagId',
				});
			},
		},
	},
) as any;
