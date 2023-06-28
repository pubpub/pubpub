import { DataTypes as dataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export const CrossrefDepositRecord = sequelize.define('CrossrefDepositRecord', {
	id: sequelize.idType,
	depositJson: { type: dataTypes.JSONB },
}) as any;
