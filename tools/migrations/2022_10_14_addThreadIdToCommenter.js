export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.addColumn('Commenters', 'threadId', {
		type: Sequelize.STRING,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Commenters', 'threadId');
};
