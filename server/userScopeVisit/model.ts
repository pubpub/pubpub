export default (sequelize, dataTypes) => {
	return sequelize.define('UserScopeVisit', {
		id: sequelize.idType,
		userId: { type: dataTypes.UUID, allowNull: true },
		pubId: { type: dataTypes.UUID, allowNull: true },
		collectionId: { type: dataTypes.UUID, allowNull: true },
		communityId: { type: dataTypes.UUID, allowNull: true },
	});
};
