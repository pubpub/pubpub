enum ResourceKind {
	Book = 'Book',
	BookChapter = 'BookChapter',
	Journal = 'Journal',
	JournalArticle = 'JournalArticle',
	Conference = 'Conference',
	ConferenceProceeding = 'ConferenceProceeding',
}

enum ResourceRelationKind {
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

type ResourceRelation = {
	resource: Resource;
	kind: ResourceRelationKind;
};

enum ResourceAttributionKind {
	Creator = 'Creator',
	Editor = 'Editor',
	Translator = 'Translator',
	Chair = 'Chair',
}

type ResourceContributor = {
	id: string;
	name: string;
	orcid?: string;
};

type ResourceAttribution = {
	kind?: ResourceAttributionKind | string;
	contributor: ResourceContributor;
	affiliation?: string;
};

export type Resource = {
	/**
	 * A globally unique resource id.
	 */
	id: string;

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
	 * When the resource was made public.
	 */
	timestamp: number;

	attributions: ResourceAttribution[];

	relations: ResourceRelation[];
};
