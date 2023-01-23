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
				associate: (models) => {
					const { discussion, thread, threadComment, threadEvent } = models;
					thread.hasMany(discussion, { onDelete: 'CASCADE' });
					thread.hasMany(threadComment, {
						onDelete: 'CASCADE',
						as: 'comments',
						foreignKey: 'threadId',
					});
					thread.hasMany(threadEvent, {
						onDelete: 'CASCADE',
						as: 'events',
						foreignKey: 'threadId',
					});
				},
			},
		},
	);
};
