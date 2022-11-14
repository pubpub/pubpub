export type ResourceLicense = {
	/**
	 * SPDX license identifier.
	 * @see {@link https://spdx.org/licenses}
	 */
	id: string;
};

export enum ResourceKind {
	Book = 'Book',
	BookChapter = 'BookChapter',
	Journal = 'Journal',
	JournalArticle = 'JournalArticle',
	Conference = 'Conference',
	ConferenceProceeding = 'ConferenceProceeding',
}

export enum ResourceRelationKind {
	Comment = 'Comment',
	Commentary = 'Commentary',
	Preprint = 'Preprint',
	Rejoinder = 'Rejoinder',
	Reply = 'Reply',
	Review = 'Review',
	Supplement = 'Supplement',
	Translation = 'Translation',
	Version = 'Version',
}

export type ResourceRelation = {
	resource: Resource;
	kind: ResourceRelationKind;
};

export type ResourceContributorKind = 'Person' | 'Organization';
export type ResourceContributorRole = 'Creator' | 'Editor' | 'Translator' | 'Chair';

export type ResourceContributor = {
	name: string;
	kind: ResourceContributorKind;
	orcid?: string;
};

export type ResourceContribution = {
	contributor: ResourceContributor;
	contributorAffiliation: string;
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

	relations: ResourceRelation[];
};
