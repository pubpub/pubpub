export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.addColumn('Members', 'receivesDigestEmail', {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Members', 'receivesDigestEmail');
};
