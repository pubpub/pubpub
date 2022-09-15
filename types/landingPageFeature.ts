import { Community, DefinitelyHas, Pub } from 'types';

export type LandingPageFeature = {
	id: string;
	communityId: null | string;
	pubId: null | string;
	rank: string;
	createdAt: string;
	updatedAt: string;
	pub?: null | DefinitelyHas<Pub, 'community'>;
	community?: null | Community;
};

export type LandingPageFeatureKind = 'pub' | 'community';

export type LandingPagePubFeature = DefinitelyHas<LandingPageFeature, 'pub'>;
export type LandingPageCommunityFeature = DefinitelyHas<LandingPageFeature, 'community'>;

export type LandingPageFeatureOfKind<Kind extends LandingPageFeatureKind> = Kind extends 'pub'
	? LandingPagePubFeature
	: Kind extends 'community'
	? LandingPageCommunityFeature
	: never;

export type LandingPageFeatures = {
	pub: LandingPagePubFeature[];
	community: LandingPageCommunityFeature[];
};
