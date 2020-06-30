export default (sequelize, dataTypes) => {
	return sequelize.define(
		'RelatedObject',
		{
			id: sequelize.idType,
			relationType: { types: dataTypes.STRING, allowNull: false },
            customRelationLabel: { types: dataTypes.STRING, allowNull: true },
			pubId: { type: dataTypes.UUID, allowNull: false },
			// A related object may not necessarily point to another Pub.
			targetPubId: { type: dataTypes.UUID, allowNull: true },
			blessedBySourcePub: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: true },
			blessedByTargetPub: { type: dataTypes.BOOLEAN, allowNull: true },
			// These are used for non-Pub sources
			title: { types: dataTypes.TEXT },
			byline: { types: dataTypes.TEXT },
			url: { types: dataTypes.TEXT },
			publicationDate: { types: dataTypes.DATE },
			// For Pub or non-Pub sources, a description is snapshotted at creation time.
			// By default, it's the abstract of a Pub, if one is available.
			description: { types: dataTypes.TEXT, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Pub, RelatedObject } = models;
					RelatedObject.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'sourcePub',
						foreignKey: 'sourcePubId',
					});
					RelatedObject.belongsTo(Pub, {
						onDelete: 'CASCADE',
						as: 'targetPub',
						foreignKey: 'targetPubId',
					});
				},
			},
		},
	);
};
