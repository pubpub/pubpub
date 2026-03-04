export const up = async ({ Sequelize, sequelize }) => {
	await sequelize.queryInterface.createTable('UserCommunityFlags', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		userId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: { model: 'Users', key: 'id' },
			onDelete: 'CASCADE',
		},
		communityId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: { model: 'Communities', key: 'id' },
			onDelete: 'CASCADE',
		},
		flaggedById: {
			type: Sequelize.UUID,
			allowNull: false,
			references: { model: 'Users', key: 'id' },
			onDelete: 'CASCADE',
		},
		reason: {
			type: Sequelize.ENUM('spam-content', 'hateful-language', 'harassment', 'impersonation', 'other'),
			allowNull: false,
		},
		reasonText: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		sourceDiscussionId: {
			type: Sequelize.UUID,
			allowNull: true,
			references: { model: 'Discussions', key: 'id' },
			onDelete: 'SET NULL',
		},
		status: {
			type: Sequelize.ENUM('active', 'dismissed', 'escalated'),
			allowNull: false,
			defaultValue: 'active',
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: false,
		},
	});

	await sequelize.queryInterface.addIndex('UserCommunityFlags', ['userId']);
	await sequelize.queryInterface.addIndex('UserCommunityFlags', ['communityId']);
	await sequelize.queryInterface.addIndex('UserCommunityFlags', ['userId', 'communityId']);
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.dropTable('UserCommunityFlags');
};
