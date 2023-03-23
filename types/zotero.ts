export type ZoteroIntegration = {
	id: string;
	userId: string;
	externalUsername: string;
	externalUserId: string;
	integrationDataOAuth1Id: string;
};

export type ZoteroCSLJSON = {
	bib: string;
	bibtex: string;
	structured: string;
	key: string;
};
