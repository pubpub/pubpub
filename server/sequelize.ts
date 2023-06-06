import { Sequelize, DataTypes } from 'sequelize';
import { knex } from 'knex';

const database_url = process.env.DATABASE_CONNECTION_POOL_URL || process.env.DATABASE_URL;

class SequelizeWithId extends Sequelize {
	/* Create standard id type for our database */
	idType = {
		primaryKey: true,
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
	};
}

if (!database_url) {
	throw new Error('DATABASE_URL environment variable not set');
}

const useSSL = database_url.indexOf('localhost') === -1;

export const sequelize = new SequelizeWithId(database_url, {
	logging: false,
	dialectOptions: { ssl: useSSL ? { rejectUnauthorized: false } : false },
	pool: {
		max: process.env.SEQUELIZE_MAX_CONNECTIONS
			? parseInt(process.env.SEQUELIZE_MAX_CONNECTIONS, 10)
			: 5, // Some migrations require this number to be 150
		// idle: 20000,
		// acquire: 20000,
	},
});

export const knexInstance = knex({ client: 'pg' });

/* Change to true to update the model in the database. */
/* NOTE: This being set to true will erase your data. */
if (process.env.NODE_ENV !== 'test') {
	sequelize.sync({ force: false });
}
