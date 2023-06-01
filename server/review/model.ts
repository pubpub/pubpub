export default (sequelize, dataTypes) => {
	return sequelize.define(
		'reviewNew',
		{
			id: sequelize.idType,
			title: dataTypes.TEXT,
			number: { type: dataTypes.INTEGER, allowNull: false },
			status: {
				type: dataTypes.ENUM,
				values: ['open', 'closed', 'completed'],
				defaultValue: 'open',
			},
			releaseRequested: dataTypes.BOOLEAN,
			labels: dataTypes.JSONB,
			reviewContent: { type: dataTypes.JSONB, allowNull: true },
		},
		{
			tableName: 'ReviewNews',
			indexes: [
				{ fields: ['userId'], method: 'BTREE' },
				{ fields: ['pubId'], method: 'BTREE' },
			],
			classMethods: {
				associate: ({ reviewNew, ...models }) => {
					reviewNew.belongsTo(models.thread, {
						onDelete: 'CASCADE',
						foreignKey: { allowNull: false },
					});
					reviewNew.belongsTo(models.visibility, {
						foreignKey: { allowNull: false },
						onDelete: 'CASCADE',
					});
					reviewNew.belongsTo(models.user, {
						onDelete: 'CASCADE',
						as: 'author',
						foreignKey: 'userId',
						constraints: false,
					});
					reviewNew.belongsTo(models.pub, {
						onDelete: 'CASCADE',
					});
					reviewNew.hasMany(models.reviewer, {
						as: 'reviewers',
						onDelete: 'CASCADE',
						foreignKey: 'reviewId',
					});
				},
			},
		},
	);
};
