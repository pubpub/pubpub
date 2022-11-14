export type ResourceLicense = {
	/**
	 * SPDX license identifier.
	 * @see {@link https://spdx.org/licenses}
	 */
	spdxIdentifier: string;
};

export type ResourceKind =
	| 'Book'
	| 'BookChapter'
	| 'Journal'
	| 'JournalArticle'
	| 'Conference'
	| 'ConferenceProceeding'
	| 'Other';

export type ResourceRelation =
	| 'Comment'
	| 'Preprint'
	| 'Reply'
	| 'Review'
	| 'Supplement'
	| 'Translation'
	| 'Version';

export type ResourceRelationship = {
	relation: ResourceRelation;
	resource: Resource;
};

export type ResourceContributorKind = 'Person' | 'Organization';
export type ResourceContributorRole = 'Creator' | 'Editor' | 'Translator' | 'Other';
export type ResourceContributor = { name: string; orcid?: string };

export type ResourceContribution = {
	contributor: ResourceContributor;
	contributorAffiliation: string | undefined;
	contributorRole: ResourceContributorRole;
	isAttribution: boolean;
};

export type Resource = {
	/**
	 * The type of resource.
	 */
	kind: ResourceKind;

	/**
	 * The title of the resource.
	 */
	title: string;

	/**
	 * The resource's canonical URL.
	 */
	url: string;

	/**
	 * The version of the resource expressed as a UTC datetime string.
	 */
	timestamp: string;

	license: ResourceLicense;

	contributions: ResourceContribution[];

	relationships: ResourceRelationship[];
};
