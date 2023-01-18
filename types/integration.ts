export type Integration = {
	id: string;
	name: string;
	externalUserData: ZoteroUserData;
};

export type AuthSchemeName = 'OAuth1';

export type IntegrationUserData = ZoteroUserData;

export type ZoteroUserData = {
	externalUsername: string;
	externalUserId: string;
};
