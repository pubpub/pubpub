import { initServer } from '@ts-rest/express';

import { contract } from 'utils/api/contract';

const s = initServer();

export const analyticsSettingsServer = s.router(contract.analyticsSettings, {
	// TODO:
});
