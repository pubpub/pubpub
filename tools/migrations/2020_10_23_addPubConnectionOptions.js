module.exports = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.addColumn('Pubs', 'pubEdgeListingDefaultsToCarousel', {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	});
	await sequelize.queryInterface.addColumn('Pubs', 'pubEdgeDescriptionVisible', {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	});
};
