export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.addColumn('ThreadComments', 'commenterId', {
		type: Sequelize.STRING,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('ThreadComments', 'commenterId');
};
