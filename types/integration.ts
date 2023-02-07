export type Integration = {
	id: string;
	name: string;
	userId: string;
	externalUserData: ZoteroUserData;
};

export type AuthSchemeName = 'OAuth1'; // add auth schema names here and to enum in Integration model definition

export type IntegrationUserData = ZoteroUserData;

export type ZoteroUserData = {
	externalUsername: string;
	externalUserId: string;
};
