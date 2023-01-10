import { ExternalLoginProvider } from './externalLoginProvider';

export type UserLoginDataExternal = {
	id: string;
	userId: string;
	externalProviderId: string;
	externalProviderToken: string;
	externalLoginProvider?: ExternalLoginProvider;
};
