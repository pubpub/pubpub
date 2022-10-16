export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.changeColumn('Commenters', 'discussionId', {
		type: Sequelize.UUID,
		allowNull: true,
	});
};

export const down = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.changeColumn('Commenters', 'discussionId', {
		type: Sequelize.UUID,
		allowNull: false,
	});
};
