import {
	FeatureFlag as FeatureFlagModel,
	FeatureFlagCommunity as FeatureFlagCommunityModel,
	FeatureFlagUser as FeatureFlagUserModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type FeatureFlagOverrideState = 'inert' | 'off' | 'on';

export type FeatureFlagUser = RecursiveAttributes<FeatureFlagUserModel>;

export type FeatureFlagCommunity = RecursiveAttributes<FeatureFlagCommunityModel>;

export type FeatureFlag = RecursiveAttributes<FeatureFlagModel>;
