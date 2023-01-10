import { ExternalLoginProvider } from './externalLoginProvider';

export type UserLoginDataExternal = {
	id: string;
	userId: string;
	externalUserId: string;
	externalUsername: string;
	externalProviderId: string;
	externalProviderToken: string;
	externalLoginProvider?: ExternalLoginProvider;
};
