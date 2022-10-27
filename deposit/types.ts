import { License } from 'types';

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

export enum ResourceAttributionKind {
	Creator = 'Creator',
	Editor = 'Editor',
	Translator = 'Translator',
	Chair = 'Chair',
}

export type ResourceContributor = {
	id: string;
	name: string;
	orcid?: string;
};

export type ResourceAttribution = {
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
	 * When the resource was last updated.
	 */
	timestamp: number;

	license: License;

	attributions: ResourceAttribution[];

	relations: ResourceRelation[];
};
