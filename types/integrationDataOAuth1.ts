import { Integration } from './integration';

export type IntegrationDataOAuth1 = {
	id: string;
	integrationId: string;
	accessToken: string;
	integration?: Integration;
};
