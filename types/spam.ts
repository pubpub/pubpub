export type SpamStatus =
	| 'suspected-not-spam'
	| 'suspected-spam'
	| 'confirmed-spam'
	| 'confirmed-not-spam';

export type SpamTag = {
	id: string;
	spamScore: number;
	spamScoreVersion: number;
	spamScoreComputedAt: string;
	status: SpamStatus;
};

export type SpamVerdict = Pick<
	SpamTag,
	'spamScore' | 'spamScoreVersion' | 'status' | 'spamScoreComputedAt'
>;
