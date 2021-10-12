import {
	FeatureFlag,
	FeatureFlagUser,
	FeatureFlagOverrideState,
	FeatureFlagCommunity,
} from 'types';

type FeatureFlagOverride = FeatureFlagUser | FeatureFlagCommunity;

const getRandomFractionForUuid = (uuid: string) => {
	const sixBytes = uuid.split('-').pop()!;
	return parseInt(sixBytes, 16) / 0xffffffffffff; // largest six-byte integer
};

const passesThresholdFraction = (
	featureFlagUuid: string,
	targetModelUuid: string,
	threshold: number,
) => {
	if (threshold === 0) {
		return false;
	}
	const featureFlagValue = getRandomFractionForUuid(featureFlagUuid);
	const targetModelValue = getRandomFractionForUuid(targetModelUuid);
	return (featureFlagValue + targetModelValue) % 1 <= threshold;
};

export const getOverrideState = (
	featureFlagId: string,
	overrides: FeatureFlagOverride[],
): FeatureFlagOverrideState => {
	const matchingOverride = overrides.find((om) => om.featureFlagId === featureFlagId);
	if (matchingOverride) {
		return matchingOverride.enabled ? 'on' : 'off';
	}
	return 'inert';
};

export const isEnabledForModel = (
	featureFlagId: string,
	modelId: null | string,
	modelThreshold: number,
	modelOverrides: FeatureFlagOverride[],
) => {
	if (modelId) {
		const overrideState = getOverrideState(featureFlagId, modelOverrides);
		if (overrideState === 'inert') {
			return passesThresholdFraction(featureFlagId, modelId, modelThreshold);
		}
		return overrideState === 'on';
	}
	return false;
};

type GetEnabledForUserInCommunityOptions = {
	featureFlag: FeatureFlag;
	userId: null | string;
	communityId: null | string;
	featureFlagUsers: FeatureFlagUser[];
	featureFlagCommunities: FeatureFlagCommunity[];
};

export const isFeatureFlagEnabledForUserInCommunity = (
	options: GetEnabledForUserInCommunityOptions,
) => {
	const {
		featureFlag: { id: featureFlagId, enabledUsersFraction, enabledCommunitiesFraction },
		userId,
		communityId,
		featureFlagUsers,
		featureFlagCommunities,
	} = options;
	return (
		isEnabledForModel(featureFlagId, userId, enabledUsersFraction, featureFlagUsers) ||
		isEnabledForModel(
			featureFlagId,
			communityId,
			enabledCommunitiesFraction,
			featureFlagCommunities,
		)
	);
};
