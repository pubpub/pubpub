/** @jsx x */
/** @jsxFrag null */
import { x } from '@pubpub/deposit-utils/datacite';
import {
	Resource,
	ResourceContribution,
	ResourceDescriptor,
	ResourceKind,
	ResourceSummaryKind,
	ResourceContributorRole,
	ResourceRelationship,
	ResourceRelation,
} from 'deposit/types';
import { DepositTarget } from 'types';
import { exists, expect } from 'utils/assert';
import { aes256Decrypt } from 'utils/crypto';

function transformResourceKindToDataciteResourceType(kind: ResourceKind) {
	switch (kind) {
		case 'Book':
			return 'Book';
		case 'BookChapter':
			return 'BookChapter';
		case 'Conference':
		case 'ConferenceProceeding':
			return 'ConferenceProceeding';
		case 'ConferencePaper':
			return 'ConferencePaper';
		case 'Journal':
		case 'JournalIssue':
			return 'Journal';
		case 'JournalArticle':
			return 'JournalArticle';
	}
	return 'Other';
}

function transformResourceDescriptionKindToDataciteDescriptionType(kind: ResourceDescriptor) {
	switch (kind) {
		case 'Process':
			return 'Methods';
		case 'Mechanism':
			return 'TechnicalInfo';
	}
	return 'Other';
}

function transformResourceSummaryKindToDataciteDescriptionType(kind: ResourceSummaryKind) {
	switch (kind) {
		case 'Synopsis':
			return 'Abstract';
	}
	return 'Other';
}

function transformResourceContributorRoleToDataciteContributorType(role: ResourceContributorRole) {
	switch (role) {
		case 'Editor':
			return 'Editor';
	}
	return 'Other';
}

function transformResourceRelationToDataciteRelationType(
	relation: ResourceRelation,
	isParent: boolean,
) {
	switch (relation) {
		case 'Review':
			return isParent ? 'Reviews' : 'IsReviewedBy';
		case 'Reply':
		case 'Comment':
			return isParent ? 'References' : 'IsReferencedBy';
		case 'Preprint':
			return isParent ? 'IsPreviousVersionOf' : 'IsNewVersionOf';
		case 'Supplement':
			return isParent ? 'IsSupplementTo' : 'IsSupplementedBy';
		case 'Translation':
			return isParent ? 'IsVariantFormOf' : 'IsOriginalFormOf';
		case 'Version':
			return isParent ? 'IsVersionOf' : 'HasVersion';
	}
}

function renderCreator(contribution: ResourceContribution) {
	return (
		<creator>
			<creatorName>{contribution.contributor.name}</creatorName>
			{contribution.contributor.orcid ? (
				// @ts-expect-error
				<nameIdentifier schemeURI="https://orcid.org/" nameIdentifierScheme="ORCID">
					{contribution.contributor.orcid}
					{/* @ts-expect-error */}
				</nameIdentifier>
			) : undefined}
			{contribution.contributorAffiliation ? (
				// @ts-expect-error
				<affiliation>{contribution.contributorAffiliation}</affiliation>
			) : undefined}
		</creator>
	);
}

function renderContributor(contribution: ResourceContribution) {
	return (
		<contributor
			contributorType={transformResourceContributorRoleToDataciteContributorType(
				contribution.contributorRole,
			)}
		>
			<contributorName>{contribution.contributor.name}</contributorName>
			{contribution.contributorAffiliation ? (
				// @ts-expect-error
				<affiliation>{contribution.contributorAffiliation}</affiliation>
			) : undefined}
		</contributor>
	);
}

function renderRelatedItem(relationship: ResourceRelationship) {
	const identifier = relationship.resource.identifiers[0];
	return (
		<relatedItem
			relatedItemType={transformResourceKindToDataciteResourceType(
				relationship.resource.kind,
			)}
			relationType={transformResourceRelationToDataciteRelationType(
				relationship.relation,
				relationship.isParent,
			)}
		>
			<identifier identifierType={identifier.identifierKind}>
				{identifier.identifierValue}
			</identifier>
			<titles>{relationship.resource.title}</titles>
		</relatedItem>
	);
}

function renderRelatedIdentifier(relationship: ResourceRelationship) {
	const identifier = relationship.resource.identifiers[0];
	return (
		<relatedIdentifier
			relatedIdentifierType={identifier.identifierKind}
			resourceTypeGeneral={transformResourceKindToDataciteResourceType(
				relationship.resource.kind,
			)}
			relationType={transformResourceRelationToDataciteRelationType(
				relationship.relation,
				relationship.isParent,
			)}
		>
			{identifier.identifierValue}
		</relatedIdentifier>
	);
}

