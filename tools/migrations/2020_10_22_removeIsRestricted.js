module.exports = async ({ sequelize }) => {
	await sequelize.sync();
	await sequelize.queryInterface.removeColumn('Collections', 'isRestricted');
};
