export const up = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Communitites', 'branchId');
	await sequelize.queryInterface.removeColumn('Communitites', 'branchId');
};

export const down = async ({ sequelize, Sequelize }) => {
	await sequelize.queryInterface.addColumn('Exports', 'branchId', {
		type: Sequelize.UUID,
	});
	await sequelize.queryInterface.addColumn('Releases', 'branchId', {
		type: Sequelize.UUID,
	});
	await sequelize.queryInterface.addColumn('Releases', 'branchKey', {
		type: Sequelize.UUID,
	});
	await sequelize.queryInterface.addColumn('Releases', 'sourceBranchId', {
		type: Sequelize.UUID,
	});
	await sequelize.queryInterface.addColumn('Releases', 'sourceBranchKey', {
		type: Sequelize.INTEGER,
	});
	await sequelize.queryInterface.addColumn('ReviewNews', 'branchId', {
		type: Sequelize.UUID,
	});
};
