// @ts-check

/**
 * @param {object} options
 * @param {import('sequelize').Sequelize} options.Sequelize
 * @param {import('server/sequelize').sequelize} options.sequelize
 */
export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.getQueryInterface().addColumn('Communities', 'instagram', {
		// @ts-expect-error
		type: Sequelize.TEXT,
		defaultValue: null,
	});
	await sequelize.getQueryInterface().addColumn('Communities', 'mastodon', {
		// @ts-expect-error
		type: Sequelize.TEXT,
		defaultValue: null,
	});
};

/**
 * @param {object} options
 * @param {import('server/sequelize').sequelize} options.sequelize
 */
export const down = async ({ sequelize }) => {
	await sequelize.getQueryInterface().removeColumn('Communities', 'instagram');
	await sequelize.getQueryInterface().removeColumn('Communities', 'mastodon');
};
