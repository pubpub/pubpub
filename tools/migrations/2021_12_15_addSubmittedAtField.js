export const up = async ({ sequelize, Sequelize }) => {
	await sequelize.queryInterface.addColumn('Submission', 'submittedAt', {
		type: Sequelize.DATE,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Submission', 'submittedAt');
};
