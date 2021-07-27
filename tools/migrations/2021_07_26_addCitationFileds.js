export const up = async ({ sequelize, Sequelize }) => {
	await sequelize.queryInterface.addColumn('Communitites', 'citeAs', {
		type: Sequelize.TEXT,
	});
	await sequelize.queryInterface.addColumn('Communitites', 'publishAs', {
		type: Sequelize.TEXT,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Communitites', 'citeAs');
	await sequelize.queryInterface.removeColumn('Communitites', 'publishAs');
};
