export type MinUser = {
	id: string;
	slug: string;
	initials: string;
	fullName: string;
	firstName: string;
	lastName: string;
	avatar?: string;
	title?: string;
	orcid?: string;
	isShadowUser?: boolean;
	publicEmail?: string;
};

export type User = MinUser & {
	slug: string;
	bio: string;
	location: string;
	website: string;
	facebook: string;
	twitter: string;
	github: string;
	googleScholar: string;
	passwordDigest: string;
	hash: string;
	salt: string;
	email: string;
	resetHash: string;
	resetHashExpiration: number;
};
