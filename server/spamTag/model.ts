export default (sequelize, dataTypes) => {
	return sequelize.define('SpamTag', {
		id: sequelize.idType,
		spamScore: dataTypes.DOUBLE,
		spamScoreComputedAt: dataTypes.DATE,
		spamScoreVersion: {
			type: dataTypes.INTEGER,
			defaultValue: 1,
		},
		status: {
			type: dataTypes.ENUM(
				'suspected-not-spam',
				'suspected-spam',
				'confirmed-spam',
				'confimed-not-spam',
			),
		},
	});
};
