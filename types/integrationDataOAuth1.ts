import { ZoteroIntegration } from './zoteroIntegration';

export type IntegrationDataOAuth1 = {
	id: string;
	integrationId: string;
	accessToken: string;
	integration?: ZoteroIntegration;
};
