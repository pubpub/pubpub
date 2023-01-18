import { Integration } from './integration';

export type IntegrationDataOAuth1 = {
	id: string;
	userId: string;
	integrationId: string;
	accessToken: string;
	integration?: Integration;
};
