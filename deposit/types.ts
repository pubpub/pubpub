export type ResourceLicense = {
	/**
	 * SPDX license identifier.
	 * @see {@link https://spdx.org/licenses}
	 */
	spdxIdentifier: string;
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

// distinguish between vaguely creative roles and contributor roles
// any kind of creative input (dataviz) should be a kind of authorship - aspirational/visionary pubpub!

// what constitutes major/minor, creative/attributed is never gonna break down cleanly
// unless we choose primary (temporally – while its in production) vs secondary (pre/post?).

export type ResourceContributorKind = 'Person' | 'Organization'; // etc?? Gov't orgs, labs
export type ResourceContributorRole = 'Creator' | 'Editor' | 'Translator' | 'Other';

// Datacite
// export type ContributorType =
//   | "ContactPerson"
//   | "DataCollector"
//   | "DataCurator"
//   | "DataManager"
//   | "Distributor"
//   | "Editor"
//   | "HostingInstitution"
//   | "Other"
//   | "Producer"
//   | "ProjectLeader"
//   | "ProjectManager"
//   | "ProjectMember"
//   | "RegistrationAgency"
//   | "RegistrationAuthority"
//   | "RelatedPerson"
//   | "ResearchGroup"
//   | "RightsHolder"
//   | "Researcher"
//   | "Sponsor"
//   | "Supervisor"
//   | "WorkPackageLeader";

// Crossref
// Enumeration	author
// Enumeration	editor
// Enumeration	chair
// Enumeration	reviewer
// Enumeration	review-assistant
// Enumeration	stats-reviewer
// Enumeration	reviewer-external
// Enumeration	reader
// Enumeration	translator

export type ResourceContributor = { name: string; orcid?: string };

// Review Arcadia's credit taxonomy, tiered contributions (eg not instrumental to the creation of work)
// Review bibtex contribution roles
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

	relations: ResourceRelation[];
};
