// module.exports = async ({ sequelize }) => {
// 	await sequelize.queryInterface.queryInterface.addConstraint('ReviewNews', ['userId'], {
// 		type: 'foreign key',
// 		name: 'custom_fkey_constraint_name',
// 		references: {
// 			//Required field
// 			table: 'target_table_name',
// 			field: 'target_column_name',
// 		},
// 		onDelete: 'cascade',
// 		onUpdate: 'cascade',
// 	});
// };

module.exports = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.changeColumn('ReviewNews', 'userId', {
		type: Sequelize.TEXT,
		allowNull: true,
	});
};
