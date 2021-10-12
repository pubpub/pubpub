import { getClientInitialData } from './initialData';

export const getFeatureFlag = (name: string): boolean => {
	const initialData = getClientInitialData();
	return !!initialData.featureFlags[name];
};
