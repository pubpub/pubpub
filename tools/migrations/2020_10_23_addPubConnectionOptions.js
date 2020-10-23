module.exports = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.addColumn('Pubs', 'connectionListingView', {
		type: Sequelize.ENUM,
		values: ['list', 'carousel'],
		defaultValue: 'carousel',
	});
	await sequelize.queryInterface.addColumn('Pubs', 'connectionDescriptionVisible', {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	});
};
