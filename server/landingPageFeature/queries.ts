import * as types from 'types';
import { LandingPageFeature } from 'server/models';

type CreateLandingPageFeatureOptions = {
	pubId?: string;
	communityId?: string;
	rank: string;
};

export const createLandingPageFeature = async (
	options: CreateLandingPageFeatureOptions,
): Promise<types.LandingPageFeature> => {
	const { pubId, communityId, rank } = options;
	const newFeature = await LandingPageFeature.create({ pubId, communityId, rank });
	return newFeature;
};

type UpdateLandingPageFeatureOptions = {
	id: string;
	rank: string;
};

export const updateLandingPageFeature = async (options: UpdateLandingPageFeatureOptions) => {
	const { id, rank } = options;
	await LandingPageFeature.update({ rank }, { where: { id }, limit: 1 });
};

type destroyLandingPageFeatureOptions = {
	id: string;
};

export const destroyLandingPageFeature = async (options: destroyLandingPageFeatureOptions) => {
	const { id } = options;
	return LandingPageFeature.destroy({ where: { id }, limit: 1 });
};