export function createDeposit(resource: Resource) {
	const wordCount = resource.summaries.find((summary) => summary.kind === 'WordCount');
	const publisher = expect(resource.meta['publisher']);
	const createdDate = expect(resource.meta['created-date']);
	const updatedDate = resource.meta['updated-date'];
	const { identifierValue: url } = expect(
		resource.identifiers.find((identifier) => identifier.identifierKind === 'URL'),
	);
	const { identifierValue: doi } = expect(
		resource.identifiers.find((identifier) => identifier.identifierKind === 'DOI'),
	);
	return (
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<resourceType
				resourceTypeGeneral={transformResourceKindToDataciteResourceType(resource.kind)}
			/>
			<publisher>{publisher}</publisher>
			<publicationYear>{new Date(resource.timestamp).getUTCFullYear()}</publicationYear>
			<identifier identifierType="DOI">{doi}</identifier>
			<titles>
				<title xml:lang="en-US">{resource.title}</title>
			</titles>
			<subjects></subjects>
			<dates>
				<date dateType="Created">{createdDate}</date>
				{exists(updatedDate) && <date dateType="Updated">{updatedDate}</date>}
			</dates>
			<descriptions>
				{resource.descriptions.map((description) => (
					<description
						xml:lang="en-US"
						descriptionType={transformResourceDescriptionKindToDataciteDescriptionType(
							description.kind,
						)}
					></description>
				))}
				{resource.summaries
					.filter((summary) => summary.kind !== 'WordCount')
					.map((summary) => (
						<description
							xml:lang="en-US"
							descriptionType={transformResourceSummaryKindToDataciteDescriptionType(
								summary.kind,
							)}
						></description>
					))}
			</descriptions>
			<creators>
				{resource.contributions
					.filter((contribution) => contribution.isAttribution)
					.map(renderCreator)}
			</creators>
			<contributors>
				{resource.contributions
					.filter((contribution) => !contribution.isAttribution)
					.map(renderContributor)}
			</contributors>
			<sizes>{wordCount && <size>${wordCount.value} words</size>}</sizes>
			<alternateIdentifiers>
				<alternateIdentifier
					// @ts-expect-error
					alternateIdentifierType="URL"
				>
					{url}
				</alternateIdentifier>
			</alternateIdentifiers>
			{/* <relatedItems>{resource.relationships.map(renderRelatedItem)}</relatedItems> */}
			<relatedIdentifiers>
				{resource.relationships.map(renderRelatedIdentifier)}
			</relatedIdentifiers>
			<version>1.0</version>
			<formats>
				<format>text/html</format>
			</formats>
			<language>en-US</language>
		</resource>
	);
}

function encodeDataciteCredentials(depositTarget: DepositTarget) {
	const { username, password, passwordInitVec } = depositTarget;
	const rawPassword = aes256Decrypt(
		password,
		expect(process.env.AES_ENCRYPTION_KEY),
		passwordInitVec,
	);
	return Buffer.from(`${username}:${rawPassword}`).toString('base64');
}

export async function createDataciteDoiWithMetadata(
	resourceXml: string,
	resourceUrl: string,
	resourceDoi: string,
	depositTarget: DepositTarget,
) {
	const encodedXml = Buffer.from(resourceXml).toString('base64');
	const encodedCredentials = encodeDataciteCredentials(depositTarget);
	const body = {
		data: {
			id: resourceDoi,
			type: 'dois',
			attributes: { event: 'publish', doi: resourceDoi, url: resourceUrl, xml: encodedXml },
		},
	};
	const response = await fetch('https://api.test.datacite.org/dois/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			Authorization: 'Basic ' + encodedCredentials,
		},
		body: JSON.stringify(body),
	});
	return await response.json();
}

export async function updateDataciteDoiMetadata(
	resourceXml: string,
	resourceUrl: string,
	resourceDoi: string,
	depositTarget: DepositTarget,
) {
	const encodedXml = Buffer.from(resourceXml).toString('base64');
	const encodedCredentials = encodeDataciteCredentials(depositTarget);
	const body = {
		data: {
			id: resourceDoi,
			type: 'dois',
			attributes: { event: 'publish', doi: resourceDoi, url: resourceUrl, xml: encodedXml },
		},
	};
	const response = await fetch('https://api.test.datacite.org/dois/' + resourceDoi, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			Authorization: 'Basic ' + encodedCredentials,
		},
		body: JSON.stringify(body),
	});
	return await response.json();
}
