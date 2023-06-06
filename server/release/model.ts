import {
	//	InferTypeFromAttributes,
	ModelAttributes,
	DataTypes as dataTypes,
} from 'sequelize';
import { sequelize } from '../sequelize';

const attributes = {
	id: sequelize.idType,
	/**
	 * The content of the release.
	 */
	noteContent: { type: dataTypes.JSONB },
	noteText: { type: dataTypes.TEXT },
	/**
	 * Set by Associations
	 */
	pubId: { type: dataTypes.UUID, allowNull: false },
	userId: { type: dataTypes.UUID, allowNull: false },
	docId: { type: dataTypes.UUID, allowNull: false },
	historyKey: { type: dataTypes.INTEGER, allowNull: false },
	historyKeyMissing: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
} satisfies ModelAttributes;

// export type ReleaseAttributes = InferTypeFromAttributes<typeof attributes>;

export const Release = sequelize.define('Release', attributes, {
	// @ts-expect-error ts(2345): Argument of type '{ classMethods: { associate: (models: any) => void; }; }' is not assignable to parameter of type 'ModelOptions<Model<any, any>>'. Object literal may only specify known properties, and 'classMethods' does not exist in type 'ModelOptions<Model<any, any>>'.
	classMethods: {
		associate: (models) => {
			const { Doc, Release: ReleaseModel } = models;
			ReleaseModel.belongsTo(Doc, {
				as: 'doc',
				foreignKey: 'docId',
			});
		},
	},
}) as any;
