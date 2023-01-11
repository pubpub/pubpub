import { Integration } from './integration';

export type IntegrationDataOAuth1 = {
	id: string;
	userId: string;
	externalUserId: string;
	externalUsername: string;
	integrationId: string;
	accessToken: string;
	integration?: Integration;
};
