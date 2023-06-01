export default (sequelize, dataTypes) => {
	return sequelize.define(
		'thread',
		{
			id: sequelize.idType,
			isLocked: dataTypes.BOOLEAN,
		},
		{
			tableName: 'Threads',
			classMethods: {
				associate: ({ thread, ...models }) => {
					thread.hasMany(models.discussion, { onDelete: 'CASCADE' });
					thread.hasMany(models.threadComment, {
						onDelete: 'CASCADE',
						as: 'comments',
						foreignKey: 'threadId',
					});
					thread.hasMany(models.threadEvent, {
						onDelete: 'CASCADE',
						as: 'events',
						foreignKey: 'threadId',
					});
				},
			},
		},
	);
};
