import { DataTypes as dataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export const CustomScript = sequelize.define('CustomScript', {
	id: sequelize.idType,
	communityId: { type: dataTypes.UUID },
	type: { type: dataTypes.STRING },
	content: { type: dataTypes.TEXT },
}) as any;
