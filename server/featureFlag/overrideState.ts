import { FeatureFlagOverrideState } from 'types';

type CreateWhereQuery = (id: string) => Record<string, any>;

export const createOverrideSetter = (OverrideModel: any, createWhereQuery: CreateWhereQuery) => {
	return async (
		featureFlagId: string,
		targetModelId: string,
		state: FeatureFlagOverrideState,
	) => {
		const where = { ...createWhereQuery(targetModelId), featureFlagId };
		if (state === 'inert') {
			await OverrideModel.destroy({ where });
		} else {
			const existingEntry = await OverrideModel.findOne({ where });
			if (existingEntry) {
				existingEntry.enabled = state === 'on';
				await existingEntry.save();
			} else {
				await OverrideModel.create({ ...where, enabled: state === 'on' });
			}
		}
	};
};
