import { Attributes } from 'sequelize';

import {
	FeatureFlag as FeatureFlagModel,
	FeatureFlagCommunity as FeatureFlagCommunityModel,
	FeatureFlagUser as FeatureFlagUserModel,
} from 'server/models';

export type FeatureFlagOverrideState = 'inert' | 'off' | 'on';

export type FeatureFlagUser = Attributes<FeatureFlagUserModel>;

export type FeatureFlagCommunity = Attributes<FeatureFlagCommunityModel>;

export type FeatureFlag = Attributes<FeatureFlagModel>;
