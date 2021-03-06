export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Merge',
		{
			id: sequelize.idType,
			noteContent: { type: dataTypes.JSONB },
			noteText: { type: dataTypes.TEXT },
			/* Set by Associations */
			userId: { type: dataTypes.UUID, allowNull: false },
			pubId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { User, Merge } = models;
					Merge.belongsTo(User, {
						onDelete: 'CASCADE',
						as: 'user',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
